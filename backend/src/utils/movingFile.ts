import { existsSync } from 'fs'
import { rename, mkdir } from 'fs/promises'
import { basename, join } from 'path'

async function movingFile(imagePath: string, from: string, to: string) {
    const fileName = basename(imagePath)
    const imagePathTemp = join(from, fileName)
    const imagePathPermanent = join(to, fileName)
    console.log(`🔍 Проверяем файл: ${imagePathTemp}`)
    if (!existsSync(imagePathTemp)) {
        throw new Error(`Файл не найден: ${imagePathTemp}`)
    }

    try {
        // Создаем конечную директорию, если она не существует
        await mkdir(to, { recursive: true })
        await rename(imagePathTemp, imagePathPermanent)
        console.log(
            `Файл успешно перемещён: ${imagePathTemp} → ${imagePathPermanent}`
        )
    } catch (err) {
        console.error(`Ошибка при перемещении файла: ${err}`)
        throw new Error('Ошибка при сохранении файла')
    }
}

export default movingFile
