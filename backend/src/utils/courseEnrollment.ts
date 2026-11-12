import mongoose from 'mongoose';

import { Enrollment } from '../models/Enrollment';
import { PortalCourse } from '../models/PortalCourse';
import { Student } from '../models/Student';

// Keep eligibility consistent with isStudentApproved and requireApprovedStudent.
import { ordinaryStudentFilter } from './studentInvitation';
const eligibleStudents = { ...ordinaryStudentFilter, active: true, $or: [
    { status: 'approved' },
    { emailVerified: true, status: { $ne: 'rejected' } },
  ],
};

async function insertMissingEnrollments(
  pairs: { studentId: mongoose.Types.ObjectId; courseId: mongoose.Types.ObjectId }[]
) {
  for (let offset = 0; offset < pairs.length; offset += 500) {
    const operations = pairs.slice(offset, offset + 500).map((pair) => ({
      updateOne: {
        filter: pair,
        update: { $setOnInsert: { ...pair, completedLessonIds: [] } },
        upsert: true,
      },
    }));
    try {
      await Enrollment.bulkWrite(operations, { ordered: false });
    } catch (err) {
      // Another request may have inserted the same unique pair in the meantime.
      if (
        err instanceof mongoose.mongo.MongoBulkWriteError &&
        Array.isArray(err.writeErrors) &&
        err.writeErrors.length > 0 &&
        err.writeErrors.every((error) => error.code === 11000) &&
        !err.result.getWriteConcernError()
      ) {
        continue;
      }
      throw err;
    }
  }
}

export async function enrollStudentInPublishedCourses(studentId: string): Promise<boolean> {
  const student = await Student.findOne({ _id: studentId, ...eligibleStudents }).select('_id');
  if (!student) return false;

  const [courses, enrollments] = await Promise.all([
    PortalCourse.find({ published: true }).select('_id'),
    Enrollment.find({ studentId: student._id }).select('courseId'),
  ]);
  const enrolledIds = new Set(enrollments.map((enrollment) => String(enrollment.courseId)));
  await insertMissingEnrollments(
    courses
      .filter((course) => !enrolledIds.has(String(course._id)))
      .map((course) => ({ studentId: student._id, courseId: course._id }))
  );
  return courses.length > 0;
}

export async function enrollApprovedStudentsInCourse(courseId: string): Promise<void> {
  const course = await PortalCourse.findOne({ _id: courseId, published: true }).select('_id');
  if (!course) return;

  const cursor = Student.find(eligibleStudents).select('_id').cursor();
  let pairs: { studentId: mongoose.Types.ObjectId; courseId: mongoose.Types.ObjectId }[] = [];
  for await (const student of cursor) {
    pairs.push({ studentId: student._id, courseId: course._id });
    if (pairs.length === 500) {
      await insertMissingEnrollments(pairs);
      pairs = [];
    }
  }
  await insertMissingEnrollments(pairs);
}

export async function backfillPublishedCourseEnrollments(): Promise<void> {
  const cursor = PortalCourse.find({ published: true }).select('_id').cursor();
  for await (const course of cursor) {
    await enrollApprovedStudentsInCourse(String(course._id));
  }
}
