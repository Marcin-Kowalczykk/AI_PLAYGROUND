import { transcribeAllFilesFromDirectory } from '../../../middlewares/transcribeFiles/transcribeAllFilesFromDirectory'
import { RECORDS_DIR } from '../../app'

export const createTextFileWithTranscriptions = async (): Promise<string | undefined> => {
  const transcriptionsText = await transcribeAllFilesFromDirectory({
    directory: RECORDS_DIR,
    returnAs: 'text',
    fileExtension: '.m4a',
  })

  console.log('All Transcriptions: ', transcriptionsText)

  return transcriptionsText ? (transcriptionsText as string) : undefined
}
