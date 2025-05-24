import path from 'path'
import fs from 'fs'
import { compressBuffer } from './compressBuffer'
import { ICompressedImage } from './model'

export const compressImagesFromPaths = async (
  imagePaths: string[],
  inputDir: string,
): Promise<ICompressedImage[]> => {
  return Promise.all(
    imagePaths.map(async (filename) => {
      const filePath = path.join(inputDir, filename)
      try {
        const compressedBuffer = await compressBuffer(filePath)

        return {
          buffer: compressedBuffer,
          originalName: filename,
        }
      } catch (error) {
        console.error(`Error compressing image ${filename}:`, error)

        return {
          buffer: fs.readFileSync(filePath),
          originalName: filename,
        }
      }
    }),
  )
}
