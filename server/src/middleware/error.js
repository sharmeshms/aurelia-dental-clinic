import { HttpError } from "../utils/http.js";

export function errorHandler(error, _req, res, _next) {
  if (error?.name === "ZodError") {
    const errors = {};
    for (const issue of error.issues) {
      const key = issue.path.join(".") || "form";
      errors[key] ??= [];
      errors[key].push(issue.message);
    }
    res.status(422).json({
      message: error.issues[0]?.message ?? "Please check the highlighted fields.",
      errors,
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({
      message: error.message,
      ...(error.details ? { errors: error.details } : {}),
    });
    return;
  }

  if (error?.code === 11000) {
    res.status(409).json({ message: "That record already exists." });
    return;
  }

  if (error?.message === "Not allowed by CORS") {
    res.status(403).json({ message: "This origin is not permitted." });
    return;
  }

  if (error?.type === "entity.too.large") {
    res.status(413).json({ message: "The request is too large." });
    return;
  }

  console.error("[api] Unhandled error:", error);
  res.status(500).json({
    message: "Something went wrong on our side. Please try again or call the clinic.",
  });
}
