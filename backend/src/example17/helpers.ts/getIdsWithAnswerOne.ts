import fs from 'fs'

export const getIdsWithAnswerOne = (pathToAnswersFile: string): string[] => {
  try {
    const fileContent = fs.readFileSync(pathToAnswersFile, 'utf-8')
    const lines = fileContent.split('\n').filter((line) => line.trim())

    return lines
      .map((line) => {
        const [id, answer] = line.split(': ')
        return { id, answer: answer.trim() }
      })
      .filter(({ answer }) => answer === '1')
      .map(({ id }) => id)
  } catch (error) {
    console.error('Error reading answers file:', error)
    return []
  }
}
