import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import mongoose from 'mongoose'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import path from 'path'
import helmet from 'helmet'
import { DB_ADDRESS } from './config'
import errorHandler from './middlewares/error-handler'
import serveStatic from './middlewares/serverStatic'
import limiter from './middlewares/rate-limit'
import routes from './routes'

const { PORT = 3000 } = process.env
const app = express()

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"], // Отключает inline-скрипты
                objectSrc: ["'none'"],
                imgSrc: ["'self'", 'data:'],
                upgradeInsecureRequests: [],
            },
        },
    })
)

app.use(cookieParser())

app.use(limiter)

app.use(
    cors({
        origin: ['http://localhost', 'http://localhost:5173'], // Разрешаем оба домена
        credentials: true,
    })
)
app.use(serveStatic(path.join(__dirname, 'public')))
app.use(urlencoded({ extended: true }))
app.use(json())
app.options('*', cors())
app.use(ExpressMongoSanitize())
app.use(routes)
app.use(errors())
app.use(errorHandler)

const bootstrap = async () => {
    try {
        await mongoose.connect(DB_ADDRESS)
        await app.listen(PORT, () => console.log('ok'))
    } catch (error) {
        console.error(error)
    }
}

bootstrap()
