import { readFileSync } from 'fs'
import { sendAnswerToCentralApi } from '../../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'

export const sendAnswersExample10 = async (answersPath: string) => {
  const answersRaw = readFileSync(answersPath, 'utf-8')
  const answerLines = answersRaw.split('\n').filter(Boolean)

  const answer: Record<string, string> = {}
  for (const line of answerLines) {
    const [id, ...rest] = line.split('=')
    answer[id.trim()] = rest.join('=').trim()
  }

  const payload = { answer, taskName: 'arxiv' }

  try {
    const response = await sendAnswerToCentralApi(payload)
    console.log('Answers sent to central:', answer)

    console.log('Response from central:', response?.message)
    return response
  } catch (error) {
    console.error('Error sending answers to central:', error)
  }
}
