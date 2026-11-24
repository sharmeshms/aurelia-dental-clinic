import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Search, X } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { PostCard } from "@/components/content/Cards";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { CtaBand } from "@/components/sections/SharedSections";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";
import { postCategories, posts as staticPosts, type Post } from "@/data/content";
import { useCollection } from "@/lib/useCollection";
import { useSeo } from "@/lib/seo";
import { cn } from "@/lib/utils";

export default function BlogPage() {
  useSeo({
    title: "The Journal",
    description:
      "Practical, evidence-informed oral health writing from the Aurelia clinical team — prevention, treatments, nervous patients and everyday dental questions.",
    image: "/images/treatment-consultation.jpg",
  });

  const { data: posts, loading } = useCollection<Post>("/posts", staticPosts);
  const [category, setCategory] = useState("All Articles");
  const [query, setQuery] = useState("");

  const activePosts = useMemo(() => posts.filter((post) => post.active !== false), [posts]);
  const featured = useMemo(
    () => activePosts.find((post) => post.featured) ?? activePosts[0],
    [activePosts],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return activePosts
      .filter((post) => post.slug !== featured?.slug)
      .filter((post) => category === "All Articles" || post.category === category)
      .filter((post) =>
        term
          ? [post.title, post.excerpt, post.category, ...post.tags].join(" ").toLowerCase().includes(term)
          : true,
      );
  }, [activePosts, featured?.slug, category, query]);

  return (
    <>
      <PageHero
        eyebrow="The journal"
        title="Clear writing about teeth, without the scare tactics."
        description="Short, practical articles from our clinical team on prevention, treatment choices and the questions patients actually ask. General information only — not a substitute for an assessment."
        crumbs={[{ label: "Journal" }]}
        image="/images/treatment-consultation.jpg"
        imageAlt="A clinician discussing dental care with a patient"
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/appointment" iconRight={<ArrowRight className="h-4 w-4" />}>
            Book a consultation
          </ButtonLink>
          <ButtonLink to="/faq" variant="secondary">
            Read the FAQs
          </ButtonLink>
        </div>
      </PageHero>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-x">
          {featured && (
            <div className="mb-10">
              <h2 className="sr-only">Featured article</h2>
              <PostCard post={featured} variant="featured" />
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search articles…"
                  aria-label="Search articles"
                  className="h-12 w-full rounded-full border border-beige bg-white pl-11 pr-10 text-sm text-ink placeholder:text-muted/60 focus:border-burgundy/50 focus:outline-none focus:ring-4 focus:ring-burgundy/10"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted hover:bg-ivory hover:text-ink"
                    aria-label="Clear article search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[12px] text-muted">
                <span className="font-semibold text-ink">{filtered.length}</span> more{" "}
                {filtered.length === 1 ? "article" : "articles"}
              </p>
            </div>

            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 hide-scrollbar" role="tablist" aria-label="Article categories">
              {postCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={category === item}
                  onClick={() => setCategory(item)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-[12.5px] font-medium transition-all",
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

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              <h2 className="sr-only">More articles</h2>
              {filtered.length === 0 ? (
                <EmptyState
                  icon={<BookOpen className="h-5 w-5" />}
                  title={loading ? "Loading articles" : "No articles match that search"}
                  description={
                    loading
                      ? "Fetching the latest journal entries."
                      : "Try a different term or category. If you cannot find what you need, ask us directly."
                  }
                  action={
                    !loading && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery("");
                          setCategory("All Articles");
                        }}
                        className="inline-flex h-10 items-center rounded-full bg-burgundy px-5 text-sm font-medium text-white"
                      >
                        Clear filters
                      </button>
                    )
                  }
                />
              ) : (
                <Stagger className="grid gap-5 sm:grid-cols-2">
                  {filtered.map((post) => (
                    <StaggerItem key={post.slug}>
                      <PostCard post={post} className="h-full" />
                    </StaggerItem>
                  ))}
                </Stagger>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-beige bg-ivory p-5">
                <p className="eyebrow mb-3">The letter</p>
                <h2 className="font-display text-[20px] leading-snug text-ink">Occasional notes, no noise.</h2>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">
                  Practical oral health guidance from our clinical team, sent rarely.
                </p>
                <div className="mt-4">
                  <NewsletterForm variant="card" />
                </div>
              </div>

              <div className="rounded-3xl border border-beige bg-white p-5">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">Popular topics</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Prevention", "Implants", "Whitening", "Nervous patients", "Children", "Gum health"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="rounded-full border border-beige bg-ivory px-3 py-1.5 text-[11.5px] text-ink/70 transition-colors hover:border-rose hover:text-burgundy"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-rose/30 bg-rose/5 p-5">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-burgundy">A note on content</p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">
                  Articles are general information, reviewed for tone and accuracy. They do not replace an individual
                  assessment, diagnosis or treatment plan.
                </p>
                <ButtonLink to="/contact" size="sm" variant="secondary" className="mt-3 w-full">
                  Ask a question
                </ButtonLink>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow="From reading to deciding"
        title="Have a question the article did not answer?"
        description="Book a consultation and we will apply the general guidance to your own teeth, gums and goals."
        secondaryLabel="Explore treatments"
        secondaryTo="/services"
      />
    </>
  );
}
