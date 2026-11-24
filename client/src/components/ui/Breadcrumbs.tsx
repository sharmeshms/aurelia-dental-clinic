import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items, className, light = false }: { items: Crumb[]; className?: string; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-[12.5px]", className)}>
      <ol className={cn("flex flex-wrap items-center gap-1.5", light ? "text-white/55" : "text-muted")}>
        <li>
          <Link
            to="/"
            className={cn(
              "inline-flex items-center gap-1.5 transition-colors",
              light ? "hover:text-white" : "hover:text-burgundy",
            )}
          >
            <Home className="h-3.5 w-3.5" aria-hidden />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 opacity-50" aria-hidden />
            {item.to ? (
              <Link
                to={item.to}
                className={cn(
                  "transition-colors",
                  light ? "hover:text-white" : "hover:text-burgundy",
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className={cn("font-medium", light ? "text-white/85" : "text-ink")}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
