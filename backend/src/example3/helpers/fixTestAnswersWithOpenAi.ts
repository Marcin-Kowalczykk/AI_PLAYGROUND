import { openAiConfig } from '../../middlewares/askOpenAI/openAiConfig'
import { TestDataItem } from '../model'
import {
  createLangfuseTrace,
  createLangfuseSpan,
  finalizeLangfuseSpan,
  handleLangfuseError,
  finalizeLangfuseTrace,
} from '../../langFuse/langFuseService'
import { v4 as uuidv4 } from 'uuid'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export const fixTestAnswersWithOpenAi = async (data: TestDataItem[]): Promise<TestDataItem[]> => {
  const trace = createLangfuseTrace('Example 3 - test', uuidv4(), 'example3')

  const result = await Promise.all(
    data.map(async (item, index) => {
      if (item.test && item.test.q) {
        const messages: ChatCompletionMessageParam[] = [
          {
            role: 'system',
            content: 'Answer briefly and concisely; if possible, respond with a single word.',
          },
          { role: 'user', content: item.test.q },
        ]

        try {
          const span = createLangfuseSpan(trace, `example3-${index}`, messages)

          const completion = await openAiConfig.chat.completions.create({
            model: 'gpt-4',
            messages,
          })

          finalizeLangfuseSpan(span, `example3-${index}`, messages, completion)

          const answer = completion.choices[0]?.message?.content || ''

          return {
            ...item,
            test: {
              ...item.test,
              a: answer,
            },
          }
        } catch (err) {
          handleLangfuseError()
          console.error('Langfuse error:', err)
          return item
        }
      }
      return item
    }),
  )

  finalizeLangfuseTrace(trace)

  console.log('Final fixed test-data result: ', result)
  return result
}
