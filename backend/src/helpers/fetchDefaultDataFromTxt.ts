import axios from 'axios'
import { DefaultDataFromTxt } from '../example3/model'

export const fetchDefaultDataFromTxt = async (fileUrl: string): Promise<DefaultDataFromTxt> => {
  try {
    const response = await axios.get(fileUrl)
    console.log('Default data from txt: ', response.data)

    return response.data
  } catch (error) {
    console.error('error during fetch default data:', error)
    throw error
  }
}
