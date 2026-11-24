import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Download,
  Eye,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { api, apiError } from "@/lib/api";
import { cn, formatDate, parseApiDate } from "@/lib/utils";
import { ConfirmDialog, EmptyRow, PageHeader, Panel, StatusBadge, exportCsv } from "./components";
import { useDebounced, useDocumentTitle } from "./ProtectedRoute";

type Appointment = {
  id: string;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  doctor?: string;
  date: string;
  time: string;
  message?: string;
  status: string;
  adminNote?: string;
  source?: string;
  createdAt: string;
};

const statuses = ["all", "pending", "confirmed", "completed", "cancelled"] as const;
type StatusFilter = (typeof statuses)[number];

const statusLabels: Record<string, string> = {
  all: "All requests",
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function Appointments() {
  useDocumentTitle("Appointments");

  const { toast } = useToast();
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query, 200);

  const [detail, setDetail] = useState<Appointment | null>(null);
  const [detailStatus, setDetailStatus] = useState("pending");
  const [detailNote, setDetailNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Appointment | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<{ data: Appointment[] }>("/admin/appointments");
      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    for (const item of items) map[item.status] = (map[item.status] ?? 0) + 1;
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return items.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (!term) return true;
      return [item.reference, item.firstName, item.lastName, item.email, item.phone, item.service, item.doctor]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [items, status, debounced]);

  function openDetail(appointment: Appointment) {
    setDetail(appointment);
    setDetailStatus(appointment.status);
    setDetailNote(appointment.adminNote ?? "");
  }

  async function patchStatus(appointment: Appointment, nextStatus: string, note?: string) {
    const previous = appointment.status;
    setUpdatingId(appointment.id);
    setItems((current) =>
      current.map((item) => (item.id === appointment.id ? { ...item, status: nextStatus } : item)),
    );
    try {
      const { data } = await api.patch<{ data: Appointment }>(`/admin/appointments/${appointment.id}`, {
        status: nextStatus,
        ...(note !== undefined ? { adminNote: note } : {}),
      });
      setItems((current) => current.map((item) => (item.id === appointment.id ? { ...item, ...data.data } : item)));
      if (detail?.id === appointment.id) {
        setDetail((current) => (current ? { ...current, ...data.data } : current));
      }
      toast({ title: "Appointment updated", description: `Marked as ${nextStatus}.` });
    } catch (err) {
      setItems((current) =>
        current.map((item) => (item.id === appointment.id ? { ...item, status: previous } : item)),
      );
      toast({ title: "Could not update", description: apiError(err), variant: "error" });
    } finally {
      setUpdatingId(null);
    }
  }

  async function saveDetail() {
    if (!detail) return;
    setSaving(true);
    try {
      const { data } = await api.patch<{ data: Appointment }>(`/admin/appointments/${detail.id}`, {
        status: detailStatus,
        adminNote: detailNote,
      });
      setItems((current) => current.map((item) => (item.id === detail.id ? { ...item, ...data.data } : item)));
      setDetail(null);
      toast({ title: "Appointment updated" });
    } catch (err) {
      toast({ title: "Could not update", description: apiError(err), variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api.delete(`/admin/appointments/${deleting.id}`);
      setItems((current) => current.filter((item) => item.id !== deleting.id));
      if (detail?.id === deleting.id) setDetail(null);
      toast({ title: "Appointment deleted" });
      setDeleting(null);
    } catch (err) {
      toast({ title: "Could not delete", description: apiError(err), variant: "error" });
    } finally {
      setDeleteBusy(false);
    }
  }

  function handleExport() {
    exportCsv(
      "aurelia-appointments.csv",
      filtered.map((item) => ({
        reference: item.reference,
        status: item.status,
        first_name: item.firstName,
        last_name: item.lastName,
        email: item.email,
        phone: item.phone,
        treatment: item.service,
        clinician: item.doctor ?? "",
        preferred_date: item.date,
        preferred_time: item.time,
        notes: item.message ?? "",
        admin_note: item.adminNote ?? "",
        requested_at: item.createdAt,
      })),
    );
    toast({ title: "CSV exported", description: `${filtered.length} appointment requests.` });
  }

  return (
    <>
      <PageHeader
        title="Appointment requests"
        description="Every online request arrives as pending. Confirm the time with the patient, then mark it confirmed. Only confirmed appointments block new requests for the same slot."
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={load}
              disabled={loading}
              iconLeft={<RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExport}
              disabled={!filtered.length}
              iconLeft={<Download className="h-3.5 w-3.5" />}
            >
              Export CSV
            </Button>
          </>
        }
      />

      <Panel className="mb-4 p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 hide-scrollbar" role="tablist" aria-label="Filter appointments by status">
            {statuses.map((entry) => (
              <button
                key={entry}
                type="button"
                role="tab"
                aria-selected={status === entry}
                onClick={() => setStatus(entry)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors",
                  status === entry ? "bg-burgundy text-white" : "text-ink/65 hover:bg-ivory hover:text-burgundy",
                )}
              >
                {statusLabels[entry]}
                <span className={cn("ml-1.5 text-[10px]", status === entry ? "text-white/60" : "text-muted")}>
                  {counts[entry] ?? 0}
                </span>
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, reference, treatment…"
              aria-label="Search appointments"
              className="h-10 w-full rounded-full border border-beige bg-white pl-10 pr-4 text-[12.5px] text-ink placeholder:text-muted focus:border-burgundy/50 focus:outline-none focus:ring-4 focus:ring-burgundy/10"
            />
          </div>
        </div>
      </Panel>

      {error ? (
        <Panel>
          <EmptyRow
            title="Could not load appointments"
            description={error}
            action={
              <Button size="sm" variant="secondary" onClick={load}>
                Try again
              </Button>
            }
          />
        </Panel>
      ) : loading ? (
        <Panel className="flex items-center justify-center gap-2 py-20 text-[12.5px] text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading requests…
        </Panel>
      ) : filtered.length === 0 ? (
        <Panel>
          <EmptyRow
            title={items.length ? "No requests match these filters" : "No appointment requests yet"}
            description={
              items.length
                ? "Try another status or clear the search."
                : "Requests from the public booking form will appear here with a pending status."
            }
            action={
              items.length ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setStatus("all");
                    setQuery("");
                  }}
                >
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        </Panel>
      ) : (
        <div className="space-y-2">
          {filtered.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-2xl border border-beige/80 bg-white p-4 shadow-soft"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13.5px] font-semibold text-ink">
                      {appointment.firstName} {appointment.lastName}
                    </p>
                    <StatusBadge status={appointment.status} />
                    <span className="font-mono text-[10px] tracking-wide text-muted">{appointment.reference}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-rose" aria-hidden />
                      {formatDate(appointment.date)} · {appointment.time}
                    </span>
                    <span className="truncate">{appointment.service}</span>
                    {appointment.doctor && <span className="truncate">{appointment.doctor}</span>}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" aria-hidden /> {appointment.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3 w-3" aria-hidden /> {appointment.phone}
                    </span>
                    <span>Requested {parseApiDate(appointment.createdAt)}</span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`status-${appointment.id}`}>
                    Appointment status
                  </label>
                  <Select
                    id={`status-${appointment.id}`}
                    value={appointment.status}
                    disabled={updatingId === appointment.id}
                    onChange={(event) => patchStatus(appointment, event.target.value)}
                    className="h-9 w-[136px] rounded-full text-[12px]"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                  <button
                    type="button"
                    onClick={() => openDetail(appointment)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-beige text-muted transition-colors hover:border-rose hover:text-burgundy"
                    aria-label={`View ${appointment.reference}`}
                    title="View details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(appointment)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-beige text-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${appointment.reference}`}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title="Appointment request"
        description={detail ? detail.reference : undefined}
        size="md"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDetail(null);
                if (detail) setDeleting(detail);
              }}
              className="text-red-600 hover:bg-red-50"
              iconLeft={<Trash2 className="h-3.5 w-3.5" />}
            >
              Delete
            </Button>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="ghost" size="sm" onClick={() => setDetail(null)} disabled={saving}>
                Close
              </Button>
              <Button size="sm" onClick={saveDetail} loading={saving}>
                Save changes
              </Button>
            </div>
          </div>
        }
      >
        {detail && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={detail.status} />
              <span className="rounded-full bg-ivory px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
                {detail.source === "website" ? "Website request" : detail.source ?? "Website"}
              </span>
            </div>

            <dl className="grid gap-3 rounded-2xl border border-beige bg-ivory p-4 sm:grid-cols-2">
              {[
                ["Patient", `${detail.firstName} ${detail.lastName}`],
                ["Email", detail.email],
                ["Telephone", detail.phone],
                ["Treatment", detail.service],
                ["Clinician", detail.doctor || "No preference"],
                ["Preferred date", formatDate(detail.date)],
                ["Preferred time", detail.time],
                ["Requested at", parseApiDate(detail.createdAt)],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">{label}</dt>
                  <dd className="mt-0.5 break-words text-[12.5px] font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>

            {detail.message && (
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">Patient notes</p>
                <p className="mt-1.5 rounded-xl border border-beige bg-white p-3 text-[12.5px] leading-relaxed text-ink/80">
                  {detail.message}
                </p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Status" htmlFor="detail-status">
                <Select id="detail-status" value={detailStatus} onChange={(event) => setDetailStatus(event.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </Field>
              <div className="rounded-xl border border-beige bg-white p-3 text-[11.5px] leading-relaxed text-muted sm:col-span-1">
                Marking as <strong className="text-ink">confirmed</strong> blocks that time for other requests.
              </div>
            </div>

            <Field
              label="Internal note"
              htmlFor="detail-note"
              hint="Visible to staff only. Do not record sensitive clinical details here."
            >
              <Textarea
                id="detail-note"
                rows={3}
                value={detailNote}
                onChange={(event) => setDetailNote(event.target.value)}
                placeholder="e.g. Confirmed by phone on 24 Nov; patient asked for a morning slot."
              />
            </Field>

            <div className="rounded-xl border border-amber-200/70 bg-amber-50/60 px-4 py-3 text-[11px] leading-relaxed text-amber-900/80">
              This is a demonstration workspace. In a real practice, appointment and clinical records belong in your
              practice-management system, not in a website database.
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this appointment request?"
        description={`Reference ${deleting?.reference ?? ""} will be permanently removed. Consider marking it cancelled instead if you need to keep the record.`}
        confirmLabel="Delete permanently"
        loading={deleteBusy}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
