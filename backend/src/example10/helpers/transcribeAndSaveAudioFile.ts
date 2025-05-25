import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { transcribeAudioFileFromPath } from '../../middlewares/transcribeFiles/transcribeAudioFileFromPath'

export const transcribeAndSaveAudioFile = async (
  audioFileName: string,
  transcriptionsPath: string,
  recordsPath: string,
) => {
  try {
    if (!existsSync(transcriptionsPath)) {
      mkdirSync(transcriptionsPath, { recursive: true })
    }

    const audioFilePath = join(recordsPath, audioFileName)
    const transcriptionFileName = audioFileName.replace('.mp3', '.txt')
    const transcriptionPath = join(transcriptionsPath, transcriptionFileName)

    if (existsSync(transcriptionPath)) {
      console.log(`Transcription already exists at ${transcriptionPath}, skipping transcription`)
      return
    }

    const transcription = await transcribeAudioFileFromPath(audioFilePath)

    if (transcription) {
      writeFileSync(transcriptionPath, transcription, 'utf-8')
      console.log(`Transcription saved to ${transcriptionPath}`)
    } else {
      console.error('Failed to transcribe audio file')
    }
  } catch (error) {
    console.error('Error during audio transcription:', error)
  }
}
