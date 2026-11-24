import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  HeartHandshake,
  Phone,
  Quote,
  ReceiptText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { DoctorCard, GalleryCard, ServiceCard } from "@/components/content/Cards";
import {
  CtaBand,
  FaqSection,
  LocationSection,
  TestimonialsSection,
} from "@/components/sections/SharedSections";
import { featuredDoctors, gallery, services } from "@/data/content";
import { site } from "@/config/site";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const homeTreatmentSlugs = [
  "dental-implants",
  "teeth-whitening",
  "clear-aligners",
  "dental-veneers",
  "general-dentistry",
  "emergency-dental-care",
];

const homeFaqs = [
  {
    q: "I have not seen a dentist in years. Is that a problem?",
    a: "Not at all — it is more common than you might think. We start with a conversation and a gentle examination, then agree a plan at a pace that suits you. There is no judgement and no pressure to do everything at once.",
  },
  {
    q: "How does the appointment request work?",
    a: "You choose a preferred date, time and clinician online. Your request is received as pending; our team then contacts you to confirm the exact time. Nothing is confirmed until we have spoken.",
  },
  {
    q: "What does a first appointment involve?",
    a: "A consultation typically includes a discussion of your concerns, a full examination, any necessary radiographs and a written plan with options and costs. Most first visits take around 45 minutes.",
  },
  {
    q: "Do you offer payment plans?",
    a: "For eligible treatment plans we can discuss staged payments or third-party finance. Approval and terms are set by the finance provider. A written estimate is always provided before treatment begins.",
  },
  {
    q: "Can I choose which dentist I see?",
    a: "Yes, subject to availability. You can select a preferred clinician when booking, and we will confirm the appointment with that clinician where possible.",
  },
  {
    q: "What should I do in a dental emergency?",
    a: "Call the clinic as early as possible. We hold urgent slots each day. If you have facial swelling affecting your breathing or swallowing, seek emergency medical care immediately.",
  },
];

const values = [
  {
    icon: Clock,
    title: "Time to be heard",
    text: "Longer appointments and a clinician who listens before recommending anything at all.",
  },
  {
    icon: ShieldCheck,
    title: "Conservative by default",
    text: "The least invasive option that genuinely solves the problem — not the most profitable one.",
  },
  {
    icon: ReceiptText,
    title: "Clear, written costs",
    text: "An itemised estimate before treatment starts, with no surprises added along the way.",
  },
  {
    icon: HeartHandshake,
    title: "A team who knows you",
    text: "Continuity of care, with your history and preferences understood at every visit.",
  },
];

export default function HomePage() {
  useSeo({
    description:
      "Aurelia Dental Studio is a premium private dental practice in Marylebone, London — preventive dentistry, implants, orthodontics, cosmetic care and same-day emergency appointments.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Dentist",
      name: site.name,
      telephone: site.contact.phone,
      email: site.contact.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.contact.address.line1,
        addressLocality: site.contact.address.city,
        postalCode: site.contact.address.postcode,
        addressCountry: "GB",
      },
    },
  });

  const treatments = homeTreatmentSlugs
    .map((slug) => services.find((service) => service.slug === slug))
    .filter((service): service is (typeof services)[number] => Boolean(service));

  const galleryPreview = [
    gallery.find((item) => item.id === "g-01"),
    gallery.find((item) => item.id === "g-16"),
    gallery.find((item) => item.id === "g-03"),
  ].filter((item): item is (typeof gallery)[number] => Boolean(item));

  return (
    <>
      <Hero />
      <StatsBand />
      <Intro />
      <FeaturedTreatments treatments={treatments} />
      <WhyChooseUs />
      <DentistsPreview />
      <Technology />
      <SmilePreview items={galleryPreview} />
      <TestimonialsSection />
      <Insurance />
      <FaqSection
        items={homeFaqs}
        eyebrow="Before your visit"
        title="Questions we hear most often"
        description="If your question is not here, our reception team is always happy to talk it through."
        aside={
          <div className="rounded-2xl border border-beige bg-white p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-burgundy">Prefer to talk?</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">
              Call the studio and speak to a human, not a booking bot.
            </p>
            <a
              href={site.contact.phoneHref}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-burgundy"
            >
              <Phone className="h-4 w-4" aria-hidden /> {site.contact.phone}
            </a>
          </div>
        }
      />
      <CtaBand
        eyebrow="Your first visit"
        title="A considered appointment, from the moment you arrive."
        description="Tell us a little about what you need. We will confirm a time that works and explain exactly what to expect."
        secondaryLabel="Explore treatments"
        secondaryTo="/services"
      >
        <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose">What happens next</p>
          <ol className="mt-3 space-y-3">
            {[
              "We review your request and check availability",
              "Reception calls or emails to confirm",
              "You receive a written appointment summary",
            ].map((step, index) => (
              <li key={step} className="flex gap-3 text-[12.5px] leading-snug text-white/75">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-rose/40 text-[10px] text-rose">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-white/40">
            Requests are pending until confirmed by the clinic.
          </p>
        </div>
      </CtaBand>
      <LocationSection />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ivory">
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-rose/15 blur-3xl"
        aria-hidden
      />
      <div className="container-x relative grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-24 lg:pt-16">
        <div>
          <Reveal>
            <p className="flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.24em] text-burgundy-soft">
              <span className="h-px w-8 bg-rose" aria-hidden />
              Private dentistry · Marylebone
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-6 text-balance text-[42px] leading-[1.04] tracking-[-0.02em] sm:text-[56px] lg:text-[65px]">
              Your smile deserves{" "}
              <em className="relative inline-block font-normal italic text-burgundy">
                exceptional
                <svg
                  className="absolute -bottom-2 left-0 w-full text-rose/70"
                  viewBox="0 0 240 12"
                  fill="none"
                  aria-hidden
                >
                  <path d="M2 8.5C58 3 148 2 238 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </em>{" "}
              care.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 max-w-lg text-pretty text-[15.5px] leading-[1.85] text-muted">
              Experience personalised dental care, advanced technology and a comfortable treatment experience designed
              around your smile — with a team who explains every step.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink
                to="/appointment"
                size="lg"
                iconRight={<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />}
              >
                Book an appointment
              </ButtonLink>
              <ButtonLink to="/services" variant="secondary" size="lg">
                Explore treatments
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-beige pt-6">
              <div className="flex items-center gap-3">
                <Rating value={4.9} size="sm" />
                <span className="text-[11.5px] leading-tight text-muted">
                  <span className="block font-medium text-ink">4.9 / 5</span>
                  Sample review data
                </span>
              </div>
              <span className="hidden h-8 w-px bg-beige sm:block" aria-hidden />
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[11.5px] text-muted">
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-burgundy" aria-hidden /> New patients welcome
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-burgundy" aria-hidden /> Same-day urgent care
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-burgundy" aria-hidden /> Written estimates
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.12} y={28} className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <div
            className="absolute -right-3 -top-3 h-[92%] w-[92%] rounded-[2.5rem] rounded-tr-[4.5rem] border border-rose/50"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-[2.5rem] rounded-tr-[4.5rem] bg-beige shadow-lift">
            <img
              src="/images/hero-care.jpg"
              alt="A patient smiling comfortably during a dental appointment at Aurelia Dental Studio"
              className="img-grade aspect-[4/5] w-full object-cover"
              width={880}
              height={1100}
              {...{ fetchpriority: "high" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/25 via-transparent to-transparent" aria-hidden />
            <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-burgundy shadow-soft backdrop-blur">
              Est. {site.established}
            </div>
          </div>

          <div className="absolute -left-3 bottom-6 w-[248px] rounded-2xl border border-beige/80 bg-white p-4 shadow-lift sm:-left-6 sm:bottom-8">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-burgundy-50 text-burgundy">
                <CalendarDays className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-rose">Next availability</p>
                <p className="text-[13px] font-medium text-ink">This week</p>
              </div>
            </div>
            <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted">
              Morning and afternoon appointments, including Saturdays.
            </p>
            <Link to="/appointment" className="mt-3 flex items-center justify-between text-[11.5px] font-semibold text-burgundy">
              Request a time
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          <div className="absolute -right-2 top-1/2 hidden -translate-y-1/2 rotate-90 text-[9px] font-semibold uppercase tracking-[0.3em] text-burgundy/30 xl:block">
            Aurelia Dental Studio
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */

function StatsBand() {
  return (
    <section className="border-b border-beige/70 bg-white">
      <div className="container-x grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4 lg:py-12">
        {site.stats.map((stat, index) => (
          <Reveal
            key={stat.label}
            delay={index * 0.05}
            className={cn(
              "px-2 text-center lg:px-8 lg:text-left",
              index !== 0 && "lg:border-l lg:border-beige/80",
              index % 2 !== 0 && "border-l border-beige/80 lg:border-l",
            )}
          >
            <p className="font-display text-[34px] leading-none text-burgundy sm:text-[40px]">{stat.value}</p>
            <p className="mt-2 text-[11.5px] leading-snug text-muted">{stat.label}</p>
          </Reveal>
        ))}
      </div>
      <p className="container-x pb-4 text-center text-[10px] uppercase tracking-[0.14em] text-muted">
        Sample practice figures for demonstration
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Intro                                                              */
/* ------------------------------------------------------------------ */

function Intro() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative mx-auto w-full max-w-[540px]">
          <div className="absolute -left-3 -top-3 h-[88%] w-[88%] rounded-[2rem] bg-burgundy-50" aria-hidden />
          <div className="relative overflow-hidden rounded-[2rem] bg-beige shadow-soft">
            <img
              src="/images/clinic-office.jpg"
              alt="A clinician standing in one of the bright, calm treatment rooms"
              className="img-grade aspect-[4/5] w-full object-cover"
              loading="lazy"
              width={880}
              height={1100}
            />
          </div>
          <div className="absolute -bottom-6 -right-2 w-[54%] overflow-hidden rounded-2xl border-[6px] border-white bg-beige shadow-lift sm:-right-6">
            <img
              src="/images/clinic-consult.jpg"
              alt="A dentist talking through a treatment plan with a patient"
              className="img-grade aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -left-3 top-6 rounded-xl bg-white px-4 py-3 shadow-soft sm:-left-6">
            <p className="font-display text-2xl leading-none text-burgundy">{new Date().getFullYear() - site.established}</p>
            <p className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted">Years of care</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="eyebrow mb-4">The practice</p>
          <h2 className="text-balance text-[32px] leading-[1.13] sm:text-[40px]">
            Dentistry that makes room for you.
          </h2>
          <p className="mt-5 text-[14.5px] leading-[1.85] text-muted">
            Aurelia was founded on a simple observation: most people do not dislike dentistry, they dislike feeling
            rushed, uninformed or sold to. So we built a practice around the opposite.
          </p>
          <p className="mt-3.5 text-[14.5px] leading-[1.85] text-muted">
            Every appointment has time in it. Every recommendation comes with an explanation and an alternative. And
            every plan is written down before anything begins.
          </p>

          <ul className="mt-6 space-y-3">
            {[
              "A single clinical team who know your history",
              "Preventive care before intervention wherever possible",
              "Calm, immaculately maintained treatment rooms",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[13.5px] leading-relaxed text-ink/80">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-burgundy-50 text-burgundy">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            <ButtonLink to="/about" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
              Our story
            </ButtonLink>
            <div className="flex items-center gap-3">
              <img
                src="/images/doctor-6.jpg"
                alt=""
                className="h-10 w-10 rounded-full object-cover object-top"
                loading="lazy"
              />
              <div>
                <p className="text-[12.5px] font-medium text-ink">Dr. Amara Okafor</p>
                <p className="text-[10.5px] text-muted">Clinical Director</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured treatments                                                */
/* ------------------------------------------------------------------ */

function FeaturedTreatments({ treatments }: { treatments: typeof services }) {
  return (
    <section className="bg-ivory py-16 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Treatments"
          title="Care for every stage of your smile"
          description="From routine prevention to complex reconstruction, our treatments are planned around your health, your comfort and what you actually want."
          action={
            <ButtonLink to="/services" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
              All treatments
            </ButtonLink>
          }
        />
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((service) => (
            <StaggerItem key={service.slug}>
              <ServiceCard service={service} className="h-full" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why choose us                                                      */
/* ------------------------------------------------------------------ */

function WhyChooseUs() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-4">Why Aurelia</p>
          <h2 className="text-balance text-[32px] leading-[1.13] sm:text-[40px]">
            The details are the difference.
          </h2>
          <p className="mt-5 max-w-md text-[14.5px] leading-[1.85] text-muted">
            Premium dentistry is not about marble reception desks. It is about the quality of the conversation, the
            precision of the work and the way you are treated when you are nervous.
          </p>
          <div className="mt-7 rounded-2xl border border-beige bg-ivory p-5">
            <Quote className="h-5 w-5 text-rose" aria-hidden />
            <p className="mt-2 font-display text-[17px] leading-snug text-ink">
              “We would rather explain why you do not need a treatment than convince you that you do.”
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Dr. Amara Okafor · Clinical Director
            </p>
          </div>
          <ButtonLink to="/about" variant="secondary" className="mt-6" iconRight={<ArrowRight className="h-4 w-4" />}>
            How we work
          </ButtonLink>
        </Reveal>

        <Stagger className="grid gap-4 sm:grid-cols-2">
          {values.map((value) => (
            <StaggerItem key={value.title}>
              <div className="group h-full rounded-2xl border border-beige/80 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-0.5 hover:border-rose/50 hover:shadow-lift">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ivory text-burgundy transition-colors group-hover:bg-burgundy group-hover:text-white">
                  <value.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-[19px] leading-snug text-ink">{value.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{value.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Dentists                                                           */
/* ------------------------------------------------------------------ */

function DentistsPreview() {
  return (
    <section className="bg-ivory py-16 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="The clinicians"
          title="Specialists who work as one team"
          description="Restorative, surgical, orthodontic, cosmetic and paediatric expertise under one roof — so your care is joined up rather than passed around."
          action={
            <ButtonLink to="/doctors" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
              Meet the team
            </ButtonLink>
          }
        />
        <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDoctors.slice(0, 3).map((doctor) => (
            <StaggerItem key={doctor.slug}>
              <DoctorCard doctor={doctor} className="h-full" />
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-6 text-center text-[10.5px] uppercase tracking-[0.14em] text-muted">
          Clinician profiles are illustrative sample content
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Technology                                                         */
/* ------------------------------------------------------------------ */

function Technology() {
  return (
    <section className="relative overflow-hidden bg-burgundy-deep py-16 text-white lg:py-24">
      <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full border border-white/10" aria-hidden />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-rose/10 blur-3xl" aria-hidden />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <img
              src="/images/tech-light.jpg"
              alt="Modern dental operatory lighting and equipment"
              className="aspect-[4/3] w-full object-cover opacity-95"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-5 right-4 rounded-2xl border border-white/15 bg-burgundy-deep/95 px-5 py-4 shadow-lift backdrop-blur sm:right-6">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> Digital workflow
            </p>
            <p className="mt-1.5 max-w-[210px] text-[12px] leading-relaxed text-white/70">
              Scans, photography and radiographs reviewed with you chairside.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="order-1 lg:order-2">
          <p className="eyebrow eyebrow-light mb-4">Technology</p>
          <h2 className="text-balance text-[32px] leading-[1.13] text-white sm:text-[40px]">
            Better information. More considered decisions.
          </h2>
          <p className="mt-5 max-w-lg text-[14.5px] leading-[1.85] text-white/60">
            Technology is only useful if it changes the decision. Ours helps us diagnose earlier, plan more precisely
            and show you what we can see — without adding unnecessary steps.
          </p>
          <div className="mt-8 divide-y divide-white/10 border-t border-white/10">
            {site.technology.map((item, index) => (
              <div key={item.title} className="flex gap-5 py-4">
                <span className="font-display text-lg text-rose/70">0{index + 1}</span>
                <div>
                  <h3 className="font-display text-[18px] text-white">{item.title}</h3>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[10.5px] uppercase tracking-[0.14em] text-white/30">
            Illustrative equipment list — confirm actual technology in clinic
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Smile gallery preview                                              */
/* ------------------------------------------------------------------ */

function SmilePreview({ items }: { items: typeof gallery }) {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Smile gallery"
          title="A sense of what is possible"
          description="A curated look at the aesthetic direction we work towards. All images are illustrative placeholders, not genuine patient cases."
          action={
            <ButtonLink to="/gallery" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
              View the gallery
            </ButtonLink>
          }
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="relative h-full overflow-hidden rounded-3xl bg-ivory">
              <img
                src={items[0]?.image}
                alt="Illustrative example of a bright, natural smile"
                className="img-grade h-full min-h-[300px] w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-deep/60 via-transparent to-transparent" aria-hidden />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <Badge tone="ivory" className="mb-2">Illustrative</Badge>
                <p className="font-display text-2xl text-white">Smile makeover</p>
                <p className="mt-1 text-[11.5px] text-white/65">Composite bonding & professional whitening</p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 lg:col-span-5">
            <Reveal delay={0.06}>
              <div className="relative overflow-hidden rounded-3xl bg-ivory">
                <img
                  src={items[1]?.image}
                  alt="The bright, calm treatment suite at Aurelia Dental Studio"
                  className="img-grade aspect-[16/10] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute left-4 top-4">
                  <Badge tone="ivory">Clinic interior</Badge>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="relative overflow-hidden rounded-3xl bg-ivory">
                <img
                  src={items[2]?.image}
                  alt="Illustrative portrait of a patient with a confident smile"
                  className="img-grade aspect-[16/10] w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute left-4 top-4">
                  <Badge tone="ivory">Illustrative</Badge>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-2xl border border-beige bg-ivory px-5 py-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 text-[12px] leading-relaxed text-muted">
            <BadgeCheck className="h-4 w-4 shrink-0 text-burgundy" aria-hidden />
            Clinical before-and-after images are shown only with documented patient consent.
          </p>
          <Link to="/gallery" className="link-arrow shrink-0 text-[12px]">
            Browse gallery <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Insurance & payment                                                */
/* ------------------------------------------------------------------ */

function Insurance() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-4">Fees & funding</p>
          <h2 className="text-balance text-[32px] leading-[1.13] sm:text-[40px]">
            Clear costs, before we begin.
          </h2>
          <p className="mt-5 max-w-md text-[14.5px] leading-[1.85] text-muted">
            Every plan is itemised and discussed with you first. We work with major dental insurers on a fee-per-item
            basis and can provide the documentation your policy requires.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {site.insurers.map((insurer) => (
              <span
                key={insurer}
                className="rounded-full border border-beige bg-ivory px-3.5 py-1.5 text-[11.5px] font-medium text-ink/70"
              >
                {insurer}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/patient-information#fees" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
              Fees & insurance
            </ButtonLink>
            <ButtonLink to="/contact" variant="ghost">
              Ask a question
            </ButtonLink>
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-muted">
            Insurance arrangements vary. Please confirm cover and pre-authorisation with your provider. Finance is
            subject to status and provider approval.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="grid gap-4 sm:grid-cols-2">
            {site.payments.map((payment, index) => (
              <div
                key={payment.title}
                className={cn(
                  "rounded-2xl border border-beige/80 p-5",
                  index === 0 ? "bg-burgundy text-white" : "bg-ivory/70",
                )}
              >
                <p
                  className={cn(
                    "font-display text-[18px]",
                    index === 0 ? "text-white" : "text-ink",
                  )}
                >
                  {payment.title}
                </p>
                <p
                  className={cn(
                    "mt-1.5 text-[12px] leading-relaxed",
                    index === 0 ? "text-white/65" : "text-muted",
                  )}
                >
                  {payment.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-beige bg-white p-5">
            <p className="flex items-start gap-3 text-[12.5px] leading-relaxed text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" aria-hidden />
              You will always receive a written estimate before treatment. If the plan changes, we discuss it with you
              before any additional cost is incurred.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
