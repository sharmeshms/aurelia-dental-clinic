import { useMemo, useState } from "react";
import { ArrowRight, Info, MessageSquareQuote, Star } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { TestimonialCard } from "@/components/content/Cards";
import { Rating } from "@/components/ui/Rating";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CtaBand } from "@/components/sections/SharedSections";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { ratingSummary, testimonials } from "@/data/content";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export default function TestimonialsPage() {
  useSeo({
    title: "Patient Stories",
    description:
      "Sample patient stories demonstrating the review experience at Aurelia Dental Studio. All reviews shown are illustrative and must be replaced with consented feedback.",
    image: "/images/smile-woman-1.jpg",
  });

  const [treatment, setTreatment] = useState("All stories");

  const treatments = useMemo(
    () => ["All stories", ...Array.from(new Set(testimonials.map((item) => item.treatment)))],
    [],
  );

  const visible = useMemo(
    () => testimonials.filter((item) => treatment === "All stories" || item.treatment === treatment),
    [treatment],
  );

  return (
    <>
      <PageHero
        eyebrow="Patient stories"
        title="What care feels like, in patients' own words."
        description="A demonstration of how consented patient feedback would appear on the site. Every review below is sample content — not a real testimonial — and should be replaced with genuine, documented feedback before publication."
        crumbs={[{ label: "Patient stories" }]}
        image="/images/smile-woman-1.jpg"
        imageAlt="Illustrative portrait of a smiling patient"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-beige bg-white px-4 py-3 shadow-soft">
            <span className="font-display text-3xl text-burgundy">{ratingSummary.average.toFixed(1)}</span>
            <div>
              <Rating value={ratingSummary.average} size="sm" />
              <p className="mt-1 text-[10.5px] uppercase tracking-[0.12em] text-muted">Sample summary</p>
            </div>
          </div>
          <Badge tone="muted">Demonstration reviews</Badge>
        </div>
      </PageHero>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 hide-scrollbar" role="tablist" aria-label="Filter stories by treatment">
              {treatments.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={treatment === item}
                  onClick={() => setTreatment(item)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all",
                    treatment === item
                      ? "border-burgundy bg-burgundy text-white shadow-soft"
                      : "border-beige bg-white text-ink/70 hover:border-rose hover:text-burgundy",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="text-[12px] text-muted">
              Showing <span className="font-semibold text-ink">{visible.length}</span> sample stories
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal className="rounded-3xl border border-beige bg-ivory p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="eyebrow mb-3">Review summary</p>
                  <p className="font-display text-[30px] leading-none text-burgundy">
                    {ratingSummary.average.toFixed(1)}
                    <span className="ml-1 text-lg text-muted">/ 5</span>
                  </p>
                  <Rating value={ratingSummary.average} className="mt-2" />
                  <p className="mt-2 text-[12px] text-muted">
                    Based on {ratingSummary.count} illustrative responses
                  </p>
                </div>
                <div className="min-w-[190px] space-y-1.5">
                  {ratingSummary.distribution.map((row) => (
                    <div key={row.stars} className="flex items-center gap-2 text-[11px] text-muted">
                      <span className="flex w-8 items-center gap-1">
                        {row.stars}
                        <Star className="h-2.5 w-2.5 fill-rose text-rose" aria-hidden />
                      </span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                        <span
                          className="block h-full rounded-full bg-burgundy/70"
                          style={{ width: `${row.percent}%` }}
                        />
                      </span>
                      <span className="w-8 text-right">{row.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06} className="rounded-3xl border border-rose/30 bg-rose/5 p-6">
              <Info className="h-5 w-5 text-burgundy" aria-hidden />
              <p className="mt-3 font-display text-[19px] leading-snug text-ink">Why every review is labelled</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                Publishing invented testimonials would be misleading. This template marks every review as sample
                content so the design can be reviewed honestly. Replace them with real feedback only where you have
                documented permission and can verify the treatment described.
              </p>
              <ButtonLink to="/contact" size="sm" variant="secondary" className="mt-4">
                Share your experience
              </ButtonLink>
            </Reveal>
          </div>

          <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((testimonial) => (
              <StaggerItem key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-beige bg-ivory p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="flex items-start gap-3">
              <MessageSquareQuote className="mt-0.5 h-5 w-5 shrink-0 text-burgundy" aria-hidden />
              <div>
                <p className="font-display text-[18px] text-ink">Have you visited us?</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                  We welcome feedback — good or constructive. Tell us what worked and what could be better.
                </p>
              </div>
            </div>
            <ButtonLink to="/contact" className="shrink-0" iconRight={<ArrowRight className="h-4 w-4" />}>
              Send feedback
            </ButtonLink>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Next step"
        title="Experience the care behind the words."
        description="Book a consultation and see how an unhurried appointment feels. No pressure, no obligation to proceed."
        secondaryLabel="Read the FAQs"
        secondaryTo="/faq"
      />
    </>
  );
}
