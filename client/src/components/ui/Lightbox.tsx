import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type LightboxItem = {
  src: string;
  title: string;
  description?: string;
  badge?: string;
};

export function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const open = index !== null;
  const item = open ? items[index] : undefined;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate((index! + 1) % items.length);
      if (event.key === "ArrowLeft") onNavigate((index! - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, index, items.length, onClose, onNavigate]);

  return createPortal(
    <AnimatePresence>
      {open && item && (
        <motion.div
          className="fixed inset-0 z-[130] flex flex-col bg-burgundy-deep/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Image viewer: ${item.title}`}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white/70 sm:px-8">
            <span className="text-xs font-medium uppercase tracking-[0.2em]">
              {index + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/20 p-2 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close image viewer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16">
            <button
              type="button"
              onClick={() => onNavigate((index - 1 + items.length) % items.length)}
              className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15 sm:left-6"
              aria-label="Previous image"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <motion.img
              key={item.src}
              src={item.src}
              alt={item.title}
              initial={{ opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={() => onNavigate((index + 1) % items.length)}
              className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition-colors hover:bg-white/15 sm:right-6"
              aria-label="Next image"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="border-t border-white/10 px-5 py-5 text-center sm:px-8">
            <div className="mx-auto max-w-2xl">
              {item.badge && (
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-rose/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-rose">
                  {item.badge}
                </span>
              )}
              <h2 className="font-display text-xl text-white sm:text-2xl">{item.title}</h2>
              {item.description && <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/60">{item.description}</p>}
              <p className={cn("mt-3 inline-flex items-center gap-1.5 text-[11px] text-white/45")}>
                <Info className="h-3 w-3" aria-hidden />
                Illustrative imagery — not a genuine patient case.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
