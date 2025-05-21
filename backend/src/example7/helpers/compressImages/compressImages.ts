import sharp from 'sharp'
import { CompressedImage } from './model'

export const compressImages = async (images: Express.Multer.File[]): Promise<CompressedImage[]> => {
  return Promise.all(
    images.map(async (image) => {
      try {
        const compressedBuffer = await sharp(image.buffer)
          .resize(800, 800, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 80,
            progressive: true,
          })
          .toBuffer()

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
