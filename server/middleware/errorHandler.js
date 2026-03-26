/* ============================================================
   middleware/errorHandler.js  —  Global Error Handler
   Must be registered LAST in server.js (after all routes).
   Catches any error passed to next(err) and returns a clean
   JSON error response instead of crashing the server.
   ============================================================ */

const errorHandler = (err, req, res, next) => {
  // If the response already has a status code, use it;
  // otherwise default to 500 Internal Server Error
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong on the server.',
    // Only show the stack trace in development — never in production
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = errorHandler;
