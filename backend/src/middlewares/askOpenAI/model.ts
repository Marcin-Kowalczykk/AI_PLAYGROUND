import { ChatCompletion } from 'openai/resources/chat/completions'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

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

// export type ChatCompletionMessageParam = {
//   role: 'system' | 'user' | 'assistant'
//   content: string | ImageContent[]
// }
