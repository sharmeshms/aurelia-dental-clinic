import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { useAuth } from "./AuthContext";
import { apiError } from "@/lib/api";
import { site } from "@/config/site";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={from} replace />;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email address and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-ivory lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-burgundy-deep p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-white/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 left-10 h-80 w-80 rounded-full bg-rose/10 blur-3xl"
          aria-hidden
        />
        <div className="relative">
          <Logo light />
        </div>
        <div className="relative max-w-md">
          <p className="eyebrow eyebrow-light mb-4">Practice workspace</p>
          <h1 className="font-display text-[38px] leading-[1.12] text-white">
            Everything the front desk needs, in one calm place.
          </h1>
          <p className="mt-4 text-[13.5px] leading-relaxed text-white/55">
            Review appointment requests, confirm times, manage clinician and treatment content, and keep an eye on
            enquiries.
          </p>
          <div className="mt-7 space-y-3">
            {[
              "Appointment requests arrive as pending until confirmed",
              "Edits to treatments and clinicians appear on the public site",
              "Contact messages and newsletter sign-ups in one inbox",
            ].map((item) => (
              <p key={item} className="flex items-start gap-2.5 text-[12.5px] leading-relaxed text-white/65">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden />
                {item}
              </p>
            ))}
          </div>
        </div>
        <p className="relative text-[10.5px] leading-relaxed text-white/30">
          Demonstration environment. Do not enter real patient information. Replace default credentials before
          deployment.
        </p>
      </div>

      <main className="flex flex-col justify-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="mt-8 lg:mt-0">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-burgundy">Staff sign in</p>
            <h2 className="mt-3 font-display text-[30px] leading-tight text-ink">Welcome back.</h2>
            <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
              Sign in to manage appointments and clinic content.
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate className="mt-7 space-y-4">
            <Field label="Email address" htmlFor="login-email" required>
              <Input
                id="login-email"
                type="email"
                autoComplete="username"
                placeholder="you@practice.com"
                icon={<Mail className="h-4 w-4" />}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Field>

            <Field label="Password" htmlFor="login-password" required>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-12 w-full rounded-xl border border-beige bg-white pl-10 pr-11 text-sm text-ink placeholder:text-muted/60 transition-all focus:border-burgundy/60 focus:outline-none focus:ring-4 focus:ring-burgundy/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted transition-colors hover:bg-ivory hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] leading-relaxed text-red-700" role="alert">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {import.meta.env.DEV && (
            <div className="mt-6 rounded-2xl border border-beige bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Demo credentials</p>
              <p className="mt-2 font-mono text-[11.5px] leading-relaxed text-ink">
                admin@aureliadental.studio
                <br />
                Admin@12345
              </p>
              <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                Shown in development builds only. Change these in <code>server/.env</code> before deployment.
              </p>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 text-[11.5px]">
            <a href="/" className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-burgundy">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back to site
            </a>
            <a href={`mailto:${site.contact.email}`} className="text-muted transition-colors hover:text-burgundy">
              Need access?
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
