import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
  className,
  action,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
  action?: ReactNode;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("eyebrow mb-4", light && "eyebrow-light")}>{eyebrow}</p>
        )}
        <Tag
          className={cn(
            "text-balance text-[30px] leading-[1.15] sm:text-[38px] lg:text-[44px]",
            light ? "text-white" : "text-ink",
          )}
        >
          {title}
        </Tag>
        {description && (
          <p
            className={cn(
              "mt-5 max-w-xl text-pretty text-[15.5px] leading-relaxed",
              light ? "text-white/70" : "text-muted",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
