import { combineTranscriptionsObjectIntoText } from './combineTranscriptionsObjectIntoText'
import { transcribeAllFiles } from './transcribeAllFiles'

export const createTextFileWithTranscriptions = async (): Promise<string> => {
  const transcriptionsObject = await transcribeAllFiles()

  const transcriptionsText = combineTranscriptionsObjectIntoText(transcriptionsObject)

  console.log('All Transcriptions: ', transcriptionsText)
  return transcriptionsText
}
