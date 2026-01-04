import multer from "multer";
import { AppError } from "@utils/appError.js";

export const multerErrorHandler = (err, req, res, next) => {
  if (!err) return next();
  // Multer errors
  if (err instanceof multer.MulterError) {
    // Log for debugging / monitoring
    console.error("Multer error:", err);

    // Customize message for client
    let message = err.message;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File too large (max 5MB)";
    }

    return next(new AppError(message, 400));
  }

  // Already our AppError
  if (err instanceof AppError) {
    return next(err);
  }

  // Any other unknown error → forward to global error handler
  next(err);
};
