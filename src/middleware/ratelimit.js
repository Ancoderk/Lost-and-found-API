const rateLimit = require('express-rate-limit');


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true, /* Return rate limit info in headers*/
  legacyHeaders: false, /* Disable X-RateLimit headers*/
});

module.exports = { loginLimiter };
