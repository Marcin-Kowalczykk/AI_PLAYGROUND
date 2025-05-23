import { ChatCompletion } from 'openai/resources/chat/completions'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { ImagesResponse } from 'openai/resources/index'

export interface ImageContent {
  type: 'image_url'
  image_url: {
    url: string
    detail: 'high' | 'low' | 'auto'
  }
}

export type Message = {
  role: 'system' | 'user' | 'assistant'
  content: string | ImageContent[]
}

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

export interface IAskOpenAiImage extends IAskOpenAI {
  n?: number
  size?: '1024x1024' | '1024x1792' | '1792x1024'
  response_format?: 'url' | 'b64_json'
}

export interface IAskOpenAiImageResponse {
  rawResponseFromOpenAi: ImagesResponse
  answer: string
  messages: ChatCompletionMessageParam[]
}

// export type ChatCompletionMessageParam = {
//   role: 'system' | 'user' | 'assistant'
//   content: string | ImageContent[]
// }
