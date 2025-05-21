import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { askOpenAI } from '../../../middlewares/askOpenAI/askOpenAi'
import { CompressedImage } from '../compressImages/model'
import { GET_CITY_NAME_SYSTEM_PROMPT, GET_CITY_NAME_USER_PROMPT } from './constants'
import { ImageContent } from '../../../middlewares/askOpenAI/model'

export const getCityNameFromOpenAi = async (images: Express.Multer.File[] | CompressedImage[]) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: GET_CITY_NAME_SYSTEM_PROMPT,
    },
    {
      role: 'user',
      content: [
        ...(images.map((image) => ({
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${image.buffer.toString('base64')}`,
            detail: 'high',
          },
        })) as ImageContent[]),
        {
          type: 'text',
          text: GET_CITY_NAME_USER_PROMPT,
        },
      ],
    },
  ]

  const getCityFromOpenAiResponse = await askOpenAI(GET_CITY_NAME_SYSTEM_PROMPT, messages, 'gpt-4o')

  if (!getCityFromOpenAiResponse.answer) {
    console.error('No city name returned from OpenAI')
  }

  console.log('Example 7 - City name: ', getCityFromOpenAiResponse.answer)

  return getCityFromOpenAiResponse.answer
}
