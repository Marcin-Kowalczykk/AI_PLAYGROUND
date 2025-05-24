import { compressBuffer } from './compressBuffer'
import { ICompressedImage } from './model'

export const compressImagesFromFrontend = async (
  images: Express.Multer.File[],
): Promise<ICompressedImage[]> => {
  return Promise.all(
    images.map(async (image) => {
      try {
        const compressedBuffer = await compressBuffer(image)

        return {
          buffer: compressedBuffer,
          originalName: image.originalname,
        }
      } catch (error) {
        console.error(`Error compressing image ${image.originalname}:`, error)
        return {
          buffer: image.buffer,
          originalName: image.originalname,
        }
      }
    }),
  )
}
