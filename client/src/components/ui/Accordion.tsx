import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItemData = {
  q: string;
  a: string;
  id?: string;
};

export function Accordion({
  items,
  defaultOpen = 0,
  className,
  light = false,
}: {
  items: AccordionItemData[];
  defaultOpen?: number | null;
  className?: string;
  light?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className={cn("divide-y", light ? "divide-white/15" : "divide-beige", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.id ?? item.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className={cn(
                  "flex w-full items-start justify-between gap-6 py-5 text-left transition-colors",
                  light ? "text-white hover:text-rose" : "text-ink hover:text-burgundy",
                )}
              >
                <span className="font-display text-[17px] leading-snug sm:text-lg">{item.q}</span>
                <span
                  className={cn(
                    "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border transition-colors",
                    light
                      ? "border-white/25 text-white"
                      : isOpen
                        ? "border-burgundy bg-burgundy text-white"
                        : "border-beige bg-ivory text-burgundy",
                  )}
                >
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p
                    className={cn(
                      "max-w-2xl pb-6 pr-10 text-[14.5px] leading-[1.8]",
                      light ? "text-white/65" : "text-muted",
                    )}
                  >
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
