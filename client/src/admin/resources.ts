export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "boolean"
  | "lines"
  | "json"
  | "image";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
  span?: 1 | 2;
  rows?: number;
};

export type ResourceConfig = {
  collection: "services" | "doctors" | "posts" | "gallery";
  singular: string;
  plural: string;
  description: string;
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  badgeField?: string;
  dateField?: string;
  fields: FieldConfig[];
  defaults: Record<string, unknown>;
};

export const serviceResource: ResourceConfig = {
  collection: "services",
  singular: "treatment",
  plural: "Treatments",
  description:
    "Treatment pages power the services index and every individual treatment page. Changes appear on the public site immediately.",
  titleField: "name",
  subtitleField: "category",
  imageField: "image",
  badgeField: "category",
  fields: [
    { name: "name", label: "Treatment name", type: "text", required: true, placeholder: "Dental Implants" },
    { name: "category", label: "Category", type: "text", required: true, placeholder: "Restorative" },
    { name: "tagline", label: "Tagline", type: "text", span: 2, placeholder: "A short, human line shown under the title" },
    {
      name: "summary",
      label: "Summary",
      type: "textarea",
      rows: 3,
      span: 2,
      hint: "One or two sentences used on cards and search results.",
    },
    { name: "duration", label: "Typical duration", type: "text", placeholder: "60–90 minutes" },
    { name: "icon", label: "Lucide icon name", type: "text", placeholder: "Stethoscope", hint: "Used on treatment cards." },
    { name: "image", label: "Image path", type: "image", span: 2, placeholder: "/images/treatment-general.jpg" },
    { name: "order", label: "Display order", type: "number", hint: "Lower numbers appear first." },
    { name: "featured", label: "Featured on homepage", type: "boolean" },
    { name: "active", label: "Visible on the public site", type: "boolean" },
    { name: "intro", label: "Introduction paragraphs", type: "lines", span: 2, rows: 5 },
    { name: "involves", label: "What it involves", type: "lines", span: 2, rows: 5 },
    { name: "reasons", label: "Reasons patients choose it", type: "lines", span: 2, rows: 5 },
    { name: "technology", label: "Technology and materials", type: "lines", span: 2, rows: 4 },
    { name: "related", label: "Related treatment slugs", type: "lines", span: 2, hint: "One slug per line, e.g. dental-crowns" },
    {
      name: "benefits",
      label: "Benefits (JSON)",
      type: "json",
      span: 2,
      rows: 8,
      hint: 'Array of objects: [{ "title": "…", "text": "…" }]',
    },
    {
      name: "process",
      label: "Process steps (JSON)",
      type: "json",
      span: 2,
      rows: 8,
      hint: 'Array of objects: [{ "title": "…", "text": "…" }]',
    },
    {
      name: "faqs",
      label: "Treatment FAQs (JSON)",
      type: "json",
      span: 2,
      rows: 8,
      hint: 'Array of objects: [{ "q": "…", "a": "…" }]',
    },
  ],
  defaults: {
    name: "",
    category: "",
    tagline: "",
    summary: "",
    duration: "",
    icon: "Stethoscope",
    image: "/images/treatment-general.jpg",
    order: 99,
    featured: false,
    active: true,
    intro: [],
    involves: [],
    reasons: [],
    technology: [],
    related: [],
    benefits: [],
    process: [],
    faqs: [],
  },
};

export const doctorResource: ResourceConfig = {
  collection: "doctors",
  singular: "clinician",
  plural: "Clinicians",
  description: "Clinician profiles appear on the team page and on individual profile pages, with availability and specialisms.",
  titleField: "name",
  subtitleField: "specialisation",
  imageField: "image",
  badgeField: "designation",
  fields: [
    { name: "name", label: "Full name", type: "text", required: true, placeholder: "Dr Amara Okafor" },
    { name: "designation", label: "Designation", type: "text", placeholder: "Principal Dentist" },
    { name: "specialisation", label: "Specialisation", type: "text", required: true, placeholder: "Restorative & implant dentistry" },
    { name: "experience", label: "Experience", type: "text", placeholder: "18 years" },
    { name: "image", label: "Portrait path", type: "image", span: 2, placeholder: "/images/doctor-1.jpg" },
    { name: "featured", label: "Featured on homepage", type: "boolean" },
    { name: "isPlaceholder", label: "Placeholder profile", type: "boolean", hint: "Mark demo clinicians that must be replaced." },
    { name: "active", label: "Visible on the public site", type: "boolean" },
    { name: "qualifications", label: "Qualifications", type: "lines", span: 2, rows: 3 },
    { name: "expertise", label: "Areas of expertise", type: "lines", span: 2, rows: 4 },
    { name: "languages", label: "Languages", type: "lines", span: 2, rows: 3 },
    { name: "intro", label: "Introduction paragraphs", type: "lines", span: 2, rows: 6 },
    {
      name: "availability",
      label: "Availability (JSON)",
      type: "json",
      span: 2,
      rows: 8,
      hint: 'Array of objects: [{ "days": ["Monday"], "slots": ["09:00"] }]',
    },
  ],
  defaults: {
    name: "",
    designation: "",
    specialisation: "",
    experience: "",
    image: "/images/doctor-1.jpg",
    featured: false,
    isPlaceholder: true,
    active: true,
    qualifications: [],
    expertise: [],
    languages: ["English"],
    intro: [],
    availability: [],
  },
};

export const postResource: ResourceConfig = {
  collection: "posts",
  singular: "article",
  plural: "Journal",
  description: "Journal articles appear on the blog index and each article page. Dates are shown as written.",
  titleField: "title",
  subtitleField: "category",
  imageField: "cover",
  badgeField: "category",
  dateField: "date",
  fields: [
    { name: "title", label: "Title", type: "text", required: true, span: 2, placeholder: "A calm guide to your first visit" },
    { name: "category", label: "Category", type: "text", required: true, placeholder: "Prevention" },
    { name: "author", label: "Author", type: "text", required: true, placeholder: "Dr Amara Okafor" },
    { name: "authorRole", label: "Author role", type: "text", placeholder: "Principal Dentist" },
    { name: "date", label: "Publication date", type: "date" },
    { name: "readTime", label: "Read time", type: "text", placeholder: "5 min read" },
    { name: "cover", label: "Cover image path", type: "image", span: 2, placeholder: "/images/treatment-consultation.jpg" },
    { name: "excerpt", label: "Excerpt", type: "textarea", rows: 3, span: 2, required: true },
    { name: "featured", label: "Featured article", type: "boolean" },
    { name: "active", label: "Visible on the public site", type: "boolean" },
    { name: "tags", label: "Tags", type: "lines", span: 2, rows: 3, hint: "One tag per line." },
    { name: "keyPoints", label: "Key points", type: "lines", span: 2, rows: 4 },
    {
      name: "sections",
      label: "Article sections (JSON)",
      type: "json",
      span: 2,
      rows: 12,
      hint: 'Array of objects: [{ "heading": "…", "paragraphs": ["…"] }]',
    },
    { name: "disclaimer", label: "Disclaimer", type: "textarea", rows: 3, span: 2 },
  ],
  defaults: {
    title: "",
    category: "",
    author: "",
    authorRole: "",
    date: new Date().toISOString().slice(0, 10),
    readTime: "5 min read",
    cover: "/images/treatment-consultation.jpg",
    excerpt: "",
    featured: false,
    active: true,
    tags: [],
    keyPoints: [],
    sections: [],
    disclaimer:
      "This article is general information, not personalised dental advice. Please book a consultation for an assessment of your own situation.",
  },
};

export const galleryResource: ResourceConfig = {
  collection: "gallery",
  singular: "gallery item",
  plural: "Gallery",
  description: "Gallery images are illustrative in this build. Replace them with consented clinical photography before publication.",
  titleField: "title",
  subtitleField: "category",
  imageField: "image",
  badgeField: "category",
  fields: [
    { name: "title", label: "Title", type: "text", required: true, span: 2 },
    { name: "category", label: "Category", type: "text", required: true, placeholder: "Smile aesthetics" },
    { name: "image", label: "Image path", type: "image", span: 2, placeholder: "/images/smile-woman-2.jpg" },
    { name: "description", label: "Description", type: "textarea", rows: 3, span: 2 },
    { name: "isIllustrative", label: "Mark as illustrative", type: "boolean" },
    { name: "featured", label: "Featured", type: "boolean" },
    { name: "active", label: "Visible in the gallery", type: "boolean" },
    { name: "order", label: "Display order", type: "number" },
  ],
  defaults: {
    title: "",
    category: "Smile aesthetics",
    image: "/images/smile-woman-2.jpg",
    description: "",
    isIllustrative: true,
    featured: false,
    active: true,
    order: 99,
  },
};

export const resources = {
  services: serviceResource,
  doctors: doctorResource,
  posts: postResource,
  gallery: galleryResource,
};
