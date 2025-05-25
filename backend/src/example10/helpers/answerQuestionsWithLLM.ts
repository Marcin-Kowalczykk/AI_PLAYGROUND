import { existsSync, readFileSync, writeFileSync } from 'fs'
import { FILE_NAMES } from '../constants'
import { askOpenAI } from '../../middlewares/askOpenAI/askOpenAi'

export const answerQuestionsWithLLM = async (
  answersPath: string,
  finalArticleMdPath: string,
  questionsPath: string,
) => {
  console.log('Generating answers with LLM...')

  if (existsSync(answersPath)) {
    console.log(
      `File with answers already exists: ${answersPath}, skipping generation new answers (delete ${FILE_NAMES.ANSWERS_FILE} to generate new answers).`,
    )
    return
  }

  const context = readFileSync(finalArticleMdPath, 'utf-8')

  const questionsRaw = readFileSync(questionsPath, 'utf-8')
  const questions = questionsRaw
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [id, ...rest] = line.split('=')
      return { id: id.trim(), question: rest.join('=').trim() }
    })

  const answers: string[] = []

  for (const { id, question } of questions) {
    const response = await askOpenAI({
      systemPrompt: `Jesteś ekspertem od czytania artykułów ze zrozumieniem. 
  
        <wrong_result_example>
          Question: Na rynku którego miasta wykonano testową fotografię użytą podczas testu przesyłania multimediów?
          Answer: "Fotografia testowa przedstawiająca rynek została wykonana w nieokreślonym mieście, w miejscu przypuszczalnie nazywanym \"Adasiem\".",
        </wrong_result_example>
  
        Zasady:
  
         - Odpowiadaj zwięźle, 
         - Odpowiadaj jednym zdaniem, 
         - Odpowiadaj tylko na podstawie kontekstu.
  
          kontekst: ${context}`,
      messages: [{ role: 'user', content: question }],
      model: 'gpt-4o',
      isTracing: true,
      tracingOptions: {
        traceName: 'EXAMPLE_10',
        traceId: 'example10',
        sessionId: 'example10',
        spanName: 'answerQuestionsExample10',
      },
    })

    answers.push(`${id}=${response.answer.trim()}`)
    console.log(`Question: ${question}\nAnswer: ${response.answer.trim()}\n`)
  }

  writeFileSync(answersPath, answers.join('\n'), 'utf-8')
  console.log(`Answers saved to: ${answersPath}`)
}
