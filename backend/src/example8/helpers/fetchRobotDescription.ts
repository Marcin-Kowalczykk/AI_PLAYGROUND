import axios from 'axios'
import { handleError } from '../../middlewares/handleError'
import { ROBOT_DESCRIPTION_URL } from '../constants'

export const fetchRobotDescription = async (): Promise<string | undefined> => {
  try {
    const response = await axios.get(ROBOT_DESCRIPTION_URL)
    console.log('Robot description:', response.data.description)

    return response.data.description
  } catch (error: unknown) {
    handleError(error, 'fetchRobotDescription')
  }
}
