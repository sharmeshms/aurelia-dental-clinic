import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { doctors, posts, services } from "@/data/content";
import { cn } from "@/lib/utils";

const popular = ["Implants", "Whitening", "Root canal", "Children", "Aligners"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [open, onClose]);

  const term = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return { services: [], posts: [], doctors: [] };
    return {
      services: services
        .filter((s) =>
          [s.name, s.category, s.summary, s.tagline, ...s.reasons].join(" ").toLowerCase().includes(term),
        )
        .slice(0, 4),
      posts: posts
        .filter((p) =>
          [p.title, p.category, p.excerpt, ...p.tags].join(" ").toLowerCase().includes(term),
        )
        .slice(0, 3),
      doctors: doctors
        .filter((d) =>
          [d.name, d.specialisation, d.designation, ...d.expertise].join(" ").toLowerCase().includes(term),
        )
        .slice(0, 2),
    };
  }, [term]);

  const total = results.services.length + results.posts.length + results.doctors.length;

  function go(path: string) {
    onClose();
    navigate(path);
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center px-3 pt-[10vh] sm:px-6">
          <motion.div
            className="absolute inset-0 bg-burgundy-deep/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            initial={{ opacity: 0, y: -12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-beige bg-white shadow-lift"
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (term) go(`/search?q=${encodeURIComponent(query.trim())}`);
              }}
              className="flex items-center gap-3 border-b border-beige px-5 py-4"
            >
              <Search className="h-5 w-5 shrink-0 text-burgundy" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search treatments, clinicians or articles…"
                className="h-8 w-full bg-transparent text-[15px] text-ink placeholder:text-muted/70 focus:outline-none"
                aria-label="Search"
              />
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-ivory hover:text-ink"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </form>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              {!term && (
                <div className="p-3">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Popular searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popular.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setQuery(item)}
                        className="rounded-full border border-beige bg-ivory px-3.5 py-1.5 text-xs font-medium text-burgundy transition-colors hover:border-rose hover:bg-white"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {term && total === 0 && (
                <div className="px-4 py-12 text-center">
                  <p className="font-display text-lg text-ink">No results for “{query}”</p>
                  <p className="mt-2 text-sm text-muted">
                    Try a broader term, or{" "}
                    <Link to="/contact" onClick={onClose} className="font-medium text-burgundy underline">
                      contact the clinic
                    </Link>
                    .
                  </p>
                </div>
              )}

              {results.services.length > 0 && (
                <ResultGroup label="Treatments">
                  {results.services.map((service) => (
                    <ResultRow
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      title={service.name}
                      subtitle={service.category}
                      image={service.image}
                      onClick={onClose}
                    />
                  ))}
                </ResultGroup>
              )}

              {results.posts.length > 0 && (
                <ResultGroup label="Journal">
                  {results.posts.map((post) => (
                    <ResultRow
                      key={post.slug}
                      to={`/blog/${post.slug}`}
                      title={post.title}
                      subtitle={`${post.category} · ${post.readTime}`}
                      image={post.cover}
                      onClick={onClose}
                    />
                  ))}
                </ResultGroup>
              )}

              {results.doctors.length > 0 && (
                <ResultGroup label="Clinicians">
                  {results.doctors.map((doctor) => (
                    <ResultRow
                      key={doctor.slug}
                      to={`/doctors/${doctor.slug}`}
                      title={doctor.name}
                      subtitle={doctor.specialisation}
                      image={doctor.image}
                      onClick={onClose}
                    />
                  ))}
                </ResultGroup>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-beige bg-ivory/70 px-5 py-3 text-[11.5px] text-muted">
              <span>
                Press <kbd className="rounded border border-beige bg-white px-1.5 py-0.5 font-sans">Enter</kbd> for all
                results
              </span>
              <span className="hidden sm:block">Esc to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <p className="px-3 py-2 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ResultRow({
  to,
  title,
  subtitle,
  image,
  onClick,
}: {
  to: string;
  title: string;
  subtitle: string;
  image: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-ivory",
      )}
    >
      <img src={image} alt="" className="h-10 w-12 shrink-0 rounded-lg object-cover" loading="lazy" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-ink group-hover:text-burgundy">{title}</span>
        <span className="block truncate text-[11.5px] text-muted">{subtitle}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-burgundy" />
    </Link>
  );
}
