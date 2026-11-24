import { useMemo, useState } from "react";
import { ArrowRight, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceCard } from "@/components/content/Cards";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { CtaBand } from "@/components/sections/SharedSections";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { serviceCategories, services as staticServices, type Service } from "@/data/content";
import { useCollection } from "@/lib/useCollection";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export default function ServicesPage() {
  useSeo({
    title: "Dental Treatments",
    description:
      "Explore the full range of dental treatments at Aurelia Dental Studio — general and preventive dentistry, implants, root canal treatment, orthodontics, cosmetic dentistry and urgent care.",
    image: "/images/treatment-general.jpg",
  });

  const { data: services, loading } = useCollection<Service>("/services", staticServices);
  const [category, setCategory] = useState("All Treatments");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return services
      .filter((service) => service.active !== false)
      .filter((service) => category === "All Treatments" || service.category === category)
      .filter((service) =>
        term
          ? [service.name, service.category, service.summary, service.tagline]
              .join(" ")
              .toLowerCase()
              .includes(term)
          : true,
      );
  }, [services, category, query]);

  const hasFilters = category !== "All Treatments" || query.trim().length > 0;

  return (
    <>
      <PageHero
        eyebrow="Treatments"
        title="Considered dentistry, for every stage of your smile."
        description="Twenty treatments under one roof, from routine prevention to full reconstruction. Each one begins with an assessment and an honest conversation about what you actually need."
        crumbs={[{ label: "Treatments" }]}
        image="/images/treatment-general.jpg"
        imageAlt="A bright, modern dental treatment room"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] text-muted">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-rose" aria-hidden /> {services.length} treatments
          </span>
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-rose" aria-hidden /> {serviceCategories.length - 1} categories
          </span>
          <span>Same-day urgent care</span>
        </div>
      </PageHero>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-x">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search treatments…"
                  aria-label="Search treatments"
                  className="h-12 w-full rounded-full border border-beige bg-white pl-11 pr-10 text-sm text-ink placeholder:text-muted/60 focus:border-burgundy/50 focus:outline-none focus:ring-4 focus:ring-burgundy/10"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:bg-ivory hover:text-ink"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[12px] text-muted">
                Showing <span className="font-semibold text-ink">{filtered.length}</span> of {services.length} treatments
              </p>
            </div>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 hide-scrollbar" role="tablist" aria-label="Treatment categories">
              {serviceCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={category === item}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all duration-300",
                    category === item
                      ? "border-burgundy bg-burgundy text-white shadow-soft"
                      : "border-beige bg-white text-ink/70 hover:border-rose hover:text-burgundy",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="sr-only">All treatments</h2>
            {loading && filtered.length === 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Search className="h-5 w-5" />}
                title="No treatments match that search"
                description="Try a different term or clear the filters. If you are not sure what you need, our reception team can help."
                action={
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setCategory("All Treatments");
                    }}
                    className="inline-flex h-10 items-center rounded-full bg-burgundy px-5 text-sm font-medium text-white transition-colors hover:bg-burgundy-deep"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((service) => (
                  <ServiceCard key={service.slug} service={service} />
                ))}
              </div>
            )}
          </div>

          {hasFilters && filtered.length > 0 && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCategory("All Treatments");
                }}
                className="link-arrow"
              >
                Clear filters <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
          )}

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-beige bg-ivory p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="font-display text-xl text-ink">Not sure where to start?</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                Book a consultation and we will assess, explain your options and write it all down.
              </p>
            </div>
            <ButtonLink to="/appointment" iconRight={<ArrowRight className="h-4 w-4" />} className="shrink-0">
              Book a consultation
            </ButtonLink>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="Urgent care"
        title="In pain? Do not wait for a routine appointment."
        description="We hold urgent slots each day for severe toothache, swelling, trauma and broken teeth. Call us as early as you can."
        primaryLabel="Request urgent care"
        secondaryLabel="Emergency dental care"
        secondaryTo="/services/emergency-dental-care"
      />
    </>
  );
}
