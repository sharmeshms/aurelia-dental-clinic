import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Sparkles, X } from "lucide-react";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "aurelia-announcement-dismissed";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(sessionStorage.getItem(STORAGE_KEY) !== "1");
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage may be unavailable */
    }
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-burgundy-deep text-white transition-[height] duration-300",
        visible ? "h-auto" : "hidden",
      )}
    >
      <div className="container-x flex min-h-[38px] items-center justify-center gap-3 py-2 pr-8 text-center sm:justify-between">
        <p className="flex items-center gap-2 text-[11.5px] leading-snug text-white/80">
          <Sparkles className="hidden h-3.5 w-3.5 shrink-0 text-rose sm:block" aria-hidden />
          <span>{site.announcement.message}</span>
          <Link
            to={site.announcement.linkTo}
            className="hidden shrink-0 font-medium text-rose underline decoration-rose/40 underline-offset-4 transition-colors hover:text-white sm:inline"
          >
            {site.announcement.linkLabel}
          </Link>
        </p>
        <a
          href={site.contact.phoneHref}
          className="hidden shrink-0 items-center gap-1.5 text-[11.5px] font-medium text-white/80 transition-colors hover:text-white sm:flex"
        >
          <Phone className="h-3.5 w-3.5 text-rose" aria-hidden />
          {site.contact.phone}
        </a>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
