import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Stethoscope,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "./AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/admin/doctors", label: "Clinicians", icon: UserRound },
  { to: "/admin/services", label: "Treatments", icon: Stethoscope },
  { to: "/admin/posts", label: "Journal", icon: Newspaper },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/newsletter", label: "Newsletter", icon: Users },
];

const pageTitles: Record<string, string> = {
  "/admin": "Overview",
  "/admin/appointments": "Appointments",
  "/admin/doctors": "Clinicians",
  "/admin/services": "Treatments",
  "/admin/posts": "Journal",
  "/admin/gallery": "Gallery",
  "/admin/messages": "Messages",
  "/admin/newsletter": "Newsletter",
};

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    await logout();
    navigate("/admin/login", { replace: true });
  }

  const title = pageTitles[location.pathname] ?? "Workspace";

  const sidebar = (
    <div className="flex h-full flex-col bg-burgundy-deep text-white">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-white/10 px-5">
        <Logo light />
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/70 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 pt-5">
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-rose/80">Practice workspace</p>
      </div>

      <nav aria-label="Admin" className="mt-3 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-white/12 text-white"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white",
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          View public site
        </Link>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/[0.06] p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose/20 text-[11px] font-semibold text-rose">
            {user?.name?.slice(0, 1).toUpperCase() ?? "A"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-medium text-white">{user?.name ?? "Admin"}</p>
            <p className="truncate text-[10.5px] text-white/40">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] lg:block">{sidebar}</aside>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[90] lg:hidden">
            <motion.div
              className="absolute inset-0 bg-burgundy-deep/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-[264px]"
            >
              {sidebar}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 border-b border-beige/80 bg-white/95 backdrop-blur">
          <div className="flex h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-full border border-beige text-ink lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">Aurelia Dental Studio</p>
                <h1 className="font-display text-[19px] leading-tight text-ink">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border border-beige bg-ivory px-3 py-1.5 text-[10.5px] font-medium text-muted sm:inline-flex">
                Signed in as {user?.name?.split(" ")[0] ?? "admin"}
              </span>
              <Link
                to="/"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-beige bg-white px-3.5 text-[12px] font-medium text-burgundy transition-colors hover:border-rose"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                <span className="hidden sm:inline">View site</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>

        <footer className="border-t border-beige/70 px-4 py-4 text-[10.5px] text-muted sm:px-6 lg:px-8">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <FileText className="h-3 w-3" aria-hidden />
            Demonstration admin workspace. Appointment requests are pending until confirmed by the clinic. Change the
            default credentials before deployment.
          </p>
        </footer>
      </div>
    </div>
  );
}
