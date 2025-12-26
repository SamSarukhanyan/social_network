export const errorMiddleware = (err, req, res, next) => {
  // defaults
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      ok: false,
      message: err.message,
    });
  }

  // Unexpected / programming error
  console.error("UNEXPECTED ERROR:", err);

  return res.status(500).json({
    ok: false,
    message: "Internal Server Error",
  });
};
