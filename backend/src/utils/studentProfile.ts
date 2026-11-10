export const PROFILE_COURSES = ['google-ads', 'meta-ads', 'tiktok-ads', 'seo', 'client-acquisition', 'web-development'] as const;

export type StudentProfile = {
  avatarUrl?: string | null;
  coursePreference?: string | null;
  freelancedBefore?: boolean | null;
  freelancingExperience?: string | null;
  workPreference?: string | null;
  gender?: string | null;
};

export function isStudentProfileComplete(student: StudentProfile): boolean {
  return Boolean(
    PROFILE_COURSES.some((slug) => slug === student.coursePreference) &&
    typeof student.freelancedBefore === 'boolean' &&
    (!student.freelancedBefore || (student.freelancingExperience?.trim().length ?? 0) >= 10) &&
    ['full-time', 'part-time'].includes(student.workPreference || '') &&
    ['male', 'female'].includes(student.gender || '') &&
    (student.gender !== 'male' || /^https?:\/\//i.test(student.avatarUrl || ''))
  );
}
