import { Request, NextFunction, Response, Express } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { join, extname } from 'path'
import { promises as fs } from 'fs'
import { randomUUID } from 'crypto'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const fileSizeLimits = {
    minFileSize: 2048, // 2 KB
    maxFileSize: 10485760, // 10 MB
}

const storage = multer.diskStorage({
    destination: async (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        try {
            const destinationPath = join(
                __dirname,
                process.env.UPLOAD_PATH_TEMP
                    ? `../public/${process.env.UPLOAD_PATH_TEMP}`
                    : '../public'
            )

            console.log('Destination Path:', destinationPath)

            try {
                await fs.access(destinationPath)
            } catch {
                await fs.mkdir(destinationPath, { recursive: true })
                console.log(`Directory created: ${destinationPath}`)
            }

            cb(null, destinationPath)
        } catch (err) {
            cb(err as Error, '')
        }
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        const uniqueName = randomUUID()
        const fileExtension = extname(file.originalname)
        cb(null, `${uniqueName}${fileExtension}`)
    },
})

const allowedMimeTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/gif',
    'image/svg+xml',
]

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    console.log('File type:', file.mimetype)

    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, false)
    }

    return cb(null, true)
}
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: fileSizeLimits.maxFileSize,
    },
}).single('file')

export const uploadMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message })
        }
        if (err) {
            return res.status(400).json({ message: err.message })
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Файл не загружен' })
        }

        if (req.file.size < fileSizeLimits.minFileSize) {
            return res
                .status(400)
                .json({ message: 'Файл слишком маленький (менее 2 KB)' })
        }

        next()
    })
}
