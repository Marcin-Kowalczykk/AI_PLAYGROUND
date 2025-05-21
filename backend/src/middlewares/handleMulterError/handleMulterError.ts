import multer from 'multer'
import { Request, Response } from 'express'
import { multerUploadConfig } from '../multer/multerUploadConfig'

export const handleMulterError = (
  req: Request,
  res: Response,
  next: (err?: Error) => void,
  limit = 4,
) => {
  multerUploadConfig.array('images', limit)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: `Too many files. Maximum ${limit} images allowed.` })
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum file size is 5MB.' })
      }
      return res.status(400).json({ error: 'Error uploading files.' })
    }
    next()
  })
}
