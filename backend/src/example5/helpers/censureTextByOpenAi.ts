import OpenAI from 'openai'
import { fetchDefaultDataFromTxt } from '../../helpers/fetchDefaultDataFromTxt'
import { createCensuredPrompt } from './createCensuredPrompt'
import { DEFAULT_FILE_URL } from '../constants'

export const censureTextByOpenAi = async (openaiConfig: OpenAI): Promise<string> => {
  const textToCensure = await fetchDefaultDataFromTxt(DEFAULT_FILE_URL)
  const systemPrompt = createCensuredPrompt(textToCensure.toString())

  const response = await openaiConfig.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'system', content: systemPrompt }],
  })

  const censuredText = response.choices[0]?.message?.content || ''

  console.log('Censured text: ', censuredText)
  return censuredText
}
