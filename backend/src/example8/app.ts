import { sendAnswerToCentralApi } from '../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'
import { TASK_NAME } from './constants'
import { fetchRobotDescription } from './helpers/fetchRobotDescription'
import { generateRobotImage } from './helpers/generateRobotImage'

export const handleProcessExample8 = async (): Promise<{
  imageURL: string
  flag: string
}> => {
  const robotDescription = await fetchRobotDescription()

  const imageURL = robotDescription ? await generateRobotImage(robotDescription) : ''

  const example8Response = await sendAnswerToCentralApi({
    taskName: TASK_NAME,
    answer: imageURL,
  })

  const result = {
    imageURL,
    flag: example8Response?.message || '',
  }

  return result
}

// handleProcessExample8()
// uncomment line above if you want to run process from terminal npm run start:example8 or bun example8
