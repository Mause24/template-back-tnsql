import { Request } from "express"
import fs from "fs"
import multer, { FileFilterCallback } from "multer"
import path from "path"
import { UpLoadFilesOptions } from "../interfaces"

const useStorageFiles = async (
    _req: Request,
    file: Express.Multer.File,
    _cb: (error: Error | null, destination: string) => void
) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    let dataDirectory = path.join(__dirname, "../data/others")
    /* const parsedUser = JSON.parse(
        (req.query["jwt"] as string) ?? ""
    ) as JWTInterface

    if (parsedUser) {
        const user = await User.findByPk(parsedUser.id)
        if (user) {
            user.toJSON().avatarImage
        }
    } */

    switch (true) {
        case file.mimetype.startsWith("image/"):
            dataDirectory = path.join(__dirname, "../data/images")
            if (!fs.existsSync(dataDirectory)) {
                fs.mkdirSync(dataDirectory)
            }
            return {
                destination: dataDirectory,
                fileName: uniqueSuffix + path.extname(file.originalname),
            }
        case file.mimetype.startsWith("file/"):
            dataDirectory = path.join(__dirname, "../data/files")
            if (!fs.existsSync(dataDirectory)) {
                fs.mkdirSync(dataDirectory)
            }
            return {
                destination: dataDirectory,
                fileName: uniqueSuffix + path.extname(file.originalname),
            }
        case file.mimetype.startsWith("video/"):
            dataDirectory = path.join(__dirname, "../data/videos")
            if (!fs.existsSync(dataDirectory)) {
                fs.mkdirSync(dataDirectory)
            }
            return {
                destination: dataDirectory,
                fileName: uniqueSuffix + path.extname(file.originalname),
            }
        default:
            if (!fs.existsSync(dataDirectory)) {
                fs.mkdirSync(dataDirectory)
            }
            return {
                destination: dataDirectory,
                fileName: uniqueSuffix + path.extname(file.originalname),
            }
    }
}

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        cb(null, (await useStorageFiles(req, file, cb)).destination)
    },
    filename: async (req, file, cb) => {
        cb(null, (await useStorageFiles(req, file, cb)).fileName)
    },
})

// Filtrar archivos para clasificarlos en imágenes o videos
const fileFilter =
    (filter: UpLoadFilesOptions["filter"]) =>
    (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (
            filter?.(req, file, cb) ||
            file.mimetype.startsWith("image/") ||
            file.mimetype.startsWith("video/")
        ) {
            cb(null, true)
        } else {
            cb(new Error("CANNOT SAVE THE FILE!"))
        }
    }

export const upload = (options?: { filter: () => boolean }) =>
    multer({
        storage: storage,
        fileFilter: fileFilter(options?.filter),
    })
