import { TestDataItem } from '../model'
import { getDefaultTestData } from './getDefaultTestData'

export const fixMathInTestDataAnswers = async (): Promise<TestDataItem[]> => {
  const testData = await getDefaultTestData()

  const fixedData = testData.map((item) => {
    const match = item.question.match(/(\d+)\s*\+\s*(\d+)/)
    if (!match) return item

    const num1 = Number(match[1])
    const num2 = Number(match[2])
    const correctAnswer = num1 + num2

    if (item.answer !== correctAnswer) {
      return { ...item, answer: correctAnswer }
    }
    return item
  })

  console.log('Fixed-test-data: ', fixedData)
  return fixedData
}
