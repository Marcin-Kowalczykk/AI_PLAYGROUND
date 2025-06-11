import { createLearningData } from './helpers.ts/createLearningData/createLearningData'
import { createDataToVerify } from './helpers.ts/createDataToVerify/createDataToVerify'
import { sendAnswerToCentralApi } from '../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'
import { askOpenAI } from '../middlewares/askOpenAI/askOpenAi'
import * as fs from 'fs'
import * as path from 'path'
import { getIdsWithAnswerOne } from './helpers.ts/getIdsWithAnswerOne'

const ANSWERS_FILE_PATH = path.join(__dirname, 'answers.txt')

const verifyFileAndSaveAnswer = async () => {
  const VERIFY_FILE_PATH = 'helpers.ts/createDataToVerify/data_to_verify/data_to_verify.jsonl'
  const GPT_FINE_TUNING_MODEL = 'ft:gpt-4o-mini-2024-07-18:personal:verify-example17:BhBMwWFw'
  const FILE_TO_VERIFY_PATH = path.join(__dirname, VERIFY_FILE_PATH)

  try {
    const fileContent = fs.readFileSync(FILE_TO_VERIFY_PATH, 'utf-8')
    const lines = fileContent.split('\n').filter((line) => line.trim())

    const answers: string[] = []

    for (const line of lines) {
      const data = JSON.parse(line)
      const userMessage = data.messages.find((msg: any) => msg.role === 'user')?.content

      if (!userMessage) continue

      const id = userMessage.split('=')[0]

      const response = await askOpenAI({
        messages: data.messages,
        model: GPT_FINE_TUNING_MODEL,
        temperature: 0.7,
      })

      answers.push(`${id}: ${response.answer}`)
    }

    console.log('answers from model: ', answers)
    fs.writeFileSync(ANSWERS_FILE_PATH, answers.join('\n'))
  } catch (error) {
    console.error('Error processing data:', error)
    throw error
  }
}

const handleProcessExample17 = async () => {
  createLearningData()
  createDataToVerify()

  if (!fs.existsSync(ANSWERS_FILE_PATH)) {
    await verifyFileAndSaveAnswer()
  }

  const idsWithAnswerOne = getIdsWithAnswerOne(ANSWERS_FILE_PATH)
  console.log('answers: ', idsWithAnswerOne)

  const answerFromCentrala = sendAnswerToCentralApi({
    taskName: 'research',
    answer: idsWithAnswerOne,
  })

  console.log(answerFromCentrala)
}

handleProcessExample17()
