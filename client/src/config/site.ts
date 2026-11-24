/**
 * CENTRAL BRAND & CLINIC CONFIGURATION
 * ------------------------------------------------------------------
 * Replace the values below with the real practice details. Nothing in
 * the UI hardcodes the clinic name, phone number or address, so this
 * file is the only place you need to edit for a rebrand.
 *
 * ⚠ Placeholder details: the phone number uses the UK drama range
 * (020 7946 0xxx) and the address, email and social handles are
 * examples. Replace them before going live.
 */

export const site = {
  name: "Aurelia Dental Studio",
  shortName: "Aurelia",
  legalName: "Aurelia Dental Studio Ltd",
  tagline: "Private dentistry, considered.",
  description:
    "A premium private dental practice offering considered, comfortable care — from preventive dentistry and implants to smile design and orthodontics.",
  established: 2012,
  demoMode: true,

  contact: {
    phone: "+44 20 7946 0182",
    phoneHref: "tel:+442079460182",
    email: "hello@aureliadental.studio",
    emailHref: "mailto:hello@aureliadental.studio",
    whatsapp: "442079460182",
    whatsappMessage:
      "Hello Aurelia Dental Studio, I would like to ask about an appointment.",
    address: {
      line1: "18 Cavendish Row",
      line2: "Marylebone",
      city: "London",
      postcode: "W1G 9AA",
      country: "United Kingdom",
    },
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=18+Cavendish+Row+London+W1G+9AA",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=18+Cavendish+Row+London+W1G+9AA",
    /** Paste a Google Maps embed URL here to replace the styled map placeholder. */
    mapsEmbedUrl: "",
    parkingNote:
      "Paid street parking is available on Cavendish Row, with a multi-storey car park three minutes' walk away.",
  },

  hours: [
    { day: "Monday", hours: "08:30 – 18:00" },
    { day: "Tuesday", hours: "08:30 – 18:00" },
    { day: "Wednesday", hours: "08:30 – 19:30" },
    { day: "Thursday", hours: "08:30 – 18:00" },
    { day: "Friday", hours: "08:30 – 17:00" },
    { day: "Saturday", hours: "09:00 – 14:00" },
    { day: "Sunday", hours: "Closed", closed: true },
  ],

  social: [
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  ],

  announcement: {
    message: "Now welcoming new patients — same-day emergency appointments available.",
    linkLabel: "Book a visit",
    linkTo: "/appointment",
  },

  stats: [
    { value: "18+", label: "Years of clinical experience" },
    { value: "2,400+", label: "Patients cared for" },
    { value: "6", label: "Specialist clinicians" },
    { value: "4.9/5", label: "Average patient rating" },
  ],

  booking: {
    /** Slots offered in the request form. The clinic confirms the final time. */
    timeSlots: [
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
      "17:30",
    ],
    maxDaysAhead: 120,
    minLeadDays: 0,
    responseTime: "within one working day",
    pendingNote:
      "Your request is not a confirmed appointment. Our team will contact you to confirm the exact time.",
  },

  emergency: {
    note: "If you have facial swelling affecting your breathing or swallowing, call emergency services immediately.",
    availability: "Urgent care slots are held each morning and afternoon.",
  },

  payments: [
    { title: "All major cards", detail: "Visa, Mastercard and American Express accepted." },
    { title: "Bank transfer", detail: "Account details provided with your written estimate." },
    { title: "Instalment plans", detail: "Subject to provider approval. Terms apply." },
    { title: "Insurance claims", detail: "Itemised invoices provided for reimbursement." },
  ],

  insurers: [
    "Major dental insurers",
    "Corporate schemes",
    "Fee-per-item claims",
    "Itemised invoicing",
    "Pre-authorisation support",
  ],

  /** Shown on the home page technology section. */
  technology: [
    {
      title: "Digital radiography",
      text: "Low-dose sensors and chairside review, so you can see what we see.",
    },
    {
      title: "Intraoral scanning",
      text: "Comfortable digital impressions replace traditional trays for most restorations.",
    },
    {
      title: "Digital smile design",
      text: "Photographic and digital planning to preview proportion and shade.",
    },
    {
      title: "Guided implant planning",
      text: "3D assessment and surgical guides for considered implant placement.",
    },
  ],

  values: [
    {
      title: "Unhurried appointments",
      text: "Time to ask questions, understand your options and make a decision without pressure.",
    },
    {
      title: "Conservative by default",
      text: "We recommend the least invasive treatment that will genuinely solve the problem.",
    },
    {
      title: "Transparent pricing",
      text: "Written estimates before treatment begins, with no surprises added later.",
    },
    {
      title: "One consistent team",
      text: "Your history stays with clinicians who know your smile and your preferences.",
    },
  ],

  approach: [
    {
      title: "Listen first",
      text: "Your concerns, history and goals shape everything that follows.",
    },
    {
      title: "Assess thoroughly",
      text: "Examination, imaging and photographs only where they add real information.",
    },
    {
      title: "Explain clearly",
      text: "Findings and options in plain language, including the option to do nothing.",
    },
    {
      title: "Treat conservatively",
      text: "Health first, then function, then aesthetics — in that order.",
    },
    {
      title: "Review and maintain",
      text: "Recall intervals and maintenance planned around your individual risk.",
    },
  ],

  seo: {
    defaultTitle: "Aurelia Dental Studio | Premium Private Dental Care",
    defaultDescription:
      "A premium private dental practice offering considered, comfortable care — from preventive dentistry and implants to smile design and orthodontics.",
    ogImage: "/images/hero-care.jpg",
  },

  legal: {
    privacyUpdated: "1 November 2026",
    termsUpdated: "1 November 2026",
  },
};

export type SiteConfig = typeof site;

export const addressLines = [
  site.contact.address.line1,
  `${site.contact.address.line2}, ${site.contact.address.city}`,
  site.contact.address.postcode,
];

export const fullAddress = [
  site.contact.address.line1,
  site.contact.address.line2,
  site.contact.address.city,
  site.contact.address.postcode,
].join(", ");

export const whatsappLink = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(
  site.contact.whatsappMessage,
)}`;
