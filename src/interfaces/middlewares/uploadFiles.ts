import { Request } from "express"
import { FileFilterCallback } from "multer"

export interface UpLoadFilesOptions {
    filter?: (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => boolean
}
