import { useEffect, useMemo, useState } from "react";
import { Copy, Download, Mail, RefreshCw, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { api, apiError } from "@/lib/api";
import { cn, parseApiDate } from "@/lib/utils";
import { ConfirmDialog, EmptyRow, PageHeader, Panel, exportCsv } from "./components";
import { useDebounced, useDocumentTitle } from "./ProtectedRoute";

type Subscriber = {
  id: string;
  email: string;
  source?: string;
  subscribedAt: string;
  createdAt?: string;
};

export default function Newsletter() {
  useDocumentTitle("Newsletter");

  const { toast } = useToast();
  const [items, setItems] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query, 200);
  const [deleting, setDeleting] = useState<Subscriber | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<{ data: Subscriber[] }>("/admin/newsletter");
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

  const visible = useMemo(() => {
    const term = debounced.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.email.toLowerCase().includes(term));
  }, [items, debounced]);

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api.delete(`/admin/newsletter/${deleting.id}`);
      setItems((current) => current.filter((item) => item.id !== deleting.id));
      toast({ title: "Subscriber removed" });
      setDeleting(null);
    } catch (err) {
      toast({ title: "Could not remove subscriber", description: apiError(err), variant: "error" });
    } finally {
      setDeleteBusy(false);
    }
  }

  async function copyEmails() {
    try {
      await navigator.clipboard.writeText(visible.map((item) => item.email).join(", "));
      toast({ title: "Email addresses copied", description: `${visible.length} addresses on the clipboard.` });
    } catch {
      toast({ title: "Could not copy", variant: "error" });
    }
  }

  return (
    <>
      <PageHeader
        title="Newsletter"
        description="Email addresses collected through the journal sign-up form. This demonstration does not send campaigns — export the list into your mailing platform."
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
              onClick={copyEmails}
              disabled={!visible.length}
              iconLeft={<Copy className="h-3.5 w-3.5" />}
            >
              Copy emails
            </Button>
            <Button
              size="sm"
              onClick={() => {
                exportCsv(
                  "aurelia-newsletter.csv",
                  visible.map((item) => ({
                    email: item.email,
                    source: item.source ?? "website",
                    subscribed_at: item.subscribedAt,
                  })),
                );
                toast({ title: "CSV exported" });
              }}
              disabled={!visible.length}
              iconLeft={<Download className="h-3.5 w-3.5" />}
            >
              Export CSV
            </Button>
          </>
        }
      />

      <Panel className="mb-4 p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by email…"
              aria-label="Search subscribers"
              className="h-10 w-full rounded-full border border-beige bg-white pl-10 pr-4 text-[12.5px] text-ink placeholder:text-muted focus:border-burgundy/50 focus:outline-none focus:ring-4 focus:ring-burgundy/10"
            />
          </div>
          <p className="text-[11.5px] text-muted">
            <span className="font-semibold text-ink">{visible.length}</span> of {items.length} subscribers
          </p>
        </div>
      </Panel>

      {error ? (
        <Panel>
          <EmptyRow
            title="Could not load subscribers"
            description={error}
            action={
              <Button size="sm" variant="secondary" onClick={load}>
                Try again
              </Button>
            }
          />
        </Panel>
      ) : loading ? (
        <Panel className="py-20 text-center text-[12.5px] text-muted">Loading subscribers…</Panel>
      ) : visible.length === 0 ? (
        <Panel>
          <EmptyRow
            title={items.length ? "No subscribers match that search" : "No subscribers yet"}
            description={
              items.length
                ? "Try a different email address or clear the search."
                : "Sign-ups from the journal newsletter form will appear here."
            }
          />
        </Panel>
      ) : (
        <Panel className="overflow-hidden">
          <div className="hidden grid-cols-[1fr_140px_120px] gap-3 border-b border-beige/80 bg-ivory/60 px-5 py-2.5 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted sm:grid">
            <span>Email address</span>
            <span>Subscribed</span>
            <span className="text-right">Actions</span>
          </div>
          <ul className="divide-y divide-beige/70">
            {visible.map((subscriber) => (
              <li
                key={subscriber.id}
                className="flex flex-col gap-2 px-5 py-3.5 sm:grid sm:grid-cols-[1fr_140px_120px] sm:items-center sm:gap-3"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ivory text-burgundy">
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-medium text-ink">{subscriber.email}</p>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-muted">{subscriber.source ?? "website"}</p>
                  </div>
                </div>
                <p className="text-[11px] text-muted sm:text-[11.5px]">
                  {parseApiDate(subscriber.subscribedAt ?? subscriber.createdAt)}
                </p>
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <a
                    href={`mailto:${subscriber.email}`}
                    className="grid h-8 w-8 place-items-center rounded-full border border-beige text-muted transition-colors hover:border-rose hover:text-burgundy"
                    aria-label={`Email ${subscriber.email}`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setDeleting(subscriber)}
                    className="grid h-8 w-8 place-items-center rounded-full border border-beige text-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${subscriber.email}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <p className="mt-4 px-1 text-[10.5px] leading-relaxed text-muted">
        Consent and unsubscribe handling is the practice's responsibility. Remove subscribers promptly when asked and
        keep evidence of consent in your mailing platform.
      </p>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Remove this subscriber?"
        description={`${deleting?.email ?? "This address"} will be deleted from the newsletter list.`}
        confirmLabel="Remove"
        loading={deleteBusy}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
