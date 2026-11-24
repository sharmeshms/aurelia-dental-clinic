import servicesJson from "../../../content/services.json";
import doctorsJson from "../../../content/doctors.json";
import postsJson from "../../../content/posts.json";
import galleryJson from "../../../content/gallery.json";
import testimonialsJson from "../../../content/testimonials.json";
import faqsJson from "../../../content/faqs.json";

export interface ServiceBenefit {
  title: string;
  text: string;
}
export interface ServiceStep {
  title: string;
  text: string;
}
export interface ServiceFaq {
  q: string;
  a: string;
}
export interface Service {
  slug: string;
  name: string;
  category: string;
  icon: string;
  image: string;
  tagline: string;
  summary: string;
  duration: string;
  featured: boolean;
  intro: string[];
  involves: string[];
  reasons: string[];
  benefits: ServiceBenefit[];
  process: ServiceStep[];
  technology: string[];
  faqs: ServiceFaq[];
  related: string[];
  active: boolean;
}

export interface AvailabilityDay {
  days: string[];
  slots: string[];
}
export interface Doctor {
  slug: string;
  name: string;
  designation: string;
  qualifications: string[];
  specialisation: string;
  experience: string;
  image: string;
  intro: string[];
  expertise: string[];
  languages: string[];
  availability: AvailabilityDay[];
  featured: boolean;
  isPlaceholder?: boolean;
  active: boolean;
}

export interface PostSection {
  heading: string;
  paragraphs: string[];
}
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  cover: string;
  featured: boolean;
  tags: string[];
  keyPoints: string[];
  sections: PostSection[];
  disclaimer: string;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  isIllustrative: boolean;
  featured: boolean;
  active: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  initials: string;
  treatment: string;
  rating: number;
  quote: string;
  date: string;
  isSample: boolean;
}

export interface FaqCategory {
  category: string;
  items: { q: string; a: string }[];
}

export const services = servicesJson as Service[];
export const doctors = doctorsJson as Doctor[];
export const posts = postsJson as Post[];
export const gallery = galleryJson as GalleryItem[];
export const testimonials = testimonialsJson as Testimonial[];
export const faqCategories = faqsJson as FaqCategory[];

export const featuredServices = services.filter((s) => s.featured);
export const serviceCategories = [
  "All Treatments",
  ...Array.from(new Set(services.map((s) => s.category))).sort(),
];

export const postCategories = [
  "All Articles",
  ...Array.from(new Set(posts.map((p) => p.category))).sort(),
];

export const galleryCategories = [
  "All",
  ...Array.from(new Set(gallery.map((g) => g.category))),
];

export const featuredDoctors = doctors.filter((d) => d.featured);

export function getService(slug?: string) {
  return services.find((s) => s.slug === slug);
}

export function getDoctor(slug?: string) {
  return doctors.find((d) => d.slug === slug);
}

export function getPost(slug?: string) {
  return posts.find((p) => p.slug === slug);
}

export function relatedServices(service: Service) {
  return service.related
    .map((slug) => getService(slug))
    .filter((s): s is Service => Boolean(s))
    .slice(0, 3);
}

export function relatedPosts(post: Post) {
  const sameCategory = posts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const others = posts.filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...sameCategory, ...others].slice(0, 3);
}

export const allFaqs = faqCategories.flatMap((group) => group.items);

export const ratingSummary = {
  average: 4.9,
  count: 128,
  distribution: [
    { stars: 5, percent: 92 },
    { stars: 4, percent: 6 },
    { stars: 3, percent: 1 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 0 },
  ],
};
