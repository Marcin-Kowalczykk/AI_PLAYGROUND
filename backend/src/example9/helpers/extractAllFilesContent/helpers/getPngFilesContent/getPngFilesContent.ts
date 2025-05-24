import { askOpenAI } from '../../../../../middlewares/askOpenAI/askOpenAi'
import { compressImagesFromPaths } from '../../../../../middlewares/compressImages/compressImagesFromPaths'
import { IExtractedTextContentWithFilename } from '../../../../model'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { GET_PNG_FILES_CONTENT_SYSTEM_PROMPT, GET_PNG_FILES_CONTENT_USER_PROMPT } from './constants'

export const getPngFilesContent = async (
  files: string[],
  inputDir: string,
): Promise<IExtractedTextContentWithFilename[]> => {
  const compressedImages = await compressImagesFromPaths(files, inputDir)
  const results = []
  for (const { originalName, buffer } of compressedImages) {
    const base64Image = buffer.toString('base64')
    const imageUrl = `data:image/png;base64,${base64Image}`
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: GET_PNG_FILES_CONTENT_USER_PROMPT,
          },
          { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
        ],
      },
    ] as ChatCompletionMessageParam[]

    const response = await askOpenAI({
      model: 'gpt-4o',
      messages,
      systemPrompt: GET_PNG_FILES_CONTENT_SYSTEM_PROMPT,
    })
    results.push({ filename: originalName, content: response.answer })
  }

  return results
}
