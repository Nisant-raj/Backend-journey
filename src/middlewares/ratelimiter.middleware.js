// const rateLimit= require("express-rate-limit") ;

//  const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: 'Too many requests, please try again later'
// });


const TokenBucket = require('../services/tokenBucket.service.js');

const bucket = new TokenBucket(100, 1); // 100 requests, 1 req/sec refill

 const rateLimiter = (req, res, next) => {
  if (!bucket.allowRequest()) {
    return res.status(429).json({
      message: 'Too many requests. Please try again later.'
    });
  }
  next();
};



module.exports =rateLimiter;