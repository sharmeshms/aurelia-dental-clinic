import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";

export function Logo({
  light = false,
  compact = false,
  className,
}: {
  light?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      to="/"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform duration-500 ease-luxe group-hover:-rotate-3",
          light ? "bg-white/10 ring-1 ring-white/20" : "bg-burgundy",
        )}
      >
        <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
          <path
            d="M20 46V22.5c0-1.6 1.3-2.9 2.9-2.9h18.2c1.6 0 2.9 1.3 2.9 2.9V46"
            fill="none"
            stroke={light ? "#F8F4F1" : "#F8F4F1"}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M27 46V33.5c0-2.5 2-4.5 4.5-4.5h1c2.5 0 4.5 2 4.5 4.5V46"
            fill="none"
            stroke="#C6A18D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="32" cy="24.5" r="2.2" fill="#C6A18D" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[21px] tracking-[0.16em]",
            light ? "text-white" : "text-burgundy",
          )}
        >
          {compact ? site.shortName.toUpperCase() : site.name.split(" ")[0].toUpperCase()}
        </span>
        <span className="sr-only"> </span>
        {!compact && (
          <span
            className={cn(
              "mt-1 text-[8.5px] font-medium uppercase tracking-[0.34em]",
              light ? "text-rose" : "text-muted",
            )}
          >
            {site.name.split(" ").slice(1).join(" ") || "Dental Studio"}
          </span>
        )}
      </span>
    </Link>
  );
}
