import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    statusCode: 429,
    message: 'The request limit is reached.',
})

export default limiter
