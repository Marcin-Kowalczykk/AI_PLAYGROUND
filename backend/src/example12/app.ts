import * as fs from 'fs'
import * as path from 'path'
import { IDoc, TextSplitter } from '../middlewares/splitTextService'
import {
  initializeAndSaveQdrantCollectionWithData,
  searchFromQdrantCollectionByOpenAi,
} from '../middlewares/qdrantVectorService/qdrantVectorService'
import { sendAnswerToCentralApi } from '../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'
import { askOpenAI } from '../middlewares/askOpenAI/askOpenAi'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

const DEFAULT_FILES_DIR = path.join(__dirname, 'files_from_factory')

const COLLECTION_NAME = 'example12'

const QUERY_TO_DATABASE_EXAMPLE12 =
  'W raporcie, z którego dnia znajduje się wzmianka o kradzieży prototypu broni?'

const textSplitter = new TextSplitter()

const getDateFromFilename = (filename: string): string => {
  const match = filename.match(/(\d{4})_(\d{2})_(\d{2})/)
  if (!match) throw new Error(`Invalid file format: ${filename}`)

  return `${match[1]}-${match[2]}-${match[3]}`
}

interface IReport {
  date: string
  text: string
}

const createReportsArray = (): IReport[] => {
  const files = fs.readdirSync(DEFAULT_FILES_DIR).filter((f) => f.endsWith('.txt'))
  return files.map((filename) => {
    const filePath = path.join(DEFAULT_FILES_DIR, filename)
    const text = fs.readFileSync(filePath, 'utf-8')
    const date = getDateFromFilename(filename)

    return { date, text }
  })
}

export const createReportsWithMetaData = async (reports: IReport[]): Promise<IDoc[]> => {
  const reportsWithMetaData = await Promise.all(
    reports.map(async ({ date, text }) => {
      const reportWithMetdaData = await textSplitter.document(text, { date })
      return reportWithMetdaData
    }),
  )

  return reportsWithMetaData
}

//make it generic and move to middleware and type it
export const relevanceCheck = async (searchResultsFromQdrant: any[], query: string) => {
  const relevanceChecks = await Promise.all(
    searchResultsFromQdrant.map(async (result) => {
      const systemPrompt =
        'You are a helpful assistant that determines if a given text is relevant to a query. Respond with 1 if relevant, 0 if not relevant.'
      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'user',
          content: `Query: ${query}\nText: ${result.payload?.text}`,
        },
      ]

      const relevanceCheck = await askOpenAI({
        systemPrompt,
        messages,
      })
      const isRelevant = relevanceCheck.answer === '1'

      console.log('result: ', result)
      console.log('isRelevant: ', isRelevant)
      return { ...result, isRelevant }
    }),
  )

  return relevanceChecks.filter((result) => result.isRelevant)
}

const handleProcessExample12 = async () => {
  const reports = createReportsArray()
  const reportsWithMetaData = await createReportsWithMetaData(reports)
  await initializeAndSaveQdrantCollectionWithData(COLLECTION_NAME, reportsWithMetaData, 'date')

  const datesArray = reports.map((report) => report.date)

  //idk if its required results from database are the same
  let qdrantFilterShould = undefined
  if (datesArray.length > 0) {
    qdrantFilterShould = {
      should: datesArray.map((date) => ({
        key: 'date',
        match: { value: date },
      })),
    }
  }

  const searchResultsFromQdrant = await searchFromQdrantCollectionByOpenAi(
    COLLECTION_NAME,
    QUERY_TO_DATABASE_EXAMPLE12,
    qdrantFilterShould,
    10,
  )

  const relevantResults = await relevanceCheck(searchResultsFromQdrant, QUERY_TO_DATABASE_EXAMPLE12)

  console.table(
    relevantResults.map((result) => ({
      Date: result.payload?.date || '',
      Text: (result.payload?.text as string)?.slice(0, 45) + '...' || '',
      Score: result.score,
    })),
  )

  const answer = await sendAnswerToCentralApi({
    taskName: 'wektory',
    answer: searchResultsFromQdrant[0].payload?.date || '',
  })

  console.log('answer from centrala: ', answer?.message)
}

handleProcessExample12()
