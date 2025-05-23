import axios from 'axios'
import { ISendAnswerToCentralApi, ISendAnswerToCentralApiResponse } from './model'

export const sendAnswerToCentralApi = async ({
  taskName,
  answer,
}: ISendAnswerToCentralApi): Promise<ISendAnswerToCentralApiResponse | undefined> => {
  const payload = {
    task: taskName,
    apikey: process.env.POLIGON_API_KEY,
    answer: answer,
  }

  try {
    const response = await axios.post(`${process.env.CENTRALA_API_URL}/report`, payload)
    console.log('Response from /report: ', response.data)

    return response.data
  } catch (error) {
    console.error('Error sending data to /report:', error)
  }
}
