import crypto from "node:crypto";
import { Router } from "express";
import { formLimiter } from "../middleware/rateLimit.js";
import { findOne, insert, list } from "../db/repo.js";
import {
  appointmentSchema,
  availabilityQuerySchema,
  contactSchema,
  newsletterSchema,
} from "../validation/schemas.js";
import { asyncHandler, HttpError } from "../utils/http.js";
import { isValidTime, isPastDate } from "../utils/dates.js";

const router = Router();

export const SLOTS = [
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

function reference() {
  const date = new Date();
  const stamp = [
    String(date.getFullYear()).slice(2),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const code = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 4);
  return `AUR-${stamp}-${code}`;
}

function publicAppointment(doc) {
  return {
    reference: doc.reference,
    status: doc.status,
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: doc.email,
    phone: doc.phone,
    service: doc.service,
    doctor: doc.doctor ?? "",
    date: doc.date,
    time: doc.time,
    message: doc.message ?? "",
    createdAt: doc.createdAt,
  };
}

router.get(
  "/availability",
  asyncHandler(async (req, res) => {
    const { date, doctor } = availabilityQuerySchema.parse(req.query);
    if (isPastDate(date)) throw new HttpError(422, "Please choose today or a future date.");

    const appointments = await list("appointments", { date });
    const active = appointments.filter((item) => item.status !== "cancelled");
    const takenAll = new Set(active.map((item) => item.time));
    const takenDoctor = new Set(
      doctor ? active.filter((item) => item.doctor === doctor).map((item) => item.time) : [],
    );

    res.json({
      data: {
        date,
        doctor: doctor ?? "",
        slots: SLOTS.map((time) => {
          const blockedByClinic = takenAll.has(time);
          const blockedByDoctor = takenDoctor.has(time);
          return {
            time,
            available: !blockedByClinic && !blockedByDoctor,
            reason: blockedByClinic ? "requested" : blockedByDoctor ? "clinician" : null,
          };
        }),
      },
    });
  }),
);

router.post(
  "/appointments",
  formLimiter,
  asyncHandler(async (req, res) => {
    const body = appointmentSchema.parse(req.body);

    if (body.website) {
      // Honeypot: respond as if successful without persisting anything.
      res.status(201).json({ data: { reference: reference(), status: "pending" } });
      return;
    }

    if (isPastDate(body.date) || !isValidTime(body.time)) {
      throw new HttpError(422, "Please choose a valid future date and time.");
    }

    const clash = await findOne("appointments", {
      date: body.date,
      time: body.time,
      status: "confirmed",
    });
    if (clash) {
      throw new HttpError(409, "That time has just been confirmed for another patient. Please choose another slot.");
    }

    const doc = await insert("appointments", {
      id: crypto.randomUUID(),
      reference: reference(),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      service: body.service,
      doctor: body.doctor ?? "",
      date: body.date,
      time: body.time,
      message: body.message ?? "",
      consent: true,
      status: "pending",
      source: "website",
      adminNote: "",
    });

    res.status(201).json({
      data: publicAppointment(doc),
      message: "Your request has been received. Our team will contact you to confirm the time.",
    });
  }),
);

router.post(
  "/contact",
  formLimiter,
  asyncHandler(async (req, res) => {
    const body = contactSchema.parse(req.body);
    if (body.website) {
      res.status(201).json({ message: "Thank you — your message has been received." });
      return;
    }
    await insert("messages", {
      id: crypto.randomUUID(),
      name: body.name,
      email: body.email,
      phone: body.phone ?? "",
      subject: body.subject,
      message: body.message,
      read: false,
      status: "new",
    });
    res.status(201).json({
      message: "Thank you — your message has been received. We aim to reply within one working day.",
    });
  }),
);

router.post(
  "/newsletter",
  formLimiter,
  asyncHandler(async (req, res) => {
    const { email } = newsletterSchema.parse(req.body);
    const existing = await findOne("newsletter", { email });
    if (existing) {
      res.json({ message: "You are already on the list. Thank you." });
      return;
    }
    await insert("newsletter", {
      id: crypto.randomUUID(),
      email,
      source: "website",
      subscribedAt: new Date().toISOString(),
    });
    res.status(201).json({ message: "You are on the list." });
  }),
);

export default router;
