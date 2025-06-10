import { askOpenAI } from '../../../middlewares/askOpenAI/askOpenAi'
import { IPhotoOperation } from '../../model'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import {
  DECIDE_IF_PHOTO_NEEDS_IMPROVEMENT_SYSTEM_PROMPT,
  DECIDE_IF_PHOTO_NEEDS_IMPROVEMENT_USER_PROMPT,
} from './constants'

export const decideIfPhotoNeedsImprovement = async (
  imageUrl: string,
): Promise<IPhotoOperation | null> => {
  console.log('Analyzing photo:', imageUrl)

  const filename = imageUrl.split('/').pop() || ''
  const text = DECIDE_IF_PHOTO_NEEDS_IMPROVEMENT_USER_PROMPT.replace('{filename}', filename)

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text,
        },
        { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
      ],
    },
  ]

  try {
    console.log('Sending request to OpenAI for photo analysis...')
    const response = await askOpenAI({
      systemPrompt: DECIDE_IF_PHOTO_NEEDS_IMPROVEMENT_SYSTEM_PROMPT,
      messages,
    })

    const suggestion = response.answer
    console.log('Received suggestion:', suggestion)

    if (!suggestion || suggestion.toLowerCase() === 'null') {
      console.log('Photo does not require improvement')
      return null
    }

    const [operation] = suggestion.split(' ')
    if (!['REPAIR', 'DARKEN', 'BRIGHTEN'].includes(operation)) {
      console.log('Unknown operation:', operation)
      return null
    }

    console.log('Selected operation:', operation, 'for file:', filename)
    return { type: operation as IPhotoOperation['type'], filename }
  } catch (error) {
    console.error('Error during photo analysis:', error)
    return null
  }
}
