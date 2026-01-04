// multer.js
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { AppError } from "@utils/appError.js";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/posts");
  },

  filename(req, file, cb) {
    const unique = crypto.randomBytes(6).toString("hex");
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^\w\-]/g, "_");

    cb(null, `${unique}-${base}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png|gif/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);

  if (!ext || !mime) {
    return cb(new AppError("Only image files are allowed", 400));
  }

  cb(null, true);
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).array("photos", 10);
