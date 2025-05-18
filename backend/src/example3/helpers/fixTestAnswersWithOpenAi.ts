import { openAiConfig } from '../../openAiConfig'
import { TestDataItem } from '../model'

export const fixTestAnswersWithOpenAi = async (data: TestDataItem[]): Promise<TestDataItem[]> => {
  const result = await Promise.all(
    data.map(async (item) => {
      if (item.test && item.test.q) {
        const completion = await openAiConfig.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Answer briefly and concisely; if possible, respond with a single word.',
            },
            { role: 'user', content: item.test.q },
          ],
        })
        const answer = completion.choices[0]?.message?.content || ''

        return {
          ...item,
          test: {
            ...item.test,
            a: answer,
          },
        }
      }
      return item
    }),
  )

  console.log('Final fixed test-data result: ', result)
  return result
}
