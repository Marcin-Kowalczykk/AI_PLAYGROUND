import 'dotenv/config'
import { getCityNameFromOpenAi } from './helpers/getCityNameFromOpenAi/getCityNameFromOpenAi'
import { compressImagesFromFrontend } from '../middlewares/compressImages/compressImagesFromFrontend'

export const analyzeImages = async (images: Express.Multer.File[]): Promise<string> => {
  const compressedImages = await compressImagesFromFrontend(images)
  console.log('Compressed images: ', compressedImages)

  const cityName = await getCityNameFromOpenAi(compressedImages)

  return cityName
}
