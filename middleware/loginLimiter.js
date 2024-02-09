const rateLimit = require("express-rate-limit");
const { logger } = require("./logger");

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // Limit each IP to 5 login attempts per 'window' per minute
  message: {
    message: "Too mamny login attempts, place try again in 1 minute",
  },
  hanlder: (req, res, next, opts) => {
    logger(
      `Too many login attempts: ${opts.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      'errLog.log'
    );
    res.status(opts.statusCode).send(opts.message);
  },
  standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
  legacyHeaders: false, // Disable the 'X-RateLimit-*' headers
});

module.exports = loginLimiter;
