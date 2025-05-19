import 'dotenv/config'
import { ISendFinalAnswerResponse } from '../example3/app'
import axios from 'axios'
import 'dotenv/config'
import { startFindStreetNameProcess } from './helpers/startFindStreetNameProcess'
import { TASK_NAME } from './constants'
import path from 'path'

export const RECORDS_DIR = path.join(__dirname, 'records_example6')

export const sendFinalAnswerExample6 = async (): Promise<ISendFinalAnswerResponse | undefined> => {
  const streetNameAnswer = await startFindStreetNameProcess()

  const payload = {
    task: TASK_NAME,
    apikey: process.env.POLIGON_API_KEY,
    answer: streetNameAnswer,
  }

  try {
    const response = await axios.post(`${process.env.CENTRALA_API_URL}/report`, payload)
    console.log('Response from /report: ', response.data)

    return response.data
  } catch (error) {
    console.error('Error sending data to /report:', error)
  }
}

// sendFinalAnswerExample6()

// uncomment line above if you want to run process from terminal npm run start:example6
