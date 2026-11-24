import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { Router } from "express";
import { authLimiter } from "../middleware/rateLimit.js";
import { requireAuth, clearSessionCookie, setSessionCookie, signToken } from "../middleware/auth.js";
import { findOne } from "../db/repo.js";
import { loginSchema } from "../validation/schemas.js";
import { asyncHandler, HttpError } from "../utils/http.js";

const router = Router();

// Used to keep failed logins roughly constant-time even when the user does not exist.
const DUMMY_HASH = bcrypt.hashSync("aurelia-dummy-password", 12);

router.post(
  "/login",
  authLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    const user = await findOne("users", { email });
    const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !valid) {
      throw new HttpError(401, "Incorrect email or password.");
    }
    const token = signToken(user);
    setSessionCookie(res, token);
    res.json({
      data: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  }),
);

router.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ message: "Signed out." });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ data: req.user });
});

export default router;
