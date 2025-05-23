import { openAiConfig } from '../../../middlewares/askOpenAI/openAiConfig'
import fs from 'fs'

// todo: move it to middlewares
export const transcribeAudioFile = async (filePath: string): Promise<string | undefined> => {
  try {
    const audioFile = fs.createReadStream(filePath)
    const response = await openAiConfig.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'pl',
    })
    return response.text
  } catch (error) {
    console.error(`Error transcribing file ${filePath}:`, error)
  }
}
