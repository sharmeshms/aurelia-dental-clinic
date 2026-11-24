import { useState } from "react";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { api, apiError } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

export function NewsletterForm({ variant = "footer" }: { variant?: "footer" | "card" }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/newsletter", { email: email.trim() });
      toast({
        title: "You're on the list",
        description: "Occasional oral health notes and clinic news. No noise.",
        variant: "success",
      });
      setEmail("");
    } catch (err) {
      const message = apiError(err);
      setError(message);
      toast({ title: "Subscription failed", description: message, variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  const dark = variant === "footer";

  return (
    <form onSubmit={onSubmit} noValidate>
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border p-1.5 pl-4 transition-colors",
          dark ? "border-white/15 bg-white/5" : "border-beige bg-white",
        )}
      >
        <Mail className={cn("h-4 w-4 shrink-0", dark ? "text-rose" : "text-burgundy")} aria-hidden />
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          aria-label="Email address for newsletter"
          aria-invalid={Boolean(error)}
          className={cn(
            "h-9 min-w-0 flex-1 bg-transparent text-[13px] focus:outline-none",
            dark ? "text-white placeholder:text-white/60" : "text-ink placeholder:text-muted/60",
          )}
        />
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors disabled:opacity-60",
            dark ? "bg-white text-burgundy hover:bg-rose" : "bg-burgundy text-white hover:bg-burgundy-deep",
          )}
          aria-label="Subscribe to the newsletter"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-[11.5px] text-red-300" role="alert">
          {error}
        </p>
      ) : (
        <p className={cn("mt-2 text-[11px] leading-relaxed", dark ? "text-white/60" : "text-muted")}>
          Occasional oral health notes. Unsubscribe any time.
        </p>
      )}
    </form>
  );
}
