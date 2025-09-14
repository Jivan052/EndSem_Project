const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
  points: 1, // 1 request
  duration: 1 // per second
});

const rateLimitMiddleware = (req, res, next) => {
  const key = req.user?.id || req.ip; // Use user ID if authenticated, otherwise IP
  
  rateLimiter.consume(key)
    .then(() => next())
    .catch(() => res.status(429).json({ 
      message: "Too many requests. Please try again later." 
    }));
};

module.exports = rateLimitMiddleware;