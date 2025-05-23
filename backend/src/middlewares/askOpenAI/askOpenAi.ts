import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { openAiConfig } from './openAiConfig'
import {
  createLangfuseSpan,
  createLangfuseTrace,
  finalizeLangfuseSpan,
  finalizeLangfuseTrace,
  handleLangfuseError,
} from '../../langFuse/langFuseService'
import { v4 as uuidv4 } from 'uuid'
import { IAskOpenAIResponse, IAskOpenAI, IAskOpenAiImage, IAskOpenAiImageResponse } from './model'

// TODO: change name to askOpenAiChat
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
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

export const askOpenAiImage = async ({
  systemPrompt = 'A detailed, high-quality frenchie (doggy) PNG image.',
  messages = [],
  model = 'dall-e-3',
  n = 1,
  size = '1024x1024',
  response_format = 'url',
  isTracing = false,
  tracingOptions,
}: IAskOpenAiImage): Promise<IAskOpenAiImageResponse> => {
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

    const response = await openAiConfig.images.generate({
      model,
      prompt: systemPrompt,
      n,
      size,
      response_format,
    })

    if (isTracing && span && spanName) {
      finalizeLangfuseSpan(span, spanName, allMessages, response)
    }

    const answer = response.data?.[0]?.url || ''

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
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
