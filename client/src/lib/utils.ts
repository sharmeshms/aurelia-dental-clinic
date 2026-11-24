import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | Date, opts?: Intl.DateTimeFormatOptions) {
  const date = typeof value === "string" ? new Date(`${value}T12:00:00`) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  }).format(date);
}

export function formatShortDate(value: string | Date) {
  return formatDate(value, { day: "2-digit", month: "short", year: "numeric" });
}

export function formatWeekday(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date);
}

export function todayISO() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function addDaysISO(days: number, from = new Date()) {
  const next = new Date(from);
  next.setDate(next.getDate() + days);
  const offset = next.getTimezoneOffset();
  return new Date(next.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function isPastDate(value: string) {
  if (!value) return false;
  return value < todayISO();
}

export function initials(name: string) {
  return name
    .replace(/^Dr\.?\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function titleCase(value: string) {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

export function truncate(value: string, length = 140) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}…`;
}

/** Simple deterministic pastel-ish tone for initials avatars. */
export function avatarTone(seed: string) {
  const tones = [
    "bg-burgundy-100 text-burgundy",
    "bg-beige text-burgundy-soft",
    "bg-rose/20 text-burgundy",
  ];
  const total = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return tones[total % tones.length];
}

export function parseApiDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
