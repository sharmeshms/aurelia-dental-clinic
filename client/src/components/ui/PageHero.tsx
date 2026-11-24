import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  image,
  imageAlt,
  children,
  align = "left",
  tone = "ivory",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "ivory" | "white";
  className?: string;
}) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-beige/70",
        tone === "ivory" ? "bg-ivory" : "bg-white",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-40 -top-52 h-[520px] w-[520px] rounded-full bg-rose/10 blur-3xl"
        aria-hidden
      />
      <div className="container-x relative py-10 sm:py-14 lg:py-16">
        {crumbs && <Breadcrumbs items={crumbs} className="mb-8" />}
        <div
          className={cn(
            "grid items-center gap-10",
            image ? "lg:grid-cols-[1.05fr_0.95fr] lg:gap-16" : "max-w-3xl",
            align === "center" && "text-center",
          )}
        >
          <div className={cn(align === "center" && "mx-auto max-w-3xl")}>
            {eyebrow && <p className={cn("eyebrow mb-4", align === "center" && "justify-center")}>{eyebrow}</p>}
            <h1 className="text-balance text-[34px] leading-[1.1] sm:text-[44px] lg:text-[52px]">{title}</h1>
            {description && (
              <p
                className={cn(
                  "mt-5 max-w-2xl text-pretty text-[15.5px] leading-[1.8] text-muted",
                  align === "center" && "mx-auto",
                )}
              >
                {description}
              </p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>
          {image && (
            <div className="relative">
              <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border border-rose/40" aria-hidden />
              <div className="relative overflow-hidden rounded-[2rem] bg-beige shadow-soft">
                <img
                  src={image}
                  alt={imageAlt ?? ""}
                  className="img-grade aspect-[5/4] w-full object-cover"
                  loading="eager"
                  width={960}
                  height={768}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
