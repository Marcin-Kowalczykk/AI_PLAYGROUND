import { ChatCompletion, ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { openAiConfig } from './openAiConfig'
import {
  createLangfuseSpan,
  createLangfuseTrace,
  finalizeLangfuseSpan,
  finalizeLangfuseTrace,
  handleLangfuseError,
} from '../../langFuse/langFuseService'
import { v4 as uuidv4 } from 'uuid'

export interface IAskOpenAI {
  systemPrompt?: string
  messages?: ChatCompletionMessageParam[]
  model?: string
  temperature?: number
  max_tokens?: number
  isTracing?: boolean
  tracingOptions?: { traceName: string; traceId?: string; sessionId: string; spanName: string }
}

export interface IAskOpenAIResponse {
  answer: string
  messages: ChatCompletionMessageParam[]
  rawResponseFromOpenAi: ChatCompletion
}

export const askOpenAI = async ({
  systemPrompt = 'You are a helpful assistant.',
  messages,
  model = 'gpt-4',
  temperature,
  max_tokens,
  isTracing = false,
  tracingOptions,
}: IAskOpenAI): Promise<IAskOpenAIResponse> => {
  const { traceName, sessionId, spanName, traceId } = tracingOptions || {}

  let updatedMessages: ChatCompletionMessageParam[] = []

  const trace =
    isTracing && tracingOptions && traceName && sessionId
      ? createLangfuseTrace(traceName, traceId ?? uuidv4(), sessionId)
      : undefined

  try {
    const allMessages = [
      ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
      ...(messages || []),
    ]

    const span =
      isTracing && trace && spanName ? createLangfuseSpan(trace, spanName, allMessages) : undefined

    const response = await openAiConfig.chat.completions.create({
      model,
      messages: allMessages,
      temperature,
      max_tokens,
    })

    if (isTracing && span && spanName) {
      finalizeLangfuseSpan(span, spanName, allMessages, response)
    }

    const answer = response.choices[0]?.message?.content || ''

    updatedMessages = allMessages
      ? [...allMessages, { role: 'assistant', content: answer }]
      : [{ role: 'assistant', content: answer }]

    return {
      rawResponseFromOpenAi: response,
      answer,
      messages: updatedMessages as ChatCompletionMessageParam[],
    }
  } catch (error) {
    console.error('Error asking OpenAI:', error)
    if (isTracing) handleLangfuseError()
    updatedMessages = [
      ...(messages || []),
      {
        role: 'assistant',
        content: `Błąd: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    ]
    throw new Error(
      `Failed to get response from OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  } finally {
    if (isTracing && trace) {
      await finalizeLangfuseTrace(trace, messages, updatedMessages as ChatCompletionMessageParam[])
    }
  }
}
