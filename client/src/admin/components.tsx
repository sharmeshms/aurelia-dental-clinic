import type { ReactNode } from "react";
import { AlertTriangle, Inbox } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-[26px] leading-tight text-ink sm:text-[30px]">{title}</h2>
        {description && <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-muted">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-2xl border border-beige/80 bg-white shadow-soft", className)}>{children}</div>;
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "default" | "warning" | "success" | "dark";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-soft",
        tone === "dark"
          ? "border-burgundy bg-burgundy text-white"
          : tone === "warning"
            ? "border-amber-200 bg-amber-50"
            : tone === "success"
              ? "border-emerald-200 bg-emerald-50"
              : "border-beige/80 bg-white",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className={cn(
            "text-[10.5px] font-semibold uppercase tracking-[0.14em]",
            tone === "dark" ? "text-rose" : tone === "warning" ? "text-amber-700" : tone === "success" ? "text-emerald-700" : "text-muted",
          )}
        >
          {label}
        </p>
        {icon && (
          <span
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full",
              tone === "dark" ? "bg-white/10 text-white" : "bg-ivory text-burgundy",
            )}
          >
            {icon}
          </span>
        )}
      </div>
      <p
        className={cn(
          "mt-3 font-display text-[30px] leading-none",
          tone === "dark" ? "text-white" : "text-ink",
        )}
      >
        {value}
      </p>
      {hint && (
        <p
          className={cn(
            "mt-2 text-[11px] leading-snug",
            tone === "dark" ? "text-white/55" : tone === "warning" ? "text-amber-800" : tone === "success" ? "text-emerald-800" : "text-muted",
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  completed: "bg-burgundy-50 text-burgundy ring-burgundy-200",
  cancelled: "bg-red-50 text-red-600 ring-red-200",
  new: "bg-burgundy-50 text-burgundy ring-burgundy-200",
  read: "bg-ivory text-muted ring-beige",
};

export function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ring-1",
        statusStyles[key] ?? "bg-ivory text-muted ring-beige",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden />
      {status}
    </span>
  );
}

export function EmptyRow({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-ivory text-muted">
        <Inbox className="h-5 w-5" aria-hidden />
      </span>
      <p className="mt-3 font-display text-lg text-ink">{title}</p>
      {description && <p className="mt-1 max-w-sm text-[12px] leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-4 w-4" aria-hidden />
        </span>
        <p className="text-[13px] leading-relaxed text-muted">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          loading={loading}
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700"
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function exportCsv(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const escape = (value: unknown) => {
    const text = value === null || value === undefined ? "" : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  };
  const csv = [
    headers.map(escape).join(","),
    ...rows.map((row) => headers.map((header) => escape(row[header])).join(",")),
  ].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-10 w-full rounded-full border border-beige bg-white pl-10 pr-4 text-[12.5px] text-ink placeholder:text-muted/60 focus:border-burgundy/50 focus:outline-none focus:ring-4 focus:ring-burgundy/10"
      />
    </div>
  );
}
