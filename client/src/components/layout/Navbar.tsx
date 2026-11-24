import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Menu,
  Phone,
  Search,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SearchDialog } from "@/components/ui/SearchDialog";
import { ButtonLink } from "@/components/ui/Button";
import { services } from "@/data/content";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const nav = [
  { label: "About", to: "/about" },
  { label: "Treatments", to: "/services", mega: true },
  { label: "Dentists", to: "/doctors" },
  { label: "Patient Info", to: "/patient-information" },
  { label: "Journal", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

const moreLinks = [
  { label: "Smile gallery", to: "/gallery" },
  { label: "Patient stories", to: "/testimonials" },
  { label: "Frequently asked questions", to: "/faq" },
  { label: "Book an appointment", to: "/appointment" },
];

export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileTreatments, setMobileTreatments] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof services>();
    for (const service of services) {
      map.set(service.category, [...(map.get(service.category) ?? []), service]);
    }
    return Array.from(map.entries());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-all duration-300",
          scrolled ? "border-beige/80 shadow-soft" : "border-transparent",
        )}
      >
        <div className="container-x">
          <div className={cn("flex items-center justify-between gap-6 transition-all", scrolled ? "h-[70px]" : "h-[82px]")}>
            <Logo />

            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {nav.map((item) =>
                item.mega ? (
                  <div
                    key={item.to}
                    className="relative"
                    onMouseEnter={() => setMegaOpen(true)}
                    onMouseLeave={() => setMegaOpen(false)}
                  >
                    <button
                      type="button"
                      className={cn(
                        "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                        isActive(item.to) || megaOpen
                          ? "text-burgundy"
                          : "text-ink/75 hover:text-burgundy",
                      )}
                      aria-expanded={megaOpen}
                      aria-haspopup="true"
                      onClick={() => setMegaOpen((value) => !value)}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("h-3.5 w-3.5 transition-transform", megaOpen && "rotate-180")}
                        aria-hidden
                      />
                    </button>
                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute left-1/2 top-full z-50 w-[760px] -translate-x-1/2 pt-3"
                        >
                          <div className="overflow-hidden rounded-3xl border border-beige bg-white shadow-lift">
                            <div className="grid grid-cols-[1fr_240px]">
                              <div className="grid grid-cols-3 gap-x-6 gap-y-5 p-6">
                                {grouped.map(([category, items]) => (
                                  <div key={category}>
                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose">
                                      {category}
                                    </p>
                                    <ul className="space-y-1">
                                      {items.map((service) => (
                                        <li key={service.slug}>
                                          <Link
                                            to={`/services/${service.slug}`}
                                            className="block rounded-md py-0.5 text-[12.5px] leading-snug text-ink/75 transition-colors hover:text-burgundy"
                                          >
                                            {service.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                              <div className="flex flex-col justify-between bg-ivory p-6">
                                <div>
                                  <p className="eyebrow mb-3">Not sure?</p>
                                  <p className="font-display text-xl leading-snug text-ink">
                                    Start with a considered consultation.
                                  </p>
                                  <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
                                    We will assess, explain your options and only recommend what you need.
                                  </p>
                                </div>
                                <div className="mt-5 space-y-2">
                                  <ButtonLink to="/appointment" size="sm" className="w-full" iconRight={<ArrowRight className="h-3.5 w-3.5" />}>
                                    Book a visit
                                  </ButtonLink>
                                  <Link
                                    to="/services"
                                    className="block text-center text-[12px] font-medium text-burgundy underline decoration-rose/50 underline-offset-4"
                                  >
                                    View all treatments
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive: active }) =>
                      cn(
                        "relative rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                        active || isActive(item.to) ? "text-burgundy" : "text-ink/75 hover:text-burgundy",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ),
              )}
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ivory hover:text-burgundy"
                aria-label="Search the site"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
              <a
                href={site.contact.phoneHref}
                className="hidden items-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium text-ink/75 transition-colors hover:text-burgundy xl:flex"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden />
                {site.contact.phone}
              </a>
              <ButtonLink
                to="/appointment"
                size="sm"
                className="hidden sm:inline-flex"
                iconLeft={<CalendarDays className="h-3.5 w-3.5" aria-hidden />}
              >
                Book appointment
              </ButtonLink>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ivory lg:hidden"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col bg-white lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="flex h-[70px] shrink-0 items-center justify-between border-b border-beige px-5">
              <Logo />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-beige text-ink"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <nav aria-label="Mobile" className="divide-y divide-beige/80">
                {nav.map((item) =>
                  item.mega ? (
                    <div key={item.to}>
                      <button
                        type="button"
                        onClick={() => setMobileTreatments((value) => !value)}
                        className="flex w-full items-center justify-between py-4 text-left font-display text-[22px] text-ink"
                        aria-expanded={mobileTreatments}
                      >
                        Treatments
                        <ChevronDown
                          className={cn("h-4 w-4 text-muted transition-transform", mobileTreatments && "rotate-180")}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileTreatments && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4">
                              <Link
                                to="/services"
                                className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy"
                              >
                                All treatments <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                {grouped.map(([category, items]) => (
                                  <div key={category}>
                                    <p className="mb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-rose">
                                      {category}
                                    </p>
                                    <ul className="space-y-1.5">
                                      {items.map((service) => (
                                        <li key={service.slug}>
                                          <Link
                                            to={`/services/${service.slug}`}
                                            className="block text-[12.5px] leading-snug text-ink/75"
                                          >
                                            {service.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive: active }) =>
                        cn(
                          "block py-4 font-display text-[22px]",
                          active ? "text-burgundy" : "text-ink",
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ),
                )}
              </nav>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-beige pt-5">
                {moreLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="text-[13px] text-muted hover:text-burgundy">
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-7 space-y-2 rounded-2xl bg-ivory p-4">
                <ButtonLink to="/appointment" className="w-full" iconLeft={<CalendarDays className="h-4 w-4" />}>
                  Book an appointment
                </ButtonLink>
                <a
                  href={site.contact.phoneHref}
                  className="flex h-11 items-center justify-center gap-2 rounded-full border border-burgundy/20 bg-white text-sm font-medium text-burgundy"
                >
                  <Phone className="h-4 w-4" aria-hidden /> {site.contact.phone}
                </a>
              </div>

              <div className="mt-6 space-y-1 pb-8 text-[12.5px] text-muted">
                <p>{site.contact.address.line1}, {site.contact.address.line2}</p>
                <p>{site.contact.address.city} {site.contact.address.postcode}</p>
                <p className="pt-1">{site.hours[0].day}–{site.hours[4].day} · {site.hours[0].hours}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
