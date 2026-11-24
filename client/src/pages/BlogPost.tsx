import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Copy,
  Facebook,
  Info,
  Linkedin,
  MessageCircle,
  Share2,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PostCard } from "@/components/content/Cards";
import { CtaBand } from "@/components/sections/SharedSections";
import { useToast } from "@/components/ui/Toast";
import NotFoundPage from "@/pages/NotFound";
import { posts as staticPosts, relatedPosts, type Post } from "@/data/content";
import { site } from "@/config/site";
import { useCollection } from "@/lib/useCollection";
import { useSeo } from "@/lib/seo";
import { formatDate, initials } from "@/lib/utils";

export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: posts, loading } = useCollection<Post>("/posts", staticPosts);
  const post = posts.find((item) => item.slug === slug) ?? staticPosts.find((item) => item.slug === slug);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  useSeo({
    title: post ? post.title : "Article not found",
    description: post?.excerpt,
    image: post?.cover,
    type: "article",
    jsonLd: post
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: site.name },
          image: post.cover,
        }
      : undefined,
  });

  if (!post) {
    if (loading) {
      return (
        <div className="container-x flex min-h-[50vh] items-center justify-center py-20">
          <p className="text-sm text-muted">Loading article…</p>
        </div>
      );
    }
    return <NotFoundPage />;
  }

  const related = relatedPosts(post);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({ title: "Link copied", variant: "success" });
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast({ title: "Could not copy the link", variant: "error" });
    }
  }

  return (
    <>
      <article>
        <header className="border-b border-beige/70 bg-ivory">
          <div className="container-x py-8 lg:py-12">
            <Breadcrumbs items={[{ label: "Journal", to: "/blog" }, { label: post.title }]} className="mb-7" />
            <div className="mx-auto max-w-3xl text-center">
              <Badge tone="outline">{post.category}</Badge>
              <h1 className="mt-4 text-balance text-[32px] leading-[1.12] sm:text-[42px] lg:text-[50px]">
                {post.title}
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted">
                {post.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-rose" aria-hidden /> {post.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-rose" aria-hidden /> {formatDate(post.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-rose" aria-hidden /> {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white">
          <div className="container-x py-10 lg:py-14">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-ivory shadow-soft">
              <img
                src={post.cover}
                alt={post.title}
                className="img-grade aspect-[16/9] w-full object-cover"
                width={1280}
                height={720}
              />
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-[1fr_280px] lg:gap-14">
              <div className="min-w-0">
                {post.keyPoints.length > 0 && (
                  <div className="rounded-2xl border border-beige bg-ivory p-5 sm:p-6">
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-burgundy">
                      In brief
                    </p>
                    <ul className="mt-3 space-y-2.5">
                      {post.keyPoints.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink/80">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white text-burgundy shadow-sm">
                            <Check className="h-3 w-3" aria-hidden />
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 space-y-9">
                  {post.sections.map((section) => (
                    <Reveal key={section.heading}>
                      <section>
                        <h2 className="font-display text-[25px] leading-snug text-ink sm:text-[29px]">
                          {section.heading}
                        </h2>
                        <div className="prose-luxe mt-3">
                          {section.paragraphs.map((paragraph) => (
                            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                          ))}
                        </div>
                      </section>
                    </Reveal>
                  ))}
                </div>

                <div className="mt-9 rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5">
                  <p className="flex items-start gap-2.5 text-[12px] leading-relaxed text-amber-900/80">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {post.disclaimer}
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-4 border-t border-beige pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-burgundy-50 text-[12px] font-semibold text-burgundy">
                      {initials(post.author)}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-ink">{post.author}</p>
                      <p className="text-[11.5px] text-muted">{post.authorRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-muted">
                      <Share2 className="h-3.5 w-3.5" aria-hidden /> Share
                    </span>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="grid h-9 w-9 place-items-center rounded-full border border-beige text-muted transition-colors hover:border-rose hover:text-burgundy"
                      aria-label="Share on X"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="grid h-9 w-9 place-items-center rounded-full border border-beige text-muted transition-colors hover:border-rose hover:text-burgundy"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" aria-hidden />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="grid h-9 w-9 place-items-center rounded-full border border-beige text-muted transition-colors hover:border-rose hover:text-burgundy"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" aria-hidden />
                    </a>
                    <button
                      type="button"
                      onClick={copyLink}
                      className="grid h-9 w-9 place-items-center rounded-full border border-beige text-muted transition-colors hover:border-rose hover:text-burgundy"
                      aria-label="Copy article link"
                    >
                      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <Link to="/blog" className="link-arrow">
                    <ArrowLeft className="h-4 w-4" aria-hidden /> All articles
                  </Link>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        to={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="rounded-full border border-beige bg-ivory px-3 py-1.5 text-[11px] text-ink/60 transition-colors hover:border-rose hover:text-burgundy"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-3xl border border-beige bg-white p-5 shadow-soft">
                  <p className="eyebrow mb-3">Book a visit</p>
                  <h2 className="font-display text-[20px] leading-snug text-ink">Questions about your own teeth?</h2>
                  <p className="mt-2 text-[12px] leading-relaxed text-muted">
                    General articles can only take you so far. A consultation looks at your specific situation.
                  </p>
                  <ButtonLink to="/appointment" size="sm" className="mt-4 w-full" iconRight={<ArrowRight className="h-3.5 w-3.5" />}>
                    Request an appointment
                  </ButtonLink>
                  <a
                    href={site.contact.phoneHref}
                    className="mt-2 flex h-9 items-center justify-center rounded-full border border-burgundy/20 text-[12px] font-medium text-burgundy"
                  >
                    {site.contact.phone}
                  </a>
                </div>

                {related.length > 0 && (
                  <div className="rounded-3xl border border-beige bg-ivory p-4">
                    <p className="px-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Related reading
                    </p>
                    <div className="mt-2">
                      {related.map((item) => (
                        <PostCard key={item.slug} post={item} variant="compact" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl border border-beige bg-white p-5">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">Review note</p>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
                    Articles are written for a general audience and reviewed for accuracy and tone. They are not
                    clinical guidance for an individual case.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-beige/70 bg-ivory py-14 lg:py-20">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Keep reading</p>
                <h2 className="font-display text-[28px] leading-snug sm:text-[34px]">More from the journal</h2>
              </div>
              <ButtonLink to="/blog" variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
                All articles
              </ButtonLink>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        eyebrow="Your next step"
        title="Reading is useful. A proper look is better."
        description="Book a consultation and we will assess your teeth and gums, answer your questions and write down the options."
        secondaryLabel="Patient information"
        secondaryTo="/patient-information"
      />
    </>
  );
}
