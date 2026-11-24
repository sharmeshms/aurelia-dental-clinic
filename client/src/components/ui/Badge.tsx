import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "burgundy" | "ivory" | "rose" | "outline" | "success" | "warning" | "muted";

const tones: Record<Tone, string> = {
  burgundy: "bg-burgundy text-white",
  ivory: "bg-ivory text-burgundy ring-1 ring-beige",
  rose: "bg-rose/15 text-burgundy-soft ring-1 ring-rose/30",
  outline: "bg-transparent text-burgundy ring-1 ring-burgundy/20",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  muted: "bg-ivory text-muted ring-1 ring-beige",
};

export function Badge({
  children,
  tone = "ivory",
  className,
  dot,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden />}
      {children}
    </span>
  );
}
