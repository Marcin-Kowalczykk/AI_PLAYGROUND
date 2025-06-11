import fs from 'fs'
import path from 'path'

export const createDataToVerify = () => {
  const DATA_TO_VERIFY_DIR = path.join(__dirname, 'data_to_verify')
  const OUTPUT_PATH_DATA_TO_VERIFY = path.join(DATA_TO_VERIFY_DIR, 'data_to_verify.jsonl')

  if (fs.existsSync(DATA_TO_VERIFY_DIR) || fs.existsSync(OUTPUT_PATH_DATA_TO_VERIFY)) {
    console.log(`Data to verify already exists at: ${OUTPUT_PATH_DATA_TO_VERIFY}`)
    return
  }

  fs.mkdirSync(DATA_TO_VERIFY_DIR)

  const verifyData = fs.readFileSync(path.join(__dirname, 'lab_data', 'verify.txt'), 'utf-8')

  const jsonlEntries: string[] = []

  verifyData.split('\n').forEach((line) => {
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
        ],
      }
      jsonlEntries.push(JSON.stringify(entry))
    }
  })

  fs.writeFileSync(OUTPUT_PATH_DATA_TO_VERIFY, jsonlEntries.join('\n'))

  console.log(`Created JSONL file at: ${OUTPUT_PATH_DATA_TO_VERIFY}`)
  console.log(`Total entries: ${jsonlEntries.length}`)
}
