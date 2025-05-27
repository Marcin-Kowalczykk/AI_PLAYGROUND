import { readFileSync } from 'fs'
import { sendAnswerToCentralApi } from '../../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'
import { ISendAnswerToCentralApiResponse } from '../../middlewares/sendAnswerToCentralApi/model'

export const sendAnswerExample11 = async (
  reportsKeywordsFile: string,
): Promise<ISendAnswerToCentralApiResponse | undefined> => {
  const anwersJson = readFileSync(reportsKeywordsFile, 'utf-8')
  const answers = JSON.parse(anwersJson)

  const answerFromCentralApi = await sendAnswerToCentralApi({
    taskName: 'dokumenty',
    answer: answers,
  })

  return answerFromCentralApi
}
