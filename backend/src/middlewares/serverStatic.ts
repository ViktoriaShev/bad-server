import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'

const forbiddenExtensions = ['.html', '.js', '.php']

export default function serveStatic(baseDir: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const filePath = path.join(baseDir, req.path)
        const ext = path.extname(filePath).toLowerCase()

        if (forbiddenExtensions.includes(ext)) {
            return res.status(403).send('Access denied')
        }

        const mimeType = mime.lookup(filePath)
        if (
            mimeType &&
            (mimeType.includes('text/html') ||
                mimeType.includes('application/javascript'))
        ) {
            return res.status(403).send('Access denied')
        }

        if (!fs.existsSync(filePath)) return next()

        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')

        return res.sendFile(filePath, (err) => {
            if (err) {
                next(err)
            }
        })
    }
}
