import 'dotenv/config'
import { sendAnswerToCentralApi } from '../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'
import { askOpenAI } from '../middlewares/askOpenAI/askOpenAi'

const SYSTEM_PROMPT = `Jesteś nawigatorem drona. Odpowiadasz zawsze jednym lub dwoma słowami po polsku, co znajduje się na danym polu mapy. Oto mapa 4x4 (wiersze od góry, kolumny od lewej):
(0,0): punkt startowy
(0,1): trawa
(0,2): drzewo
(0,3): dom
(1,0): trawa
(1,1): wiatrak
(1,2): trawa
(1,3): trawa
(2,0): trawa
(2,1): trawa
(2,2): skały
(2,3): dwa drzewa
(3,0): góry
(3,1): góry
(3,2): auto
(3,3): jaskinia
Dron zawsze startuje z lewego górnego rogu mapy (0,0).`

export const handleProcessExample19 = async (body: { instruction: string }) => {
  const { instruction } = body
  console.log('Instruction from Centrala: ', instruction)

  const aiResponse = await askOpenAI({
    systemPrompt: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Instrukcja lotu drona: ${instruction}\nOdpowiedz: co znajduje się pod dronem? Odpowiedz maksymalnie dwoma słowami.`,
      },
    ],
    max_tokens: 10,
    temperature: 0,
  })

  const description = (aiResponse?.answer?.trim() || '').split('\n')[0]
  return { description }
}

// sendAnswerToCentralApi({
//   taskName: 'webhook',
//   answer: `${process.env.AI_PLAYGROUND_API_URL}/internal.api/post-instruction-example19`,
// })
