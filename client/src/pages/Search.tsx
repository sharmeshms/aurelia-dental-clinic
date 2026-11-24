import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, FileText, Search as SearchIcon, Stethoscope, UserRound, X } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ServiceCard, PostCard, DoctorCard } from "@/components/content/Cards";
import { services, posts, doctors } from "@/data/content";
import { useSeo } from "@/lib/seo";

const popular = ["Implants", "Whitening", "Root canal", "Children", "Nervous", "Veneers"];

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);

  useSeo({
    title: initial ? `Search: ${initial}` : "Search",
    description: "Search treatments, clinicians and journal articles at Aurelia Dental Studio.",
    noIndex: true,
  });

  useEffect(() => {
    setQuery(params.get("q") ?? "");
  }, [params]);

  const term = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return { services: [], posts: [], doctors: [] };
    return {
      services: services
        .filter((item) =>
          [item.name, item.category, item.summary, item.tagline, ...item.reasons]
            .join(" ")
            .toLowerCase()
            .includes(term),
        )
        .slice(0, 6),
      posts: posts
        .filter((item) => [item.title, item.category, item.excerpt, ...item.tags].join(" ").toLowerCase().includes(term))
        .slice(0, 4),
      doctors: doctors
        .filter((item) =>
          [item.name, item.specialisation, item.designation, ...item.expertise]
            .join(" ")
            .toLowerCase()
            .includes(term),
        )
        .slice(0, 3),
    };
  }, [term]);

  const total = results.services.length + results.posts.length + results.doctors.length;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (term) setParams({ q: query.trim() });
  }

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={initial ? `Results for “${initial}”` : "Search the studio"}
        description="Find a treatment, read a journal article or check a clinician's specialism. If you cannot find what you need, our team can help."
        crumbs={[{ label: "Search" }]}
        tone="white"
        align="center"
      >
        <form onSubmit={submit} className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-beige bg-white p-1.5 pl-4 shadow-soft">
          <SearchIcon className="h-4 w-4 shrink-0 text-burgundy" aria-hidden />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search treatments, clinicians, articles…"
            aria-label="Search"
            className="h-10 min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted/60 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setParams({});
              }}
              className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-ivory hover:text-ink"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="submit"
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-burgundy px-5 text-[13px] font-medium text-white transition-colors hover:bg-burgundy-deep"
          >
            Search
          </button>
        </form>
      </PageHero>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-x">
          {!term ? (
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[13px] text-muted">Start typing above, or try one of these popular searches.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {popular.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setQuery(item);
                      setParams({ q: item });
                    }}
                    className="rounded-full border border-beige bg-ivory px-4 py-2 text-[12.5px] font-medium text-burgundy transition-colors hover:border-rose hover:bg-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : total === 0 ? (
            <EmptyState
              icon={<SearchIcon className="h-5 w-5" />}
              title={`No results for “${query}”`}
              description="Try a broader term such as ‘implant’ or ‘whitening’. If you would rather ask a person, our reception team is happy to help."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <ButtonLink to="/contact" size="sm">
                    Ask the clinic
                  </ButtonLink>
                  <ButtonLink to="/services" size="sm" variant="secondary">
                    Browse treatments
                  </ButtonLink>
                </div>
              }
            />
          ) : (
            <div className="space-y-12">
              <p className="text-[12px] text-muted">
                <span className="font-semibold text-ink">{total}</span> results for “{query}”
              </p>

              {results.services.length > 0 && (
                <section aria-labelledby="search-services">
                  <div className="mb-4 flex items-center gap-3">
                    <Stethoscope className="h-4 w-4 text-rose" aria-hidden />
                    <h2 id="search-services" className="font-display text-[22px] text-ink sm:text-[26px]">
                      Treatments
                    </h2>
                    <span className="h-px flex-1 bg-beige" aria-hidden />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {results.services.map((service) => (
                      <ServiceCard key={service.slug} service={service} />
                    ))}
                  </div>
                </section>
              )}

              {results.doctors.length > 0 && (
                <section aria-labelledby="search-doctors">
                  <div className="mb-4 flex items-center gap-3">
                    <UserRound className="h-4 w-4 text-rose" aria-hidden />
                    <h2 id="search-doctors" className="font-display text-[22px] text-ink sm:text-[26px]">
                      Clinicians
                    </h2>
                    <span className="h-px flex-1 bg-beige" aria-hidden />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {results.doctors.map((doctor) => (
                      <DoctorCard key={doctor.slug} doctor={doctor} />
                    ))}
                  </div>
                </section>
              )}

              {results.posts.length > 0 && (
                <section aria-labelledby="search-posts">
                  <div className="mb-4 flex items-center gap-3">
                    <FileText className="h-4 w-4 text-rose" aria-hidden />
                    <h2 id="search-posts" className="font-display text-[22px] text-ink sm:text-[26px]">
                      Journal articles
                    </h2>
                    <span className="h-px flex-1 bg-beige" aria-hidden />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {results.posts.map((post) => (
                      <PostCard key={post.slug} post={post} />
                    ))}
                  </div>
                </section>
              )}

              <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-beige bg-ivory p-5 sm:flex-row sm:items-center">
                <p className="text-[12.5px] leading-relaxed text-muted">
                  Still not sure? A consultation is the quickest way to get a specific answer.
                </p>
                <ButtonLink to="/appointment" size="sm" iconRight={<ArrowRight className="h-3.5 w-3.5" />}>
                  Book a visit
                </ButtonLink>
              </div>
            </div>
          )}

          <div className="mt-12 border-t border-beige pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Quick links</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-muted">
              <Link to="/services" className="hover:text-burgundy">
                All treatments
              </Link>
              <Link to="/doctors" className="hover:text-burgundy">
                Our clinicians
              </Link>
              <Link to="/blog" className="hover:text-burgundy">
                The journal
              </Link>
              <Link to="/gallery" className="hover:text-burgundy">
                Smile gallery
              </Link>
              <Link to="/faq" className="hover:text-burgundy">
                FAQs
              </Link>
              <Link to="/contact" className="hover:text-burgundy">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
