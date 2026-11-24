import {
  ArrowRight,
  Award,
  Check,
  HeartHandshake,
  Leaf,
  Quote,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { DoctorCard } from "@/components/content/Cards";
import { CtaBand } from "@/components/sections/SharedSections";
import { doctors, featuredDoctors } from "@/data/content";
import { site } from "@/config/site";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

const values = [
  {
    icon: HeartHandshake,
    title: "Respect, always",
    text: "Your time, your budget and your boundaries are part of the clinical decision — not an afterthought.",
  },
  {
    icon: ShieldCheck,
    title: "Honest advice",
    text: "We will tell you when treatment is not needed, when it can wait, and when a referral is in your best interests.",
  },
  {
    icon: Leaf,
    title: "Conservative care",
    text: "Preserving healthy tooth structure is the default. Intervention is justified, never assumed.",
  },
  {
    icon: Sparkles,
    title: "Attention to detail",
    text: "From shade matching to the finish on a restoration, the small things are what make work last.",
  },
];

const hygiene = [
  "Single-use items wherever single use is appropriate",
  "Instrument tracking through every sterilisation cycle",
  "Dedicated decontamination area with validated equipment",
  "Daily waterline flushing and regular microbiological testing",
  "Surface decontamination between every patient",
  "Regular staff training and documented protocol reviews",
];

const amenities = [
  "Ground-floor, step-free treatment suite",
  "Quiet waiting room with complimentary refreshments",
  "Noise-cancelling headphones on request",
  "Written treatment plans and clear estimates",
  "Wheelchair-accessible facilities",
  "Evening and Saturday appointments",
];

export default function AboutPage() {
  useSeo({
    title: "About the Studio",
    description:
      "Meet Aurelia Dental Studio — a private practice built around unhurried appointments, honest advice and conservative, considered dentistry in Marylebone, London.",
    image: "/images/clinic-consultation-warm.jpg",
  });

  return (
    <>
      <PageHero
        eyebrow="About the studio"
        title={
          <>
            A quieter kind of dentistry, built on better conversations.
          </>
        }
        description="Aurelia is an independent private practice in Marylebone. We combine specialist expertise with the kind of unhurried care that makes people feel comfortable asking questions."
        crumbs={[{ label: "About" }]}
        image="/images/clinic-consultation-warm.jpg"
        imageAlt="A dentist smiling during a relaxed consultation with a patient"
      >
        <div className="flex flex-wrap items-center gap-5">
          <ButtonLink to="/appointment" iconRight={<ArrowRight className="h-4 w-4" />}>
            Book a consultation
          </ButtonLink>
          <ButtonLink to="/doctors" variant="ghost">
            Meet the clinicians
          </ButtonLink>
        </div>
      </PageHero>

      {/* Story */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative order-2 mx-auto w-full max-w-[540px] lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-[1.75rem] bg-ivory">
                <img
                  src="/images/clinic-chair.jpg"
                  alt="One of the clinic's treatment suites, prepared and immaculate"
                  className="img-grade aspect-[3/4] w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-10 space-y-4">
                <div className="overflow-hidden rounded-[1.75rem] bg-ivory">
                  <img
                    src="/images/detail-mirror.jpg"
                    alt="A dental mirror and instruments prepared for treatment"
                    className="img-grade aspect-square w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="rounded-[1.75rem] bg-burgundy p-5 text-white">
                  <p className="font-display text-3xl">{new Date().getFullYear() - site.established}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose">Years of practice</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-white/60">
                    Independent, clinician-led and deliberately small.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="order-1 lg:order-2">
            <p className="eyebrow mb-4">Our story</p>
            <h2 className="text-balance text-[32px] leading-[1.13] sm:text-[40px]">
              We wanted somewhere patients did not feel processed.
            </h2>
            <div className="prose-luxe mt-5">
              <p>
                Aurelia began as a two-chair practice with a simple idea: give clinicians enough time to think, and
                patients enough time to understand. That idea has not changed as the practice has grown.
              </p>
              <p>
                Today the studio brings together restorative, surgical, orthodontic, cosmetic and paediatric expertise.
                What unites the team is not a house style of dentistry, but a shared standard of conversation — plain
                language, real alternatives and no pressure.
              </p>
              <p>
                We are deliberately independent. That means clinical decisions are made in the room, with you, rather
                than by a corporate target. It also means we can take the time to get the small details right.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-beige bg-ivory p-5">
              <Quote className="h-5 w-5 shrink-0 text-rose" aria-hidden />
              <div>
                <p className="font-display text-[16px] leading-snug text-ink">
                  “The best compliment we receive is that it did not feel like a dental appointment.”
                </p>
                <p className="mt-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Dr. Amara Okafor · Clinical Director
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission & vision */}
      <section className="bg-ivory py-16 lg:py-20">
        <div className="container-x grid gap-5 md:grid-cols-2">
          <Reveal className="rounded-3xl border border-beige/80 bg-white p-7 shadow-soft sm:p-9">
            <p className="eyebrow mb-4">Our mission</p>
            <h2 className="font-display text-[26px] leading-snug text-ink">
              To make excellent dentistry feel calm, clear and genuinely worth the investment.
            </h2>
            <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
              Excellent dentistry is not the most treatment — it is the right treatment, delivered carefully, explained
              properly and maintained over time.
            </p>
          </Reveal>
          <Reveal delay={0.06} className="rounded-3xl border border-burgundy/20 bg-burgundy p-7 text-white shadow-soft sm:p-9">
            <p className="eyebrow eyebrow-light mb-4">Our vision</p>
            <h2 className="font-display text-[26px] leading-snug text-white">
              A practice where prevention is the default and nobody feels rushed into a decision.
            </h2>
            <p className="mt-4 text-[13.5px] leading-relaxed text-white/60">
              We want patients to leave knowing more about their mouth than when they arrived — and to feel that their
              preferences genuinely shaped the plan.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we stand for"
            title="Four standards we do not compromise"
            description="These are not slogans on a wall. They are the questions we ask ourselves before recommending any treatment."
          />
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <StaggerItem key={value.title}>
                <div className="h-full rounded-2xl border border-beige/80 bg-white p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-rose/50">
                  <div className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-burgundy-50 text-burgundy">
                      <value.icon className="h-4.5 w-4.5" aria-hidden />
                    </span>
                    <span className="font-display text-2xl text-beige">0{index + 1}</span>
                  </div>
                  <h3 className="mt-4 font-display text-[19px] text-ink">{value.title}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{value.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-ivory py-16 lg:py-24">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow mb-4">Our approach</p>
              <h2 className="text-balance text-[32px] leading-[1.13] sm:text-[40px]">
                A sequence, not a sales funnel.
              </h2>
              <p className="mt-5 text-[14.5px] leading-[1.85] text-muted">
                Every clinician at Aurelia follows the same order of thinking. It keeps recommendations consistent and
                makes it easier for you to see the logic behind a plan.
              </p>
              <div className="mt-6 overflow-hidden rounded-2xl">
                <img
                  src="/images/clinic-consult.jpg"
                  alt="A clinician discussing options with a patient"
                  className="img-grade aspect-[4/3] w-full object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <ol className="relative border-l border-beige pl-6 sm:pl-8">
                {site.approach.map((step, index) => (
                  <li key={step.title} className="relative pb-8 last:pb-0">
                    <span className="absolute -left-[35px] top-0 grid h-7 w-7 place-items-center rounded-full border border-rose/50 bg-white text-[10px] font-semibold text-burgundy sm:-left-[43px] sm:h-8 sm:w-8">
                      {index + 1}
                    </span>
                    <h3 className="font-display text-[20px] leading-snug text-ink">{step.title}</h3>
                    <p className="mt-1.5 max-w-lg text-[13.5px] leading-relaxed text-muted">{step.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="The space"
            title="Designed to feel unlike a hospital"
            description="Natural light, warm materials and quiet rooms. The environment is part of the treatment, not a backdrop to it."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                image: "/images/clinic-chair.jpg",
                title: "Treatment suites",
                text: "Purpose-built rooms with modern chairs, task lighting and a view of the trees outside.",
              },
              {
                image: "/images/clinic-interior-bright.jpg",
                title: "Clinical spaces",
                text: "Uncluttered, well-lit and easy to move around, with step-free access throughout.",
              },
              {
                image: "/images/clinic-office.jpg",
                title: "The team at work",
                text: "A small, familiar team who know your name, your history and how you like to be treated.",
              },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <figure className="group overflow-hidden rounded-3xl border border-beige/80 bg-white shadow-soft">
                  <div className="overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-grade aspect-[4/3] w-full object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="p-5">
                    <h3 className="font-display text-[19px] text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{item.text}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-6 grid gap-6 rounded-3xl border border-beige bg-ivory p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <h3 className="font-display text-xl text-ink">Practical comforts</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                Small things that make appointments easier — tell us what would help and we will arrange it.
              </p>
            </div>
            <ul className="grid gap-2.5 sm:col-span-1 lg:col-span-2 sm:grid-cols-2">
              {amenities.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-ink/75">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-burgundy" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Hygiene */}
      <section className="relative overflow-hidden bg-burgundy-deep py-16 text-white lg:py-24">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full border border-white/10" aria-hidden />
        <div className="container-x grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow eyebrow-light mb-4">Hygiene & sterilisation</p>
            <h2 className="text-balance text-[32px] leading-[1.13] text-white sm:text-[40px]">
              Cleanliness you can ask about.
            </h2>
            <p className="mt-5 text-[14.5px] leading-[1.85] text-white/60">
              Infection prevention is not a back-office concern. It is a clinical standard, and you are entitled to ask
              how it is maintained. Our protocols are designed around current UK infection prevention guidance, with
              documented cycles and traceability for every instrument.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {hygiene.map((item) => (
                <div key={item} className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose" aria-hidden />
                  <span className="text-[12px] leading-relaxed text-white/70">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[10.5px] uppercase tracking-[0.14em] text-white/30">
              Demonstration content — verify protocols and accreditation before publication
            </p>
          </Reveal>

          <Reveal delay={0.08} className="grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-white/10 sm:col-span-2">
              <img
                src="/images/tech-instruments.jpg"
                alt="Sterilised dental instruments laid out on a tray"
                className="aspect-[16/9] w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <Award className="h-5 w-5 text-rose" aria-hidden />
              <p className="mt-3 font-display text-lg text-white">Traceable cycles</p>
              <p className="mt-1 text-[12px] leading-relaxed text-white/55">
                Every instrument batch is logged through decontamination and sterilisation.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <Stethoscope className="h-5 w-5 text-rose" aria-hidden />
              <p className="mt-3 font-display text-lg text-white">Trained team</p>
              <p className="mt-1 text-[12px] leading-relaxed text-white/55">
                Regular updates and competency checks for every clinical and support colleague.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Technology */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Equipment"
            title="Precise tools, used with judgement"
            description="We invest in diagnostics that change decisions — not gadgets that look impressive in a brochure."
            action={
              <ButtonLink to="/services" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
                Explore treatments
              </ButtonLink>
            }
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {site.technology.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.05}>
                <div className={cn("h-full rounded-2xl border border-beige p-5", index === 0 ? "bg-ivory" : "bg-white")}>
                  <span className="font-display text-2xl text-rose/70">0{index + 1}</span>
                  <h3 className="mt-3 font-display text-[18px] text-ink">{item.title}</h3>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-ivory py-16 lg:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="The team"
            title="Clinicians you will actually get to know"
            description={`A team of ${doctors.length} specialists and general practitioners, supported by experienced hygienists and reception colleagues.`}
            action={
              <ButtonLink to="/doctors" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
                All clinicians
              </ButtonLink>
            }
          />
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredDoctors.slice(0, 3).map((doctor) => (
              <StaggerItem key={doctor.slug}>
                <DoctorCard doctor={doctor} />
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-6 text-center text-[10.5px] uppercase tracking-[0.14em] text-muted">
            Sample profiles — replace with verified clinician information
          </p>
        </div>
      </section>

      <CtaBand
        eyebrow="Visit us"
        title="Come and see whether we are the right fit."
        description="A first consultation is a conversation, not a commitment. We will listen, examine and explain — then you decide."
        secondaryLabel="Patient information"
        secondaryTo="/patient-information"
      />
    </>
  );
}
