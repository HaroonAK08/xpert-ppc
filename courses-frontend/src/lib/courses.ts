import { getDesignCourse, getDesignCourses } from '@/data/catalog';
import { API_URL } from './api';

export type CourseModule = { title: string; description: string; lessons: string[] };
export type CourseFaq = { question: string; answer: string };

export type PublicCourse = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: string;
  level: string;
  duration: string;
  format: string;
  outcomes: string[];
  results: string[];
  modules: CourseModule[];
  audience: string[];
  features: string[];
  tools: string[];
  faqs: CourseFaq[];
};

/** Prefer design catalog so the public UI matches the mockups pixel-for-pixel. */
export async function getCourses(): Promise<PublicCourse[]> {
  return getDesignCourses();
}

export async function getCourse(slug: string): Promise<PublicCourse | null> {
  const design = getDesignCourse(slug);
  if (design) return design;

  try {
    const res = await fetch(`${API_URL}/api/content/courses/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const body = await res.json();
    return body?.item ?? null;
  } catch {
    return null;
  }
}
