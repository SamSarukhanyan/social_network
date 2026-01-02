//middlewares/multerError.middleware.js
import multer from "multer";
import { AppError } from "@utils/appError.js";

export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer specific errors
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new AppError("Image size must be less than 5MB", 400));
    }

    return next(new AppError(err.message, 400));
  }

  next(err);
};
