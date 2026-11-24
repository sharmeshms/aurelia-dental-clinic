import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  count,
  findById,
  insert,
  list,
  remove,
  update,
} from "../db/repo.js";
import { appointmentStatusSchema, messageReadSchema } from "../validation/schemas.js";
import { asyncHandler, HttpError } from "../utils/http.js";
import { todayISO } from "../utils/dates.js";

const router = Router();

router.use(requireAuth);

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CONTENT = {
  services: {
    label: "Treatment",
    idFrom: (body) => body.slug || slugify(body.name),
    required: ["name", "category"],
  },
  doctors: {
    label: "Clinician",
    idFrom: (body) => body.slug || slugify(body.name),
    required: ["name", "specialisation"],
  },
  posts: {
    label: "Article",
    idFrom: (body) => body.slug || slugify(body.title),
    required: ["title", "excerpt"],
  },
  gallery: {
    label: "Gallery item",
    idFrom: (body) => body.id || `g-${Date.now().toString(36)}`,
    required: ["title", "image"],
  },
};

function contentConfig(name) {
  const config = CONTENT[name];
  if (!config) throw new HttpError(404, "Unknown content collection.");
  return config;
}

function byOrder(a, b) {
  return (a.order ?? 0) - (b.order ?? 0);
}

function byNewest(a, b) {
  return new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0);
}

/* ------------------------------------------------------------------ */
/*  Overview                                                           */
/* ------------------------------------------------------------------ */

router.get(
  "/overview",
  asyncHandler(async (_req, res) => {
    const appointments = await list("appointments");
    const messages = await list("messages");
    const today = todayISO();

    const counts = {
      appointments: appointments.length,
      pending: appointments.filter((item) => item.status === "pending").length,
      confirmed: appointments.filter((item) => item.status === "confirmed").length,
      completed: appointments.filter((item) => item.status === "completed").length,
      cancelled: appointments.filter((item) => item.status === "cancelled").length,
      today: appointments.filter((item) => item.date === today && item.status !== "cancelled").length,
      upcoming: appointments.filter(
        (item) => item.date >= today && ["pending", "confirmed"].includes(item.status),
      ).length,
      messages: messages.length,
      unread: messages.filter((item) => !item.read).length,
      newsletter: await count("newsletter"),
      services: await count("services"),
      doctors: await count("doctors"),
      posts: await count("posts"),
      gallery: await count("gallery"),
    };

    res.json({
      data: {
        counts,
        recentAppointments: [...appointments].sort(byNewest).slice(0, 6),
        recentMessages: [...messages].sort(byNewest).slice(0, 5),
      },
    });
  }),
);

/* ------------------------------------------------------------------ */
/*  Appointments                                                       */
/* ------------------------------------------------------------------ */

router.get(
  "/appointments",
  asyncHandler(async (req, res) => {
    const { status, q, date } = req.query;
    let items = await list("appointments");
    if (status && status !== "all") items = items.filter((item) => item.status === status);
    if (date) items = items.filter((item) => item.date === date);
    if (q) {
      const term = String(q).toLowerCase();
      items = items.filter((item) =>
        [item.reference, item.firstName, item.lastName, item.email, item.phone, item.service, item.doctor]
          .join(" ")
          .toLowerCase()
          .includes(term),
      );
    }
    items.sort(byNewest);
    res.json({ data: items, total: items.length });
  }),
);

router.patch(
  "/appointments/:id",
  asyncHandler(async (req, res) => {
    const patch = appointmentStatusSchema.parse(req.body);
    const existing = await findById("appointments", req.params.id);
    if (!existing) throw new HttpError(404, "Appointment not found.");
    const updated = await update("appointments", req.params.id, patch);
    res.json({ data: updated });
  }),
);

router.delete(
  "/appointments/:id",
  asyncHandler(async (req, res) => {
    const removed = await remove("appointments", req.params.id);
    if (!removed) throw new HttpError(404, "Appointment not found.");
    res.json({ message: "Appointment deleted." });
  }),
);

/* ------------------------------------------------------------------ */
/*  Contact messages & newsletter                                      */
/* ------------------------------------------------------------------ */

router.get(
  "/messages",
  asyncHandler(async (_req, res) => {
    const items = (await list("messages")).sort(byNewest);
    res.json({ data: items, total: items.length });
  }),
);

router.patch(
  "/messages/:id",
  asyncHandler(async (req, res) => {
    const { read } = messageReadSchema.parse(req.body);
    const existing = await findById("messages", req.params.id);
    if (!existing) throw new HttpError(404, "Message not found.");
    const updated = await update("messages", req.params.id, { read });
    res.json({ data: updated });
  }),
);

router.delete(
  "/messages/:id",
  asyncHandler(async (req, res) => {
    const removed = await remove("messages", req.params.id);
    if (!removed) throw new HttpError(404, "Message not found.");
    res.json({ message: "Message deleted." });
  }),
);

router.get(
  "/newsletter",
  asyncHandler(async (_req, res) => {
    const items = (await list("newsletter")).sort(byNewest);
    res.json({ data: items, total: items.length });
  }),
);

router.delete(
  "/newsletter/:id",
  asyncHandler(async (req, res) => {
    const removed = await remove("newsletter", req.params.id);
    if (!removed) throw new HttpError(404, "Subscriber not found.");
    res.json({ message: "Subscriber removed." });
  }),
);

/* ------------------------------------------------------------------ */
/*  Content CRUD                                                       */
/* ------------------------------------------------------------------ */

router.get(
  "/:collection(services|doctors|posts|gallery)",
  asyncHandler(async (req, res) => {
    const config = contentConfig(req.params.collection);
    const items = (await list(req.params.collection)).sort(
      req.params.collection === "posts"
        ? (a, b) => new Date(b.date ?? 0) - new Date(a.date ?? 0)
        : byOrder,
    );
    res.json({ data: items, total: items.length, label: config.label });
  }),
);

router.post(
  "/:collection(services|doctors|posts|gallery)",
  asyncHandler(async (req, res) => {
    const { collection } = req.params;
    const config = contentConfig(collection);
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new HttpError(422, "Expected a content object.");
    }
    for (const field of config.required) {
      if (!body[field] || String(body[field]).trim() === "") {
        throw new HttpError(422, `${config.label} requires a ${field}.`);
      }
    }
    const id = config.idFrom(body);
    if (!id) throw new HttpError(422, "A slug or title is required.");
    if (await findById(collection, id)) {
      throw new HttpError(409, `A ${config.label.toLowerCase()} with that identifier already exists.`);
    }
    const existing = await list(collection);
    const created = await insert(collection, {
      ...body,
      id,
      slug: collection === "gallery" ? body.slug : id,
      order: body.order ?? existing.length,
      active: body.active !== false,
      featured: Boolean(body.featured),
    });
    res.status(201).json({ data: created });
  }),
);

router.put(
  "/:collection(services|doctors|posts|gallery)/:id",
  asyncHandler(async (req, res) => {
    const { collection, id } = req.params;
    const config = contentConfig(collection);
    const existing = await findById(collection, id);
    if (!existing) throw new HttpError(404, `${config.label} not found.`);
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new HttpError(422, "Expected a content object.");
    }
    const patch = { ...body };
    // Keep identifiers stable so existing links keep working.
    delete patch.id;
    delete patch._id;
    delete patch.createdAt;
    if (collection !== "gallery") patch.slug = id;
    const updated = await update(collection, id, patch);
    res.json({ data: updated });
  }),
);

router.delete(
  "/:collection(services|doctors|posts|gallery)/:id",
  asyncHandler(async (req, res) => {
    const config = contentConfig(req.params.collection);
    const removed = await remove(req.params.collection, req.params.id);
    if (!removed) throw new HttpError(404, `${config.label} not found.`);
    res.json({ message: `${config.label} deleted.` });
  }),
);

export default router;
