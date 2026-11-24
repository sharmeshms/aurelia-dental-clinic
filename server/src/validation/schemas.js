import { z } from "zod";
import { isValidTime, isPastDate } from "../utils/dates.js";

const trimmed = (min, max, label) =>
  z
    .string({ required_error: `${label} is required.` })
    .trim()
    .min(min, `${label} must be at least ${min} characters.`)
    .max(max, `${label} must be under ${max} characters.`);

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

export const appointmentSchema = z.object({
  firstName: trimmed(2, 60, "First name"),
  lastName: trimmed(2, 60, "Last name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a contactable phone number.")
    .max(24, "Phone number is too long.")
    .regex(/^[+()\d\s-]+$/, "Phone number contains invalid characters."),
  service: trimmed(2, 120, "Treatment"),
  doctor: z.string().trim().max(120).optional().or(z.literal("")),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a preferred date.")
    .refine((value) => !isPastDate(value), "Please choose today or a future date."),
  time: z
    .string()
    .refine((value) => isValidTime(value), "Choose a preferred time."),
  message: z.string().trim().max(1200, "Please keep notes under 1200 characters.").optional().default(""),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm you understand this is a request, not a confirmed booking." }),
  }),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const contactSchema = z.object({
  name: trimmed(2, 80, "Name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: z.string().trim().max(24, "Phone number is too long.").optional().default(""),
  subject: trimmed(2, 120, "Subject"),
  message: trimmed(10, 2000, "Message"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm we may contact you about this enquiry." }),
  }),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const appointmentStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
  adminNote: z.string().max(1000).optional(),
});

export const messageReadSchema = z.object({
  read: z.boolean(),
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  doctor: z.string().max(120).optional(),
});

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
