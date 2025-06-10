import { sendAnswerToCentralApi } from '../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'
import { createDescription } from './helpers/createDescription/createDescription'
import { processSinglePhoto } from './helpers/processSinglePhoto/processSinglePhoto'
import { IProcessedPhoto } from './model'

const processPhotos = async () => {
  console.log('Starting photo analysis process')

  try {
    console.log('Sending START to API...')
    const startResponse = await sendAnswerToCentralApi({
      taskName: 'photos',
      answer: 'START',
    })

    if (!startResponse) {
      throw new Error('Failed to start the process')
    }

    console.log('Received API response:', startResponse)

    // Extract base URL and image filenames
    const baseUrlMatch = startResponse.message?.match(/https:\/\/[^\s]+barbara\//)
    const filenamesMatch = startResponse.message?.match(/IMG_\d+\.PNG/g)

    if (!baseUrlMatch || !filenamesMatch) {
      console.log('Could not extract URLs or filenames')
      return
    }

    const baseUrl = baseUrlMatch[0]
    const filenames = filenamesMatch

    console.log('Found base URL:', baseUrl)
    console.log('Found filenames:', filenames)

    // Create full URLs for each photo
    const photoUrls = filenames.map((filename) => `${baseUrl}${filename}`)
    console.log('Created full photo URLs:', photoUrls)

    const photos: IProcessedPhoto[] = photoUrls.map((url) => ({
      url: url,
      filename: url.split('/').pop() || '',
      isProcessed: false,
    }))

    console.log('List of photos to process:', photos.map((p) => p.filename).join(', '))

    // Process each photo
    console.log('Starting photo processing...')
    const processedPhotos = await Promise.all(photos.map(processSinglePhoto))
    console.log('Completed processing all photos')

    // Create final description
    console.log('Creating final description...')
    const description = await createDescription(processedPhotos)
    console.log('Final description:', description)

    // Send final answer
    console.log('Sending final description to API...')
    const finalResponse = await sendAnswerToCentralApi({
      taskName: 'photos',
      answer: description,
    })

    console.log('Received final response:', finalResponse)
    console.log('Process completed successfully!')
  } catch (error) {
    console.error('Process error:', error)
  }
}

processPhotos()
