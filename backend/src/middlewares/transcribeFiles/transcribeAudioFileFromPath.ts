import fs from 'fs'
import { openAiConfig } from '../askOpenAI/openAiConfig'

export const transcribeAudioFileFromPath = async (
  filePath: string,
): Promise<string | undefined> => {
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

// exampleFilePath = path.join(inputDir, 'filename')
// where inputDir = path.join(__dirname, 'dirname')
