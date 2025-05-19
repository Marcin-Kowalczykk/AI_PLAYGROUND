import 'dotenv/config'
import axios from 'axios'
import { openAiConfig } from '../helpers/askOpenAI/openAiConfig'
import { TASK_NAME } from './constants'
import { ISendFinalAnswerResponse } from '../example3/app'
import { censureTextByOpenAi } from './helpers/censureTextByOpenAi'

export const sendFinalAnswerExample5 = async (): Promise<ISendFinalAnswerResponse | undefined> => {
  const censoredAnwer = await censureTextByOpenAi(openAiConfig)

  const payload = {
    task: TASK_NAME,
    apikey: process.env.POLIGON_API_KEY,
    answer: censoredAnwer,
  }

  try {
    const response = await axios.post(`${process.env.CENTRALA_API_URL}/report`, payload)
    console.log('Response from /report: ', response.data)

    return response.data
  } catch (error) {
    console.error('Error sending data to /report:', error)
  }
}

// sendFinalAnswerExample5()
// uncomment line above if you want to run process from terminal npm run start:example5
