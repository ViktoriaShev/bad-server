import path from 'path'
import { randomUUID } from 'crypto'
import { NextFunction, Request, Response } from 'express'
import { constants } from 'http2'
import BadRequestError from '../errors/bad-request-error'

const MIN_FILE_SIZE = 2 * 1024

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.file) {
        return next(new BadRequestError('Файл не загружен'))
    }

    if (req.file.size < MIN_FILE_SIZE) {
        return next(new BadRequestError('Файл слишком маленький (менее 2KB)'))
    }

    try {
        const ext = path.extname(req.file.originalname) // Получаем расширение файла
        const uniqueName = `${randomUUID()}${ext}` // Генерируем уникальное имя

        const fileName = process.env.UPLOAD_PATH
            ? `${process.env.UPLOAD_PATH}/${uniqueName}`
            : `/${uniqueName}`

        return res.status(constants.HTTP_STATUS_CREATED).send({
            fileName,
            originalName: req.file.originalname, // Оригинальное имя можно оставить для справки
        })
    } catch (error) {
        return next(error)
    }
}
