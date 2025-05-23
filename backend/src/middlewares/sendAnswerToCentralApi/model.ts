export interface ISendAnswerToCentralApiResponse {
  code: number
  message: string
}

export interface ISendAnswerToCentralApi {
  taskName: string
  answer: unknown
}
