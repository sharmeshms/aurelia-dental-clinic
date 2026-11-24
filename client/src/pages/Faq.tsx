import { useMemo, useState } from "react";
import { ArrowRight, MessageCircleQuestion, Phone, Search, X } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/SharedSections";
import { faqCategories } from "@/data/content";
import { site } from "@/config/site";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export default function FaqPage() {
  useSeo({
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions about appointments, treatments, fees, nervous patients and urgent dental care at Aurelia Dental Studio.",
    image: "/images/clinic-consultation-warm.jpg",
  });

  const [category, setCategory] = useState("All questions");
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    return faqCategories
      .filter((group) => category === "All questions" || group.category === category)
      .map((group) => ({
        ...group,
        items: term
          ? group.items.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(term))
          : group.items,
      }))
      .filter((group) => group.items.length > 0);
  }, [category, query]);

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <>
      <PageHero
        eyebrow="Help centre"
        title="Questions, answered without the jargon."
        description="Everything patients most often ask before booking — from first-visit nerves and fees to what happens in an emergency. If your question is not here, we are happy to talk it through."
        crumbs={[{ label: "FAQs" }]}
        image="/images/clinic-consultation-warm.jpg"
        imageAlt="A clinician answering a patient's questions during a consultation"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/appointment" iconRight={<ArrowRight className="h-4 w-4" />}>
            Book an appointment
          </ButtonLink>
          <a
            href={site.contact.phoneHref}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-burgundy/25 bg-white px-6 text-sm font-medium text-burgundy transition-colors hover:bg-burgundy-50"
          >
            <Phone className="h-4 w-4" aria-hidden /> {site.contact.phone}
          </a>
        </div>
      </PageHero>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-x grid gap-10 lg:grid-cols-[250px_1fr] lg:gap-14">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search questions…"
                aria-label="Search frequently asked questions"
                className="h-11 w-full rounded-full border border-beige bg-white pl-11 pr-9 text-[13px] text-ink placeholder:text-muted focus:border-burgundy/50 focus:outline-none focus:ring-4 focus:ring-burgundy/10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:bg-ivory hover:text-ink"
                  aria-label="Clear question search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <nav aria-label="FAQ categories" className="mt-5 space-y-1">
              {["All questions", ...faqCategories.map((group) => group.category)].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-[12.5px] font-medium transition-colors",
                    category === item
                      ? "bg-burgundy text-white"
                      : "text-ink/70 hover:bg-ivory hover:text-burgundy",
                  )}
                  aria-pressed={category === item}
                >
                  {item}
                  <span
                    className={cn(
                      "text-[10px] font-semibold",
                      category === item ? "text-white/60" : "text-muted",
                    )}
                  >
                    {item === "All questions"
                      ? faqCategories.reduce((sum, group) => sum + group.items.length, 0)
                      : faqCategories.find((group) => group.category === item)?.items.length}
                  </span>
                </button>
              ))}
            </nav>

            <div className="mt-6 rounded-2xl border border-beige bg-ivory p-4">
              <MessageCircleQuestion className="h-5 w-5 text-burgundy" aria-hidden />
              <p className="mt-2.5 font-display text-[17px] leading-snug text-ink">Still unsure?</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">
                Ask a question directly and a member of the team will reply.
              </p>
              <ButtonLink to="/contact" size="sm" variant="secondary" className="mt-3 w-full">
                Send a question
              </ButtonLink>
            </div>
          </aside>

          <div>
            <p className="text-[12px] text-muted">
              Showing <span className="font-semibold text-ink">{total}</span>{" "}
              {total === 1 ? "answer" : "answers"}
              {query && <> for “{query}”</>}
            </p>

            {groups.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-beige bg-ivory/60 px-6 py-16 text-center">
                <p className="font-display text-xl text-ink">No matching questions</p>
                <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
                  Try a broader term, or send us your question and we will answer it directly.
                </p>
                <div className="mt-5 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCategory("All questions");
                    }}
                    className="inline-flex h-9 items-center rounded-full border border-burgundy/20 px-4 text-[12.5px] font-medium text-burgundy"
                  >
                    Clear filters
                  </button>
                  <ButtonLink to="/contact" size="sm">
                    Ask us
                  </ButtonLink>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-9">
                {groups.map((group) => (
                  <section key={group.category} aria-labelledby={`faq-${group.category}`}>
                    <div className="mb-3 flex items-center gap-3">
                      <h2
                        id={`faq-${group.category}`}
                        className="font-display text-[22px] leading-snug text-ink sm:text-[26px]"
                      >
                        {group.category}
                      </h2>
                      <span className="h-px flex-1 bg-beige" aria-hidden />
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">
                        {group.items.length} {group.items.length === 1 ? "answer" : "answers"}
                      </span>
                    </div>
                    <Accordion items={group.items} defaultOpen={group === groups[0] ? 0 : null} />
                  </section>
                ))}
              </div>
            )}

            <div className="mt-10 rounded-2xl border border-rose/30 bg-rose/5 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-burgundy">Urgent dental problem</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{site.emergency.note}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                <a href={site.contact.phoneHref} className="link-arrow text-[12.5px]">
                  <Phone className="h-3.5 w-3.5" aria-hidden /> Call the clinic
                </a>
                <ButtonLink to="/services/emergency-dental-care" variant="secondary" size="sm">
                  Emergency care
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Ready when you are"
        title="The best way to get a clear answer is a proper conversation."
        description="Book a consultation, or call and speak to our reception team. There is no obligation to proceed with treatment."
        secondaryLabel="Patient information"
        secondaryTo="/patient-information"
      />
    </>
  );
}
