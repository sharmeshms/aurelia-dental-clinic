import { useEffect, useMemo, useState } from "react";
import { CheckCheck, Mail, MailOpen, Phone, RefreshCw, Reply, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { api, apiError } from "@/lib/api";
import { cn, parseApiDate } from "@/lib/utils";
import { ConfirmDialog, EmptyRow, PageHeader, Panel, StatusBadge } from "./components";
import { useDebounced, useDocumentTitle } from "./ProtectedRoute";

type Message = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function Messages() {
  useDocumentTitle("Messages");

  const { toast } = useToast();
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query, 200);
  const [detail, setDetail] = useState<Message | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Message | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<{ data: Message[] }>("/admin/messages");
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

  const unread = items.filter((item) => !item.read).length;

  const visible = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    return items.filter((item) => {
      if (filter === "unread" && item.read) return false;
      if (!term) return true;
      return [item.name, item.email, item.phone, item.subject, item.message].join(" ").toLowerCase().includes(term);
    });
  }, [items, filter, debounced]);

  async function setRead(message: Message, read: boolean) {
    setBusyId(message.id);
    try {
      await api.patch(`/admin/messages/${message.id}`, { read });
      setItems((current) => current.map((item) => (item.id === message.id ? { ...item, read } : item)));
      setDetail((current) => (current && current.id === message.id ? { ...current, read } : current));
    } catch (err) {
      toast({ title: "Could not update message", description: apiError(err), variant: "error" });
    } finally {
      setBusyId(null);
    }
  }

  function openMessage(message: Message) {
    setDetail(message);
    if (!message.read) setRead(message, true);
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api.delete(`/admin/messages/${deleting.id}`);
      setItems((current) => current.filter((item) => item.id !== deleting.id));
      if (detail?.id === deleting.id) setDetail(null);
      toast({ title: "Message deleted" });
      setDeleting(null);
    } catch (err) {
      toast({ title: "Could not delete", description: apiError(err), variant: "error" });
    } finally {
      setDeleteBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Messages sent through the public contact form. Opening a message marks it read. Reply from your practice mailbox rather than from this demo."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={load}
            disabled={loading}
            iconLeft={<RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />}
          >
            Refresh
          </Button>
        }
      />

      <Panel className="mb-4 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            {(
              [
                ["all", `All (${items.length})`],
                ["unread", `Unread (${unread})`],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors",
                  filter === value ? "bg-burgundy text-white" : "text-ink/65 hover:bg-ivory hover:text-burgundy",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search messages…"
              aria-label="Search messages"
              className="h-10 w-full rounded-full border border-beige bg-white pl-10 pr-4 text-[12.5px] text-ink placeholder:text-muted/60 focus:border-burgundy/50 focus:outline-none focus:ring-4 focus:ring-burgundy/10"
            />
          </div>
        </div>
      </Panel>

      {error ? (
        <Panel>
          <EmptyRow
            title="Could not load messages"
            description={error}
            action={
              <Button size="sm" variant="secondary" onClick={load}>
                Try again
              </Button>
            }
          />
        </Panel>
      ) : loading ? (
        <Panel className="py-20 text-center text-[12.5px] text-muted">Loading enquiries…</Panel>
      ) : visible.length === 0 ? (
        <Panel>
          <EmptyRow
            title={filter === "unread" ? "No unread messages" : "No messages yet"}
            description={
              filter === "unread"
                ? "Everything has been read. Switch to all messages to review the history."
                : "Messages sent through the contact form will appear here."
            }
          />
        </Panel>
      ) : (
        <div className="space-y-2">
          {visible.map((message) => (
            <button
              key={message.id}
              type="button"
              onClick={() => openMessage(message)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border bg-white p-4 text-left shadow-soft transition-colors hover:border-rose/60",
                message.read ? "border-beige/80" : "border-burgundy/25",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full",
                  message.read ? "bg-ivory text-muted" : "bg-burgundy text-white",
                )}
              >
                {message.read ? <MailOpen className="h-4 w-4" aria-hidden /> : <Mail className="h-4 w-4" aria-hidden />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className={cn("text-[13px] text-ink", message.read ? "font-medium" : "font-semibold")}>
                    {message.name}
                  </span>
                  {!message.read && <StatusBadge status="new" />}
                  <span className="text-[10.5px] text-muted">{parseApiDate(message.createdAt)}</span>
                </span>
                <span className="mt-0.5 block truncate text-[12px] font-medium text-ink/75">{message.subject}</span>
                <span className="mt-0.5 block truncate text-[11.5px] text-muted">{message.message}</span>
              </span>
              <span className="hidden shrink-0 text-[11px] text-muted sm:block">{message.email}</span>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.subject ?? "Message"}
        description={detail ? `${detail.name} · ${parseApiDate(detail.createdAt)}` : undefined}
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
              {detail && (
                <Button
                  variant="secondary"
                  size="sm"
                  loading={busyId === detail.id}
                  onClick={() => setRead(detail, !detail.read)}
                  iconLeft={<CheckCheck className="h-3.5 w-3.5" />}
                >
                  Mark {detail.read ? "unread" : "read"}
                </Button>
              )}
              <a
                href={`mailto:${detail?.email ?? ""}?subject=${encodeURIComponent(`Re: ${detail?.subject ?? ""}`)}`}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-burgundy px-4 text-[13px] font-medium text-white transition-colors hover:bg-burgundy-deep"
              >
                <Reply className="h-3.5 w-3.5" aria-hidden /> Reply by email
              </a>
            </div>
          </div>
        }
      >
        {detail && (
          <div className="space-y-4">
            <dl className="grid gap-3 rounded-2xl border border-beige bg-ivory p-4 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">Name</dt>
                <dd className="mt-0.5 text-[12.5px] font-medium text-ink">{detail.name}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">Email</dt>
                <dd className="mt-0.5 break-all text-[12.5px] font-medium text-ink">{detail.email}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">Telephone</dt>
                <dd className="mt-0.5 text-[12.5px] font-medium text-ink">{detail.phone || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.12em] text-muted">Received</dt>
                <dd className="mt-0.5 text-[12.5px] font-medium text-ink">{parseApiDate(detail.createdAt)}</dd>
              </div>
            </dl>

            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-muted">Message</p>
              <p className="mt-2 whitespace-pre-wrap rounded-xl border border-beige bg-white p-4 text-[13px] leading-relaxed text-ink/80">
                {detail.message}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href={`mailto:${detail.email}`} className="link-arrow text-[12px]">
                <Mail className="h-3.5 w-3.5" aria-hidden /> {detail.email}
              </a>
              {detail.phone && (
                <a href={`tel:${detail.phone.replace(/\s/g, "")}`} className="link-arrow text-[12px]">
                  <Phone className="h-3.5 w-3.5" aria-hidden /> {detail.phone}
                </a>
              )}
            </div>

            <p className="rounded-xl border border-amber-200/70 bg-amber-50/60 px-4 py-3 text-[11px] leading-relaxed text-amber-900/80">
              Demonstration inbox. Real patient enquiries should be handled through a secure, audited practice system.
            </p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete this message?"
        description={`The enquiry from ${deleting?.name ?? "this patient"} will be permanently removed.`}
        confirmLabel="Delete permanently"
        loading={deleteBusy}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
