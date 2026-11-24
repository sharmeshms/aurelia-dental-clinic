import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Home, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/data/content";
import { useSeo } from "@/lib/seo";

export default function NotFoundPage() {
  useSeo({ title: "Page not found", noIndex: true });

  const suggestions = services.slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-ivory py-20 lg:py-28">
      <div
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-rose/15 blur-3xl"
        aria-hidden
      />
      <div className="container-x relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-[92px] leading-none text-burgundy/15 sm:text-[130px]">404</p>
          <p className="eyebrow mt-2 justify-center">Page not found</p>
          <h1 className="mt-5 text-balance text-[32px] leading-[1.12] sm:text-[42px]">
            This page has moved, or never existed.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-muted">
            The link may be out of date. You can head back to the homepage, browse treatments, or ask our reception
            team to point you in the right direction.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/" iconLeft={<Home className="h-4 w-4" />}>
              Back to home
            </ButtonLink>
            <ButtonLink to="/services" variant="secondary">
              Browse treatments
            </ButtonLink>
            <ButtonLink to="/appointment" variant="ghost" iconRight={<ArrowRight className="h-4 w-4" />}>
              Book a visit
            </ButtonLink>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <p className="mb-4 text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted">
            Popular destinations
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {suggestions.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-beige bg-white p-3.5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-rose/50"
              >
                <img
                  src={service.image}
                  alt=""
                  className="h-12 w-14 shrink-0 rounded-xl object-cover"
                  loading="lazy"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-medium text-ink group-hover:text-burgundy">
                    {service.name}
                  </span>
                  <span className="block text-[11px] text-muted">{service.category}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted group-hover:text-burgundy" aria-hidden />
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-muted">
            <Link to="/appointment" className="inline-flex items-center gap-1.5 hover:text-burgundy">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden /> Appointments
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-1.5 hover:text-burgundy">
              <Search className="h-3.5 w-3.5" aria-hidden /> Contact the clinic
            </Link>
            <Link to="/faq" className="hover:text-burgundy">
              FAQs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
