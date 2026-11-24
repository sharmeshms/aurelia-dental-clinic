import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  size = "md",
  showValue = false,
  className,
}: {
  value: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}) {
  const px = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      role="img"
      aria-label={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(px, star <= Math.round(value) ? "fill-rose text-rose" : "fill-transparent text-beige")}
          aria-hidden
        />
      ))}
      {showValue && <span className="ml-1.5 text-sm font-medium text-ink">{value.toFixed(1)}</span>}
    </span>
  );
}
