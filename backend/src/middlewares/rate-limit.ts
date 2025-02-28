import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5000,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: 429,
    message: 'The request limit is reached.',
})

export default limiter
