import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, CalendarDays, MessageCircle } from "lucide-react";
import { site, whatsappLink } from "@/config/site";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isBooking = location.pathname === "/appointment";

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isAdmin) return null;

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2.5 sm:bottom-7 sm:right-6">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="grid h-10 w-10 place-items-center rounded-full border border-beige bg-white text-burgundy shadow-soft transition-colors hover:border-rose"
            aria-label="Back to top"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer noopener"
        className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105"
        aria-label="Contact the clinic on WhatsApp"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
      </a>

      {!isBooking && (
        <Link
          to="/appointment"
          className="hidden items-center gap-2 rounded-full bg-burgundy px-5 py-3 text-[13px] font-medium text-white shadow-lift transition-all hover:bg-burgundy-deep sm:inline-flex"
        >
          <CalendarDays className="h-4 w-4" aria-hidden />
          Book appointment
        </Link>
      )}

      {!isBooking && (
        <Link
          to="/appointment"
          className="grid h-12 w-12 place-items-center rounded-full bg-burgundy text-white shadow-lift sm:hidden"
          aria-label="Book an appointment"
        >
          <CalendarDays className="h-5 w-5" aria-hidden />
        </Link>
      )}

      <span className="sr-only">Clinic telephone: {site.contact.phone}</span>
    </div>
  );
}
