import path from 'path'
import { transcribeAudioFileFromPath } from './transcribeAudioFileFromPath'
import fs from 'fs'
import { ITranscribeFilesFromDirectory } from './model'
import { combineTranscriptionsObjectIntoText } from './combineTranscriptionsObjectIntoText'

export const transcribeAllFilesFromDirectory = async ({
  directory,
  fileExtension = '.mp3',
  returnAs = 'object',
}: ITranscribeFilesFromDirectory): Promise<Record<string, string> | string | undefined> => {
  try {
    const files = fs.readdirSync(directory)
    const transcriptions = await Promise.all(
      files
        .filter((file) => file.endsWith(fileExtension))
        .map(async (file) => {
          const filePath = path.join(directory, file)
          console.log(`Transcribing ${file} from ${directory}...`)
          const transcription = await transcribeAudioFileFromPath(filePath)

          return [file, transcription]
        }),
    )

    const transcriptionsObject = Object.fromEntries(transcriptions)

    return returnAs === 'object'
      ? transcriptionsObject
      : combineTranscriptionsObjectIntoText(transcriptionsObject)
  } catch (error) {
    console.error(`Error in transcribeAllFiles from ${directory}: `, error)
  }
}

// Example_RECORDS_DIR = path.join(__dirname, 'name_of_directory')
