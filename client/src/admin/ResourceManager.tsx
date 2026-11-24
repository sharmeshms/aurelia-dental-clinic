import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  EyeOff,
  ImageOff,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { api, apiError } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ConfirmDialog, EmptyRow, PageHeader, Panel } from "./components";
import { useDocumentTitle } from "./ProtectedRoute";
import type { FieldConfig, ResourceConfig } from "./resources";

type Item = Record<string, any>;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function toForm(config: ResourceConfig, item?: Item): Item {
  if (!item) return clone(config.defaults);
  const next: Item = {};
  for (const field of config.fields) {
    const raw = item[field.name];
    if (field.type === "lines") next[field.name] = Array.isArray(raw) ? raw.join("\n") : raw ?? "";
    else if (field.type === "json") next[field.name] = JSON.stringify(raw ?? [], null, 2);
    else if (field.type === "boolean") next[field.name] = Boolean(raw);
    else next[field.name] = raw ?? "";
  }
  return next;
}

function fromForm(config: ResourceConfig, form: Item) {
  const payload: Item = {};
  for (const field of config.fields) {
    const raw = form[field.name];
    if (field.type === "lines") {
      payload[field.name] = String(raw ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
    } else if (field.type === "json") {
      payload[field.name] = raw === "" ? [] : JSON.parse(String(raw));
    } else if (field.type === "number") {
      payload[field.name] = raw === "" ? 0 : Number(raw);
    } else if (field.type === "boolean") {
      payload[field.name] = Boolean(raw);
    } else {
      payload[field.name] = String(raw ?? "").trim();
    }
  }
  return payload;
}

export function ResourceManager({ config }: { config: ResourceConfig }) {
  useDocumentTitle(config.plural);

  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [form, setForm] = useState<Item | null>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<{ data: Item[] }>(`/admin/${config.collection}`);
      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.collection]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      Object.values(item)
        .filter((value) => typeof value === "string" || typeof value === "number")
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [items, query]);

  function openCreate() {
    setEditing(null);
    setForm(toForm(config));
    setErrors({});
  }

  function openEdit(item: Item) {
    setEditing(item);
    setForm(toForm(config, item));
    setErrors({});
  }

  function closeForm() {
    if (saving) return;
    setForm(null);
    setEditing(null);
    setErrors({});
  }

  function setValue(name: string, value: unknown) {
    setForm((current) => (current ? { ...current, [name]: value } : current));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function save() {
    if (!form) return;
    const nextErrors: Record<string, string> = {};
    for (const field of config.fields) {
      if (field.required && String(form[field.name] ?? "").trim() === "") {
        nextErrors[field.name] = `${field.label} is required.`;
      }
      if (field.type === "json" && String(form[field.name] ?? "").trim() !== "") {
        try {
          JSON.parse(String(form[field.name]));
        } catch {
          nextErrors[field.name] = "This is not valid JSON. Check the brackets and quotation marks.";
        }
      }
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    let payload: Item;
    try {
      payload = fromForm(config, form);
    } catch {
      setErrors({ sections: "One of the JSON fields could not be read." });
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/${config.collection}/${encodeURIComponent(editing.id)}`, payload);
        toast({ title: `${config.singular} updated`, description: "Changes are live on the public site." });
      } else {
        await api.post(`/admin/${config.collection}`, payload);
        toast({ title: `${config.singular} created`, description: "It is now part of the published content." });
      }
      setForm(null);
      setEditing(null);
      await load();
    } catch (err) {
      toast({ title: "Could not save", description: apiError(err), variant: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: Item) {
    setToggling(item.id);
    try {
      await api.put(`/admin/${config.collection}/${encodeURIComponent(item.id)}`, { active: !item.active });
      setItems((current) =>
        current.map((entry) => (entry.id === item.id ? { ...entry, active: !entry.active } : entry)),
      );
      toast({
        title: !item.active ? "Now visible" : "Hidden from the public site",
        variant: "success",
      });
    } catch (err) {
      toast({ title: "Could not update visibility", description: apiError(err), variant: "error" });
    } finally {
      setToggling(null);
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await api.delete(`/admin/${config.collection}/${encodeURIComponent(deleting.id)}`);
      setItems((current) => current.filter((item) => item.id !== deleting.id));
      toast({ title: `${config.singular} deleted` });
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
        title={config.plural}
        description={config.description}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={load} disabled={loading} iconLeft={<RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />}>
              Refresh
            </Button>
            <Button size="sm" onClick={openCreate} iconLeft={<Plus className="h-4 w-4" />}>
              New {config.singular}
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
              placeholder={`Search ${config.plural.toLowerCase()}…`}
              aria-label={`Search ${config.plural}`}
              className="h-10 w-full rounded-full border border-beige bg-white pl-10 pr-4 text-[12.5px] text-ink placeholder:text-muted/60 focus:border-burgundy/50 focus:outline-none focus:ring-4 focus:ring-burgundy/10"
            />
          </div>
          <p className="text-[11.5px] text-muted">
            <span className="font-semibold text-ink">{visible.length}</span> of {items.length} shown
          </p>
        </div>
      </Panel>

      {error ? (
        <Panel>
          <EmptyRow
            title="Could not load content"
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
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading {config.plural.toLowerCase()}…
        </Panel>
      ) : visible.length === 0 ? (
        <Panel>
          <EmptyRow
            title={query ? "No matches" : `No ${config.plural.toLowerCase()} yet`}
            description={query ? "Try a different search term." : `Create your first ${config.singular}.`}
            action={
              !query && (
                <Button size="sm" onClick={openCreate} iconLeft={<Plus className="h-4 w-4" />}>
                  New {config.singular}
                </Button>
              )
            }
          />
        </Panel>
      ) : (
        <div className="space-y-2">
          {visible.map((item) => {
            const title = String(item[config.titleField] ?? "Untitled");
            const subtitle = config.subtitleField ? String(item[config.subtitleField] ?? "") : "";
            const image = config.imageField ? String(item[config.imageField] ?? "") : "";
            const badge = config.badgeField ? String(item[config.badgeField] ?? "") : "";
            const date = config.dateField ? String(item[config.dateField] ?? "") : "";
            const inactive = item.active === false;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border border-beige/80 bg-white p-3.5 shadow-soft transition-opacity sm:flex-row sm:items-center",
                  inactive && "opacity-65",
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-ivory">
                    {image ? (
                      <img src={image} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-muted">
                        <ImageOff className="h-4 w-4" aria-hidden />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-ink">{title}</p>
                    <p className="truncate text-[11.5px] text-muted">
                      {[subtitle, date].filter(Boolean).join(" · ") || String(item.id ?? "")}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {badge && (
                        <span className="rounded-full bg-ivory px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-muted">
                          {badge}
                        </span>
                      )}
                      {item.featured && (
                        <span className="rounded-full bg-rose/15 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em] text-burgundy">
                          Featured
                        </span>
                      )}
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em]",
                          inactive ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700",
                        )}
                      >
                        {inactive ? "Hidden" : "Published"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => toggleActive(item)}
                    disabled={toggling === item.id}
                    className="grid h-9 w-9 place-items-center rounded-full border border-beige text-muted transition-colors hover:border-rose hover:text-burgundy disabled:opacity-50"
                    title={item.active ? "Hide from public site" : "Publish"}
                    aria-label={item.active ? `Hide ${title}` : `Publish ${title}`}
                  >
                    {toggling === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : item.active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-beige text-muted transition-colors hover:border-rose hover:text-burgundy"
                    aria-label={`Edit ${title}`}
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(item)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-beige text-muted transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Delete ${title}`}
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={Boolean(form)}
        onClose={closeForm}
        title={editing ? `Edit ${config.singular}` : `New ${config.singular}`}
        description={
          editing
            ? "Update the content below. The identifier stays the same so existing links keep working."
            : "New items are published immediately unless you turn off visibility."
        }
        size="lg"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" size="sm" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button size="sm" onClick={save} loading={saving} type="button">
              {editing ? "Save changes" : `Create ${config.singular}`}
            </Button>
          </div>
        }
      >
        {form && (
          <div className="grid gap-4 sm:grid-cols-2">
            {config.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={form[field.name]}
                error={errors[field.name]}
                onChange={(value) => setValue(field.name, value)}
              />
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete this ${config.singular}?`}
        description={`This permanently removes “${
          deleting ? String(deleting[config.titleField] ?? "this item") : ""
        }” from the database. It cannot be undone.`}
        confirmLabel="Delete permanently"
        loading={deleteBusy}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}

function FormField({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldConfig;
  value: any;
  error?: string;
  onChange: (value: unknown) => void;
}) {
  const span = field.span === 2 ? "sm:col-span-2" : "";

  if (field.type === "boolean") {
    return (
      <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border border-beige bg-ivory/50 px-4 py-3", span)}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-beige accent-burgundy"
        />
        <span>
          <span className="text-[13px] font-medium text-ink">{field.label}</span>
          {field.hint && <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">{field.hint}</span>}
        </span>
      </label>
    );
  }

  if (field.type === "image") {
    const src = String(value ?? "");
    return (
      <Field label={field.label} htmlFor={`field-${field.name}`} required={field.required} error={error} hint={field.hint} className={span}>
        <div className="flex gap-3">
          <Input
            id={`field-${field.name}`}
            value={src}
            onChange={(event) => onChange(event.target.value)}
            placeholder={field.placeholder}
            invalid={Boolean(error)}
          />
          <div className="grid h-12 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-beige bg-ivory">
            {src ? (
              <img src={src} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImageOff className="h-4 w-4 text-muted" aria-hidden />
            )}
          </div>
        </div>
      </Field>
    );
  }

  if (field.type === "select") {
    return (
      <Field label={field.label} htmlFor={`field-${field.name}`} required={field.required} error={error} hint={field.hint} className={span}>
        <Select
          id={`field-${field.name}`}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          invalid={Boolean(error)}
        >
          <option value="">Select…</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Field>
    );
  }

  if (field.type === "textarea" || field.type === "lines" || field.type === "json") {
    const rows = field.rows ?? (field.type === "json" ? 8 : 4);
    return (
      <Field label={field.label} htmlFor={`field-${field.name}`} required={field.required} error={error} hint={field.hint} className={span}>
        <Textarea
          id={`field-${field.name}`}
          rows={rows}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          invalid={Boolean(error)}
          spellCheck={field.type !== "json"}
          className={cn(field.type === "json" && "font-mono text-[11.5px] leading-relaxed")}
        />
      </Field>
    );
  }

  return (
    <Field label={field.label} htmlFor={`field-${field.name}`} required={field.required} error={error} hint={field.hint} className={span}>
      <Input
        id={`field-${field.name}`}
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        value={String(value ?? "")}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        invalid={Boolean(error)}
      />
    </Field>
  );
}
