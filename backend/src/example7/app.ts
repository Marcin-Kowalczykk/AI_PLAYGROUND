import 'dotenv/config'
import { compressImages } from './helpers/compressImages/compressImages'
import { getCityNameFromOpenAi } from './helpers/getCityNameFromOpenAi/getCityNameFromOpenAi'

export const analyzeImages = async (images: Express.Multer.File[]): Promise<string> => {
  const compressedImages = await compressImages(images)
  console.log('Compressed images: ', compressedImages)

  const cityName = await getCityNameFromOpenAi(compressedImages)

  return cityName
}
