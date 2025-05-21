import 'dotenv/config'
import OpenAI from 'openai'

export const openAiConfig = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
