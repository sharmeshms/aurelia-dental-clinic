import { Loader2 } from "lucide-react";

export function FullPageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-ivory" aria-busy="true">
      <Loader2 className="h-6 w-6 animate-spin text-burgundy" aria-hidden />
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{label}</p>
    </main>
  );
}

export function InlineLoader({ label = "Loading" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted">
      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
      {label}
    </span>
  );
}
