import { Router } from "express";
import { list, findOne } from "../db/repo.js";
import { asyncHandler, HttpError } from "../utils/http.js";

const router = Router();

const byOrder = (a, b) => (a.order ?? 0) - (b.order ?? 0);
const activeOnly = (items) => items.filter((item) => item.active !== false);

router.get(
  "/services",
  asyncHandler(async (_req, res) => {
    const items = activeOnly(await list("services")).sort(byOrder);
    res.json({ data: items, total: items.length });
  }),
);

router.get(
  "/services/:slug",
  asyncHandler(async (req, res) => {
    const item = await findOne("services", { id: req.params.slug });
    if (!item || item.active === false) throw new HttpError(404, "Treatment not found.");
    res.json({ data: item });
  }),
);

router.get(
  "/doctors",
  asyncHandler(async (_req, res) => {
    const items = activeOnly(await list("doctors")).sort(byOrder);
    res.json({ data: items, total: items.length });
  }),
);

router.get(
  "/doctors/:slug",
  asyncHandler(async (req, res) => {
    const item = await findOne("doctors", { id: req.params.slug });
    if (!item || item.active === false) throw new HttpError(404, "Clinician not found.");
    res.json({ data: item });
  }),
);

router.get(
  "/posts",
  asyncHandler(async (_req, res) => {
    const items = activeOnly(await list("posts")).sort(
      (a, b) => new Date(b.date ?? 0) - new Date(a.date ?? 0),
    );
    res.json({ data: items, total: items.length });
  }),
);

router.get(
  "/posts/:slug",
  asyncHandler(async (req, res) => {
    const item = await findOne("posts", { id: req.params.slug });
    if (!item || item.active === false) throw new HttpError(404, "Article not found.");
    res.json({ data: item });
  }),
);

router.get(
  "/gallery",
  asyncHandler(async (_req, res) => {
    const items = activeOnly(await list("gallery")).sort(byOrder);
    res.json({ data: items, total: items.length });
  }),
);

export default router;
