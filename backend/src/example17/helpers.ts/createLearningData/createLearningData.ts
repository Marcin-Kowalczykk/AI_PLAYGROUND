import fs from 'fs'
import path from 'path'

export const createLearningData = () => {
  const LEARNING_DATA_DIR = path.join(__dirname, 'learning_data')
  const OUTPUT_PATH_LEARNING_DATA = path.join(LEARNING_DATA_DIR, 'learning_data.jsonl')

  if (fs.existsSync(LEARNING_DATA_DIR) || fs.existsSync(OUTPUT_PATH_LEARNING_DATA)) {
    console.log(`Learning data already exists at: ${OUTPUT_PATH_LEARNING_DATA}`)

    return
  }

  fs.mkdirSync(LEARNING_DATA_DIR)

  const correctData = fs.readFileSync(path.join(__dirname, 'lab_data', 'correct.txt'), 'utf-8')
  const incorrectData = fs.readFileSync(path.join(__dirname, 'lab_data', 'incorect.txt'), 'utf-8')

  const jsonlEntries: string[] = []

  correctData.split('\n').forEach((line) => {
    if (line.trim()) {
      const entry = {
        messages: [
          {
            role: 'system',
            content: 'validate data',
          },
          {
            role: 'user',
            content: line.trim(),
          },
          {
            role: 'assistant',
            content: '1',
          },
        ],
      }
      jsonlEntries.push(JSON.stringify(entry))
    }
  })

  incorrectData.split('\n').forEach((line) => {
    if (line.trim()) {
      const entry = {
        messages: [
          {
            role: 'system',
            content: 'validate data',
          },
          {
            role: 'user',
            content: line.trim(),
          },
          {
            role: 'assistant',
            content: '0',
          },
        ],
      }
      jsonlEntries.push(JSON.stringify(entry))
    }
  })

  fs.writeFileSync(OUTPUT_PATH_LEARNING_DATA, jsonlEntries.join('\n'))

  console.log(`Created JSONL file at: ${OUTPUT_PATH_LEARNING_DATA}`)
  console.log(`Total entries: ${jsonlEntries.length}`)
}
