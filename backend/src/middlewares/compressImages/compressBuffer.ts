import sharp from 'sharp'

export const compressBuffer = async (image: Express.Multer.File | string): Promise<Buffer> => {
  const input = typeof image === 'string' ? image : image.buffer
  return await sharp(input)
    .resize(800, 800, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 80,
      progressive: true,
    })
    .toBuffer()
}
