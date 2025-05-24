import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { askOpenAI } from '../../../middlewares/askOpenAI/askOpenAi'
import { IExtractedTextContentWithFilename } from '../../model'
import { CATEGORIZE_FILES_CONTENT_SYSTEM_PROMPT } from './generatecategorizeFilesContentSystemPrompt'
import { ICategorizeFilesContentResponse } from './model'

export const categorizeFilesContent = async (
  files: IExtractedTextContentWithFilename[],
): Promise<ICategorizeFilesContentResponse> => {
  const people: string[] = []
  const hardware: string[] = []

  for (const { filename, content } of files) {
    const messages: ChatCompletionMessageParam[] = [{ role: 'user', content: content }]

    const response = await askOpenAI({
      systemPrompt: CATEGORIZE_FILES_CONTENT_SYSTEM_PROMPT,
      messages,
      model: 'gpt-4o',
      isTracing: true,
      tracingOptions: {
        traceName: 'CATEGORIZE FILES CONTENT',
        traceId: 'categorizeFilesContent-traceId1',
        sessionId: 'categorizeFilesContent-sessionId1',
        spanName: 'categorizeFilesContent-spanName1',
      },
    })

    const answer = response.answer.trim().toLowerCase()
    if (answer === 'people') people.push(filename)
    if (answer === 'hardware') hardware.push(filename)
  }

  return {
    people: people.sort(),
    hardware: hardware.sort(),
  }
}
