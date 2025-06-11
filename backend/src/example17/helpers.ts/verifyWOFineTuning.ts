import * as fs from 'fs'
import * as path from 'path'

export const verifyWOFineTuning = () => {
  const readFile = (filename: string, isVerify: boolean = false): string[] => {
    const basePath = isVerify
      ? path.join(__dirname, 'createDataToVerify', 'lab_data')
      : path.join(__dirname, 'createLearningData', 'lab_data')
    const filePath = path.join(basePath, filename)
    return fs.readFileSync(filePath, 'utf-8').split('\n')
  }

  const analyzePatterns = (
    correctLines: string[],
    incorrectLines: string[],
  ): [Set<string>, Set<string>] => {
    const correctPatterns = new Set<string>()
    const incorrectPatterns = new Set<string>()

    for (const line of correctLines) {
      if (line.trim()) {
        correctPatterns.add(line.trim())
      }
    }

    for (const line of incorrectLines) {
      if (line.trim()) {
        incorrectPatterns.add(line.trim())
      }
    }

    console.log('Correct patterns count:', correctPatterns.size)
    console.log('Incorrect patterns count:', incorrectPatterns.size)

    return [correctPatterns, incorrectPatterns]
  }

  const checkVerifyEntries = (
    verifyLines: string[],
    correctPatterns: Set<string>,
    incorrectPatterns: Set<string>,
  ): string[] => {
    const matches: string[] = []

    console.log('Verifying entries:')
    for (const line of verifyLines) {
      if (line.includes('=')) {
        const [num, words] = line.split('=')
        if (words.trim()) {
          console.log(`Checking entry ${num}:`, words.trim())
          console.log('Is in correct patterns:', correctPatterns.has(words.trim()))
          console.log('Is in incorrect patterns:', incorrectPatterns.has(words.trim()))
          if (correctPatterns.has(words.trim()) && !incorrectPatterns.has(words.trim())) {
            matches.push(num)
          }
        }
      }
    }

    return matches
  }

  let result: string[] = []

  try {
    const correctLines = readFile('correct.txt')
    const incorrectLines = readFile('incorect.txt')
    const verifyLines = readFile('verify.txt', true)

    console.log('Correct lines count:', correctLines.length)
    console.log('Incorrect lines count:', incorrectLines.length)
    console.log('Verify lines count:', verifyLines.length)

    const [correctPatterns, incorrectPatterns] = analyzePatterns(correctLines, incorrectLines)

    result = checkVerifyEntries(verifyLines, correctPatterns, incorrectPatterns)

    console.log('Final matches:', result)
  } catch (error) {
    console.error('Error:', error)
  }

  return result
}
