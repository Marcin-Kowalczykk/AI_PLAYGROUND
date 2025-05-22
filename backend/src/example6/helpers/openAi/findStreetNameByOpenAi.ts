import { askOpenAI } from '../../../middlewares/askOpenAI/askOpenAi'
import { SYSTEM_PROMPT } from './constants'

export const findStreetNameByOpenAi = async (transcriptionsText: string) => {
  const userPrompt = `Przeanalizuj poniższe transkrypcje i podaj nazwę ulicy, na której znajduje się instytut Andrzeja Maja:
  
  ${transcriptionsText}`

  const result = await askOpenAI({
    systemPrompt: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
    isTracing: true,
    tracingOptions: {
      traceName: 'Example 6 - find street name',
      sessionId: 'example6',
      spanName: 'findStreetNameByOpenAi',
    },
  })
  return result.answer
}
