import { Request } from "express"
import fs from "fs"
import multer, { FileFilterCallback } from "multer"
import path from "path"
import { JWTInterface, UpLoadFilesOptions } from "../interfaces"
import User from "../models/User"

const useStorageFiles = async (
    req: Request,
    file: Express.Multer.File,
    _cb: (error: Error | null, destination: string) => void
) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const basePath = path.join(__dirname, "../data/")
    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath)
    }
    let dataDirectory = path.join(basePath, "others")

    switch (true) {
        case file.mimetype.startsWith("image/"): {
            dataDirectory = path.join(basePath, "images")
            if (!fs.existsSync(dataDirectory)) fs.mkdirSync(dataDirectory)
            const parsedUser = JSON.parse(
                (req.query["jwt"] as string) ?? ""
            ) as JWTInterface

            if (parsedUser) {
                const user = await User.findByPk(parsedUser.id)
                if (user && typeof user.toJSON().avatarImage === "string") {
                    const imageTitle = String(
                        user.toJSON().avatarImage.split("/").pop()
                    )
                    if (fs.existsSync(path.join(dataDirectory, imageTitle))) {
                        fs.unlink(path.join(dataDirectory, imageTitle), err => {
                            if (err) {
                                throw new Error(
                                    "Failing on delete the old avatar"
                                )
                            }
                        })
                    }
                }
            }
            return {
                destination: dataDirectory,
                fileName: uniqueSuffix + path.extname(file.originalname),
            }
        }
        case file.mimetype.startsWith("file/"):
            dataDirectory = path.join(basePath, "files")
            if (!fs.existsSync(dataDirectory)) {
                fs.mkdirSync(dataDirectory)
            }
            return {
                destination: dataDirectory,
                fileName: uniqueSuffix + path.extname(file.originalname),
            }
        case file.mimetype.startsWith("video/"):
            dataDirectory = path.join(basePath, "videos")
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
    destination: async (req, file, cb): Promise<void> => {
        cb(null, (await useStorageFiles(req, file, cb)).destination)
    },
    filename: async (req, file, cb): Promise<void> => {
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
