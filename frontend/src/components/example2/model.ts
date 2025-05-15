interface ISingleConversation {
  role: 'robot' | 'human'
  text: string
  msgID: string
}

export type Conversation = ISingleConversation[]

export interface Message {
  role: 'user' | 'assistant'
  content: string
}
