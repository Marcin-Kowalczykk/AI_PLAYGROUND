import path from 'path'
import { transcribeAudioFile } from './transcribeAudioFile'
import fs from 'fs'
import { RECORDS_DIR } from '../../app'

export const transcribeAllFiles = async () => {
  try {
    const files = fs.readdirSync(RECORDS_DIR)
    const transcriptions = await Promise.all(
      files
        .filter((file) => file.endsWith('.m4a'))
        .map(async (file) => {
          const filePath = path.join(RECORDS_DIR, file)
          console.log(`Transcribing ${file}...`)
          const transcription = await transcribeAudioFile(filePath)

          return [file, transcription]
        }),
    )

    const transcriptionsObject = Object.fromEntries(transcriptions)

    return transcriptionsObject
  } catch (error) {
    console.error('Error in transcribeAllFiles:', error)
  }
}
