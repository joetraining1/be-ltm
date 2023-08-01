const { IRateLimiterOptions, RateLimiterMemory } = require('rate-limiter-flexible');

const MAX_REQUEST_LIMIT = 250;
const MAX_REQUEST_WINDOW = 2 * 60; // Per minutes by IP
const TOO_MANY_REQUESTS_MESSAGE = "The server got flooded by your request!";

const rateLimiter = new RateLimiterMemory({
    duration: MAX_REQUEST_WINDOW,
    points: MAX_REQUEST_LIMIT
});

exports.rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then((rateRes) => {
      res.setHeader("Retry-After", rateRes.msBeforeNext / 1000);
      res.setHeader("X-RateLimit-Limit", MAX_REQUEST_LIMIT);
      res.setHeader("X-RateLimit-Remaining", rateRes.remainingPoints);
      res.setHeader(
        "X-RateLimit-Reset",
        new Date(Date.now() + rateRes.msBeforeNext).toISOString()
      );
      next();
    })
    .catch(() => {
      res.status(429).json({ message: TOO_MANY_REQUESTS_MESSAGE });
    });
};
