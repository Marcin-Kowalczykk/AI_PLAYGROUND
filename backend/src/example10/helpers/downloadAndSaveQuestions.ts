import axios from 'axios'
import { writeFileSync } from 'fs'
import { mkdirSync, existsSync } from 'fs'
import { EXAMPLE_10_QUESTIONS_URL } from '../constants'

export const downloadAndSaveQuestions = async (savedDataPath: string, questionsPath: string) => {
  try {
    if (!existsSync(savedDataPath)) {
      mkdirSync(savedDataPath, { recursive: true })
    }

    if (existsSync(questionsPath)) {
      console.log(`Questions already exist at ${questionsPath}, skipping download`)
      return
    }

    const questionsResponse = await axios.get(EXAMPLE_10_QUESTIONS_URL)

    writeFileSync(questionsPath, questionsResponse.data, 'utf-8')
    console.log(`Questions saved to ${questionsPath}`)
  } catch (error) {
    console.error('Error during questions download: ', error)
  }
}
