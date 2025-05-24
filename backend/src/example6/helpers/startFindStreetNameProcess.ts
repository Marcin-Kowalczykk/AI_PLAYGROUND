import { findStreetNameByOpenAi } from './openAi/findStreetNameByOpenAi'
import { createTextFileWithTranscriptions } from './transcriptions/createTextFileWithTranscriptions'

export const startFindStreetNameProcess = async () => {
  const transcriptionsText = await createTextFileWithTranscriptions()
  const streetName = await findStreetNameByOpenAi(transcriptionsText ?? '')

  console.log('Street name found by AI:', streetName)
  return streetName
}
