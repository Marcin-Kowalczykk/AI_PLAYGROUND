import { Message } from './model'
import { openAiConfig } from './openAiConfig'

export const askOpenAI = async (
  systemPrompt = 'You are a helpful assistant.',
  messages?: Message[],
  temperature?: number,
  max_tokens?: number,
  model = 'gpt-4',
): Promise<{ answer: string; messages: Message[] }> => {
  try {
    const allMessages: Message[] = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      ...(messages || []),
    ]

    const response = await openAiConfig.chat.completions.create({
      model,
      messages: allMessages,
      temperature,
      max_tokens,
    })

    const answer = response.choices[0]?.message?.content || ''

    const updatedMessages = messages
      ? [...messages, { role: 'assistant', content: answer }]
      : [{ role: 'assistant', content: answer }]

    return {
      answer,
      messages: updatedMessages as Message[],
    }
  } catch (error) {
    console.error('Error asking OpenAI:', error)
    throw new Error(
      `Failed to get response from OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}
