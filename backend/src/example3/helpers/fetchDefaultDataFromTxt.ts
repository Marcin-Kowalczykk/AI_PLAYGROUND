import axios from 'axios'
import { DefaultDataFromTxt } from '../model'
import { DEFAULT_FILE_URL } from '../constants'

export const fetchDefaultDataFromTxt = async (): Promise<DefaultDataFromTxt> => {
  try {
    const response = await axios.get(DEFAULT_FILE_URL)
    console.log('Default data from txt: ', response.data)

    return response.data
  } catch (error) {
    console.error('error during fetch default data:', error)
    throw error
  }
}
