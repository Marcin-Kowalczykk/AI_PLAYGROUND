import { IProcessedPhoto } from '../../model'
import { decideIfPhotoNeedsImprovement } from '../decideIfPhotoNeedsImprovement/decideIfPhotoNeedsImprovement'
import { sendAnswerToCentralApi } from '../../../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'

export const processSinglePhoto = async (photo: IProcessedPhoto): Promise<IProcessedPhoto> => {
  console.log('Processing photo:', photo.filename)

  if (photo.isProcessed) {
    console.log('Photo already processed')
    return photo
  }

  const operation = await decideIfPhotoNeedsImprovement(photo.url)
  if (!operation) {
    console.log('No operation needed, marking as processed')
    return { ...photo, isProcessed: true, finalUrl: photo.url }
  }

  console.log('Sending command to API:', `${operation.type} ${photo.filename}`)
  const response = await sendAnswerToCentralApi({
    taskName: 'photos',
    answer: `${operation.type} ${photo.filename}`,
  })

  if (!response) {
    console.error('No response from API for photo:', photo.filename)
    return photo
  }

  console.log('Received API response:', response)

  // Extract the new filename from the response
  const newFilename = response.message?.match(/IMG_\d+_[A-Z0-9]+\.PNG/)?.[0]
  if (!newFilename) {
    console.error('Could not extract new filename from response:', response.message)
    return photo
  }

  console.log('New filename:', newFilename)
  return {
    ...photo,
    isProcessed: true,
    finalUrl: photo.url.replace(photo.filename, newFilename),
  }
}
