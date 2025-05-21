import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { openAiConfig } from './openAiConfig'

export const askOpenAI = async (
  systemPrompt = 'You are a helpful assistant.',
  messages?: ChatCompletionMessageParam[],
  model = 'gpt-4',
  temperature?: number,
  max_tokens?: number,
): Promise<{ answer: string; messages: ChatCompletionMessageParam[] }> => {
  try {
    const allMessages = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      ...(messages || []),
    ]

    const response = await openAiConfig.chat.completions.create({
      model,
      messages: allMessages as ChatCompletionMessageParam[],
      temperature,
      max_tokens,
    })

    const answer = response.choices[0]?.message?.content || ''

    const updatedMessages = messages
      ? [...messages, { role: 'assistant', content: answer }]
      : [{ role: 'assistant', content: answer }]

    return {
      answer,
      messages: updatedMessages as ChatCompletionMessageParam[],
    }
  } catch (error) {
    console.error('Error asking OpenAI:', error)
    throw new Error(
      `Failed to get response from OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
