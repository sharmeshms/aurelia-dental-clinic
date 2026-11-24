import { Link, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ClipboardList,
  Clock,
  Info,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/content/Cards";
import { CtaBand } from "@/components/sections/SharedSections";
import NotFoundPage from "@/pages/NotFound";
import { services as staticServices, type Service } from "@/data/content";
import { site, whatsappLink } from "@/config/site";
import { useCollection } from "@/lib/useCollection";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { data: allServices, loading } = useCollection<Service>("/services", staticServices);
  const service =
    allServices.find((item) => item.slug === slug) ?? staticServices.find((item) => item.slug === slug);

  useSeo({
    title: service ? service.name : "Treatment not found",
    description: service?.summary,
    image: service?.image,
    jsonLd: service
      ? {
          "@context": "https://schema.org",
          "@type": "MedicalProcedure",
          name: service.name,
          description: service.summary,
          bodyLocation: "Teeth and gums",
          howPerformed: service.involves.join(" "),
        }
      : undefined,
  });

  if (!service) {
    if (loading) {
      return (
        <div className="container-x flex min-h-[50vh] items-center justify-center py-20">
          <p className="text-sm text-muted">Loading treatment…</p>
        </div>
      );
    }
    return <NotFoundPage />;
  }

  const related = service.related
    .map((relatedSlug) => allServices.find((item) => item.slug === relatedSlug))
    .filter((item): item is Service => Boolean(item))
    .slice(0, 3);

  return (
    <>
      <section className="border-b border-beige/70 bg-ivory">
        <div className="container-x py-8 lg:py-12">
          <Breadcrumbs
            items={[{ label: "Treatments", to: "/services" }, { label: service.name }]}
            className="mb-8"
          />
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
            <div>
              <Badge tone="outline">{service.category}</Badge>
              <h1 className="mt-4 text-balance text-[36px] leading-[1.08] sm:text-[46px] lg:text-[54px]">
                {service.name}
              </h1>
              <p className="mt-3 font-display text-[18px] italic text-burgundy-soft sm:text-xl">{service.tagline}</p>
              <p className="mt-5 max-w-xl text-[14.5px] leading-[1.85] text-muted">{service.summary}</p>

              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
                <span className="inline-flex items-center gap-1.5 text-[12px] text-ink/70">
                  <Clock className="h-3.5 w-3.5 text-rose" aria-hidden /> {service.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[12px] text-ink/70">
                  <ClipboardList className="h-3.5 w-3.5 text-rose" aria-hidden /> Written treatment plan
                </span>
                <span className="inline-flex items-center gap-1.5 text-[12px] text-ink/70">
                  <ShieldCheck className="h-3.5 w-3.5 text-rose" aria-hidden /> Local anaesthetic as needed
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink
                  to={`/appointment?service=${service.slug}`}
                  iconRight={<ArrowRight className="h-4 w-4" />}
                >
                  Book this treatment
                </ButtonLink>
                <ButtonLink to="/contact" variant="secondary">
                  Ask a question
                </ButtonLink>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-3 -top-3 h-full w-full rounded-[2rem] border border-rose/40" aria-hidden />
              <div className="relative overflow-hidden rounded-[2rem] bg-beige shadow-soft">
                <img
                  src={service.image}
                  alt={`${service.name} at Aurelia Dental Studio`}
                  className="img-grade aspect-[4/3] w-full object-cover"
                  width={960}
                  height={720}
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/60 bg-white/95 p-3.5 shadow-soft backdrop-blur sm:right-auto">
                  <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-burgundy">
                    <CalendarCheck className="h-3.5 w-3.5" aria-hidden /> Starts with a consultation
                  </p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                    Suitability and options are confirmed at assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_330px] lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[32px]">
                About this treatment
              </h2>
              <div className="prose-luxe mt-4">
                {service.intro.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[32px]">What it involves</h2>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {service.involves.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl border border-beige/80 bg-ivory/60 p-3.5"
                  >
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-burgundy shadow-sm">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    <span className="text-[12.5px] leading-relaxed text-ink/75">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[32px]">
                Why patients come to us
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.reasons.map((reason, index) => (
                  <div key={reason} className="rounded-xl border border-beige/80 p-4">
                    <span className="font-display text-lg text-rose">0{index + 1}</span>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink/80">{reason}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 text-[11.5px] leading-relaxed text-muted">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose" aria-hidden />
                This list is for general guidance only. Your own suitability is assessed individually.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[32px]">Benefits</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {service.benefits.map((benefit) => (
                  <div key={benefit.title} className="rounded-2xl bg-ivory p-4">
                    <Sparkles className="h-4 w-4 text-rose" aria-hidden />
                    <h3 className="mt-2.5 font-display text-[17px] leading-snug text-ink">{benefit.title}</h3>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{benefit.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[32px]">The treatment process</h2>
              <ol className="mt-5 relative border-l border-beige pl-7">
                {service.process.map((step, index) => (
                  <li key={step.title} className="relative pb-7 last:pb-0">
                    <span className="absolute -left-[41px] top-0 grid h-8 w-8 place-items-center rounded-full border border-rose/50 bg-white text-[11px] font-semibold text-burgundy">
                      {index + 1}
                    </span>
                    <h3 className="font-display text-[19px] leading-snug text-ink">{step.title}</h3>
                    <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-muted">{step.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[32px]">Technology used</h2>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {service.technology.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl border border-beige/80 p-3.5 text-[12.5px] leading-relaxed text-ink/75"
                  >
                    <Stethoscope className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-[28px] leading-snug text-ink sm:text-[32px]">
                Frequently asked questions
              </h2>
              <div className="mt-3">
                <Accordion items={service.faqs} defaultOpen={0} />
              </div>
            </Reveal>

            <div className="mt-8 rounded-2xl border border-beige bg-ivory p-4">
              <p className="flex items-start gap-2 text-[11.5px] leading-relaxed text-muted">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" aria-hidden />
                This page provides general information and does not guarantee any treatment outcome. All treatment
                carries risks, which will be explained to you individually before you consent. If you have a medical
                emergency, contact emergency services.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-beige bg-white p-6 shadow-soft">
              <p className="eyebrow mb-3">Appointments</p>
              <h2 className="font-display text-[24px] leading-snug text-ink">Book {service.name.toLowerCase()}</h2>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                Every treatment starts with an assessment. We will confirm suitability, options and costs before
                anything begins.
              </p>
              <div className="mt-4 space-y-2 rounded-xl bg-ivory p-3.5">
                {[
                  ["Typical duration", service.duration],
                  ["Plan", "Written estimate included"],
                  ["Aftercare", "Instructions provided"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-3 text-[11.5px]">
                    <span className="text-muted">{label}</span>
                    <span className="text-right font-medium text-ink">{value}</span>
                  </div>
                ))}
              </div>
              <ButtonLink
                to={`/appointment?service=${service.slug}`}
                className="mt-4 w-full"
                iconRight={<ArrowRight className="h-4 w-4" />}
              >
                Request appointment
              </ButtonLink>
              <a
                href={site.contact.phoneHref}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-burgundy/20 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy-50"
              >
                <Phone className="h-4 w-4" aria-hidden /> {site.contact.phone}
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 block text-center text-[11.5px] font-medium text-muted underline decoration-beige underline-offset-4 transition-colors hover:text-burgundy"
              >
                Or ask us on WhatsApp
              </a>
            </div>

            <div className="mt-4 rounded-2xl border border-rose/30 bg-rose/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-burgundy">Urgent problem?</p>
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                {site.emergency.note}
              </p>
              <Link to="/services/emergency-dental-care" className="link-arrow mt-3 text-[12px]">
                Emergency care <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>

            {related.length > 0 && (
              <div className="mt-4 rounded-2xl border border-beige bg-white p-5">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">Related care</p>
                <ul className="mt-3 space-y-2">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`/services/${item.slug}`}
                        className="flex items-center justify-between gap-2 text-[12.5px] text-ink/75 transition-colors hover:text-burgundy"
                      >
                        {item.name}
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-beige/70 bg-ivory py-14 lg:py-20">
          <div className="container-x">
            <SectionHeading
              eyebrow="Continue exploring"
              title="Related treatments"
              action={
                <ButtonLink to="/services" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
                  All treatments
                </ButtonLink>
              }
            />
            <div className={cn("mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3")}>
              {related.map((item) => (
                <ServiceCard key={item.slug} service={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        eyebrow="Next step"
        title="Have a question about this treatment?"
        description="Our team can talk through what is involved, what it costs and whether it is right for you — before you commit to anything."
        primaryLabel="Book a consultation"
        secondaryLabel="Contact the clinic"
        secondaryTo="/contact"
      />
    </>
  );
}
