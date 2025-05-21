import { askOpenAI } from '../../../middlewares/askOpenAI/askOpenAi'
import { SYSTEM_PROMPT } from './constants'

export const findStreetNameByOpenAi = async (transcriptionsText: string) => {
  const userPrompt = `Przeanalizuj poniższe transkrypcje i podaj nazwę ulicy, na której znajduje się instytut Andrzeja Maja:
  
  ${transcriptionsText}`

  const result = await askOpenAI(SYSTEM_PROMPT, [{ role: 'user', content: userPrompt }])
  return result.answer
}
