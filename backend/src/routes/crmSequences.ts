import { Router } from 'express';

import { EmailSequence, type EmailSequenceDoc } from '../models/EmailSequence';
import { SequenceEnrollment, type SequenceEnrollmentDoc } from '../models/SequenceEnrollment';
import { requireAuth, requireRole } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { ok } from '../utils/crmSerialize';
import { sequenceCreateSchema, sequenceUpdateSchema, enrollSchema } from '../validation/sequences';
import { enrollLeadInSequence } from '../services/sequences/enroll';

const router = Router();

router.use(requireAuth);

function serializeSequence(doc: EmailSequenceDoc & { _id: unknown; createdAt?: Date }) {
  return {
    id: String(doc._id),
    name: doc.name,
    steps: doc.steps,
    enabled: doc.enabled,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  };
}

function serializeEnrollment(doc: SequenceEnrollmentDoc & { _id: unknown }) {
  return {
    id: String(doc._id),
    sequenceId: String(doc.sequence),
    leadId: String(doc.lead),
    currentStep: doc.currentStep,
    status: doc.status,
    nextSendAt: doc.nextSendAt ? new Date(doc.nextSendAt).toISOString() : null,
    lastSentAt: doc.lastSentAt ? new Date(doc.lastSentAt).toISOString() : null,
  };
}

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const sequences = await EmailSequence.find().sort({ createdAt: -1 }).lean();
    res.json(ok(sequences.map(serializeSequence)));
  })
);

router.post(
  '/',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const parsed = sequenceCreateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message ?? 'Invalid sequence.');
    const seq = await EmailSequence.create({ ...parsed.data, createdBy: req.admin?.sub });
    res.status(201).json(ok(serializeSequence(seq.toObject())));
  })
);

router.patch(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const parsed = sequenceUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid payload.');
    const seq = await EmailSequence.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
    if (!seq) throw new ApiError(404, 'Sequence not found.');
    res.json(ok(serializeSequence(seq.toObject())));
  })
);

router.delete(
  '/:id',
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    const deleted = await EmailSequence.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(404, 'Sequence not found.');
    await SequenceEnrollment.updateMany({ sequence: req.params.id, status: 'active' }, { status: 'stopped' });
    res.json(ok({ id: req.params.id }));
  })
);

router.post(
  '/:id/enroll',
  asyncHandler(async (req, res) => {
    const parsed = enrollSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'A leadId is required.');

    const result = await enrollLeadInSequence(req.params.id, parsed.data.leadId);
    if (!result.ok) {
      const message =
        result.reason === 'sequence_not_found'
          ? 'Sequence not found.'
          : result.reason === 'lead_not_found'
            ? 'Lead not found.'
            : 'This sequence has no steps yet.';
      throw new ApiError(result.reason === 'no_steps' ? 400 : 404, message);
    }

    res.status(201).json(ok(serializeEnrollment(result.enrollment)));
  })
);

router.get(
  '/enrollments/:leadId',
  asyncHandler(async (req, res) => {
    const enrollments = await SequenceEnrollment.find({ lead: req.params.leadId })
      .sort({ createdAt: -1 })
      .lean();
    const sequences = await EmailSequence.find({ _id: { $in: enrollments.map((e) => e.sequence) } })
      .select('name')
      .lean();
    const nameById = new Map(sequences.map((s) => [String(s._id), s.name]));

    res.json(
      ok(
        enrollments.map((e) => ({
          ...serializeEnrollment(e),
          sequenceName: nameById.get(String(e.sequence)) || 'Unknown',
        }))
      )
    );
  })
);

router.post(
  '/enrollments/:enrollmentId/stop',
  asyncHandler(async (req, res) => {
    const enrollment = await SequenceEnrollment.findByIdAndUpdate(
      req.params.enrollmentId,
      { status: 'stopped' },
      { new: true }
    );
    if (!enrollment) throw new ApiError(404, 'Enrollment not found.');
    res.json(ok(serializeEnrollment(enrollment.toObject())));
  })
);

export default router;
