import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accordion } from "@/components/ui/Accordion";
import { Rating } from "@/components/ui/Rating";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { TestimonialCard } from "@/components/content/Cards";
import { ratingSummary, testimonials } from "@/data/content";
import { site, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  CTA band                                                           */
/* ------------------------------------------------------------------ */

export function CtaBand({
  eyebrow = "Appointments",
  title,
  description,
  primaryLabel = "Book an appointment",
  primaryTo = "/appointment",
  secondaryLabel,
  secondaryTo,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("py-16 lg:py-20", className)}>
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-burgundy-deep px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full border border-white/10" aria-hidden />
          <div className="pointer-events-none absolute -bottom-32 right-16 h-80 w-80 rounded-full border border-rose/20" aria-hidden />
          <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-rose/10 blur-3xl" aria-hidden />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <p className="eyebrow eyebrow-light mb-4">{eyebrow}</p>
              <h2 className="max-w-xl text-balance font-display text-[30px] leading-[1.15] text-white sm:text-[38px] lg:text-[42px]">
                {title}
              </h2>
              {description && (
                <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-white/60">{description}</p>
              )}
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink to={primaryTo} variant="light" size="md" iconRight={<ArrowRight className="h-4 w-4" />}>
                  {primaryLabel}
                </ButtonLink>
                {secondaryLabel && secondaryTo && (
                  <ButtonLink to={secondaryTo} variant="outlineLight" size="md">
                    {secondaryLabel}
                  </ButtonLink>
                )}
                <a
                  href={site.contact.phoneHref}
                  className="inline-flex h-11 items-center gap-2 px-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 text-rose" aria-hidden />
                  {site.contact.phone}
                </a>
              </div>
            </div>
            <div className="lg:justify-self-end">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ section                                                        */
/* ------------------------------------------------------------------ */

export function FaqSection({
  items,
  eyebrow = "Questions",
  title = "Answers before you commit",
  description,
  linkLabel = "View all questions",
  linkTo = "/faq",
  className,
  tone = "ivory",
  aside,
}: {
  items: { q: string; a: string }[];
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  linkLabel?: string;
  linkTo?: string;
  className?: string;
  tone?: "ivory" | "white";
  aside?: ReactNode;
}) {
  return (
    <section className={cn("py-16 lg:py-24", tone === "ivory" ? "bg-ivory" : "bg-white", className)}>
      <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h2 className="text-balance text-[30px] leading-[1.15] sm:text-[38px]">{title}</h2>
          {description && <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-muted">{description}</p>}
          <div className="mt-7 space-y-3">
            <Link to={linkTo} className="link-arrow">
              {linkLabel} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <div className="mt-6">{aside}</div>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <Accordion items={items} defaultOpen={0} />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */

export function TestimonialsSection({ className }: { className?: string }) {
  return (
    <section className={cn("bg-ivory py-16 lg:py-24", className)}>
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Patient experience"
              title="Kind words, shared with permission"
              description="The reviews below are sample content provided to demonstrate the design. They are not genuine patient testimonials and must be replaced with consented feedback before publication."
            />
          </Reveal>
          <Reveal delay={0.1} className="lg:justify-self-end">
            <div className="flex items-center gap-5 rounded-2xl border border-beige bg-white p-5 shadow-soft">
              <div>
                <p className="font-display text-4xl text-burgundy">{ratingSummary.average.toFixed(1)}</p>
                <Rating value={ratingSummary.average} size="sm" className="mt-1" />
              </div>
              <div className="h-12 w-px bg-beige" aria-hidden />
              <div>
                <p className="text-[13px] font-medium text-ink">Sample review summary</p>
                <p className="mt-1 text-[11.5px] text-muted">{ratingSummary.count} illustrative responses</p>
                <Badge tone="muted" className="mt-2">
                  Demonstration data
                </Badge>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Reveal key={testimonial.id} delay={index * 0.06}>
              <TestimonialCard testimonial={testimonial} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/testimonials" className="link-arrow">
            Read more patient stories <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Location & hours                                                   */
/* ------------------------------------------------------------------ */

export function LocationSection({ className }: { className?: string }) {
  const today = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(new Date());
  return (
    <section className={cn("bg-white py-16 lg:py-24", className)}>
      <div className="container-x">
        <SectionHeading
          eyebrow="Visit the studio"
          title="A quiet corner of Marylebone"
          description="Two minutes from Oxford Street, with step-free access and a calm waiting room. We look forward to welcoming you."
          action={
            <ButtonLink
              to={site.contact.mapsUrl}
              external
              variant="secondary"
              iconRight={<ArrowRight className="h-4 w-4" />}
            >
              Get directions
            </ButtonLink>
          }
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal className="overflow-hidden rounded-3xl border border-beige bg-ivory shadow-soft">
            <div className="relative min-h-[320px] overflow-hidden sm:min-h-[380px]">
              {site.contact.mapsEmbedUrl ? (
                <iframe
                  title="Clinic location map"
                  src={site.contact.mapsEmbedUrl}
                  className="h-full min-h-[380px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <MapPlaceholder />
              )}
              <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/95 p-4 shadow-soft backdrop-blur sm:left-5 sm:right-auto sm:max-w-sm">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-burgundy text-white">
                    <MapPin className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-ink">{site.name}</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
                      {site.contact.address.line1}, {site.contact.address.line2}, {site.contact.address.city}{" "}
                      {site.contact.address.postcode}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={site.contact.directionsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-burgundy text-[12px] font-medium text-white transition-colors hover:bg-burgundy-deep"
                  >
                    Directions
                  </a>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-burgundy/20 text-[12px] font-medium text-burgundy transition-colors hover:bg-burgundy-50"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="rounded-3xl border border-beige bg-white p-6 shadow-soft">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-rose" aria-hidden />
              <h3 className="font-display text-xl text-ink">Opening hours</h3>
            </div>
            <ul className="mt-4 divide-y divide-beige/80">
              {site.hours.map((entry) => {
                const isToday = entry.day === today;
                return (
                  <li
                    key={entry.day}
                    className={cn(
                      "flex items-center justify-between py-2.5 text-[13px]",
                      isToday ? "font-medium text-burgundy" : "text-ink/80",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {entry.day}
                      {isToday && <span className="rounded-full bg-burgundy-50 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em]">Today</span>}
                    </span>
                    <span className={cn(entry.closed ? "text-muted" : "")}>{entry.hours}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 space-y-2 rounded-2xl bg-ivory p-4 text-[12px] leading-relaxed text-muted">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-burgundy" aria-hidden />
                {site.contact.parkingNote}
              </p>
              <p className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-burgundy" aria-hidden />
                Step-free access and a ground-floor treatment suite.
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <ButtonLink to="/appointment" size="sm" className="w-full" iconLeft={<CalendarDays className="h-4 w-4" />}>
                Book an appointment
              </ButtonLink>
              <a
                href={site.contact.phoneHref}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-burgundy/20 text-[12.5px] font-medium text-burgundy transition-colors hover:bg-burgundy-50"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden /> {site.contact.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MapPlaceholder() {
  return (
    <div className="relative h-full min-h-[380px] w-full bg-[#efe8e3]" aria-label="Stylised map placeholder">
      <svg viewBox="0 0 800 500" className="h-full w-full" role="img" aria-label="Illustrative map of the clinic location">
        <rect width="800" height="500" fill="#EFE8E3" />
        <g stroke="#E1D5CE" strokeWidth="2">
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="500" />
          ))}
        </g>
        <g fill="#E6DAD2">
          <rect x="40" y="60" width="120" height="90" rx="6" />
          <rect x="200" y="40" width="150" height="70" rx="6" />
          <rect x="480" y="80" width="120" height="110" rx="6" />
          <rect x="640" y="40" width="110" height="80" rx="6" />
          <rect x="80" y="300" width="140" height="100" rx="6" />
          <rect x="560" y="320" width="170" height="90" rx="6" />
        </g>
        <path d="M0 250 C 160 240, 300 270, 460 250 S 700 230, 800 250" stroke="#D9C6BC" strokeWidth="26" fill="none" />
        <path d="M380 0 C 370 120, 410 260, 390 500" stroke="#D9C6BC" strokeWidth="22" fill="none" />
        <path d="M0 250 C 160 240, 300 270, 460 250 S 700 230, 800 250" stroke="#F8F4F1" strokeWidth="2" strokeDasharray="10 12" fill="none" />
        <g>
          <circle cx="395" cy="248" r="26" fill="#54172D" opacity="0.12" />
          <circle cx="395" cy="248" r="16" fill="#54172D" />
          <circle cx="395" cy="248" r="5" fill="#F8F4F1" />
        </g>
        <text x="415" y="240" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="600" fill="#54172D">
          Aurelia Dental Studio
        </text>
        <text x="415" y="257" fontFamily="Inter, sans-serif" fontSize="10" fill="#777078">
          18 Cavendish Row
        </text>
      </svg>
      <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted backdrop-blur">
        <Sparkles className="h-3 w-3 text-rose" aria-hidden />
        Map placeholder
      </span>
    </div>
  );
}
