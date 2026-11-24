import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http.js";

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role ?? "admin" },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );
}

export function setSessionCookie(res, token) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProd,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProd,
    path: "/",
  });
}

function readToken(req) {
  const cookieToken = req.cookies?.[env.cookieName];
  if (cookieToken) return cookieToken;
  const header = req.headers.authorization ?? "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  return null;
}

export function requireAuth(req, _res, next) {
  const token = readToken(req);
  if (!token) return next(new HttpError(401, "Please sign in to continue."));
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role ?? "admin",
    };
    return next();
  } catch {
    return next(new HttpError(401, "Your session has expired. Please sign in again."));
  }
}
