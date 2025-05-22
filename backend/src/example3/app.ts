import axios from 'axios'
import 'dotenv/config'
import { PREPARED_JSON_TO_SEND } from './constants'
import { fixMathInTestDataAnswers } from './helpers/fixMathInTestDataAnswers'
import { fixTestAnswersWithOpenAi } from './helpers/fixTestAnswersWithOpenAi'

export interface ISendFinalAnswerResponse {
  code: number
  message: string
}

export const sendFinalAnswerExample3 = async (): Promise<ISendFinalAnswerResponse | undefined> => {
  const fixedMathInTestData = await fixMathInTestDataAnswers()
  const completeFixedTestData = await fixTestAnswersWithOpenAi(fixedMathInTestData)

  const payload = {
    ...PREPARED_JSON_TO_SEND,
    answer: {
      ...PREPARED_JSON_TO_SEND.answer,
      'test-data': completeFixedTestData,
    },
  }

  try {
    const response = await axios.post(`${process.env.CENTRALA_API_URL}/report`, payload)
    console.log('Response from /report: ', response.data)

    return response.data
  } catch (error) {
    console.error('Error sending data to /report:', error)
  }
}

// sendFinalAnswerExample3()
// uncomment line above if you want to run process from terminal npm run start:example3
