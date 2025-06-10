import { askOpenAI } from '../../../middlewares/askOpenAI/askOpenAi'
import { IProcessedPhoto } from '../../model'
import { ImageContent } from '../../../middlewares/askOpenAI/model'
import { CREATE_DESCRIPTION_SYSTEM_PROMPT, CREATE_DESCRIPTION_USER_PROMPT } from './constants'

export const createDescription = async (photos: IProcessedPhoto[]): Promise<string> => {
  console.log(
    'Creating Barbara description based on photos:',
    photos.map((p) => p.filename).join(', '),
  )

  try {
    const content: (ImageContent | { type: 'text'; text: string })[] = [
      {
        type: 'text',
        text: CREATE_DESCRIPTION_USER_PROMPT,
      },
    ]

    photos.forEach((photo) => {
      content.push({
        type: 'image_url',
        image_url: { url: photo.finalUrl || photo.url, detail: 'high' },
      })
    })

    console.log('Sending request to OpenAI for description creation...')
    const response = await askOpenAI({
      systemPrompt: CREATE_DESCRIPTION_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content,
        },
      ],
    })

    console.log('Received description from OpenAI')
    return response.answer || 'Failed to create description.'
  } catch (error) {
    console.error('Error during description creation:', error)
    return 'An error occurred while creating the description.'
  }
}
