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

// export type ChatCompletionMessageParam = {
//   role: 'system' | 'user' | 'assistant'
//   content: string | ImageContent[]
// }
