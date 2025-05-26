import express, { Request, Response } from 'express'
import cors from 'cors'
import { descriptions } from './descriptions/destriptions'
import 'dotenv/config'
import { getAnswerFromOpenAiExample2 } from './example2/getAnswerFromOpenAiExample2'
import { Message } from './example2/model'
import { sendFinalAnswerExample3 } from './example3/app'
import { sendFinalAnswerExample5 } from './example5/app'
import { openAiConfig } from './middlewares/askOpenAI/openAiConfig'
import path from 'path'
import fs from 'fs'
import { sendFinalAnswerExample6 } from './example6/app'
import { analyzeImages } from './example7/app'
import { handleMulterError } from './middlewares/multer/handleMulterError/handleMulterError'
import { handleProcessExample8 } from './example8/app'
import { handleProcessExample9 } from './example9/app'
import { handleProcessExample10 } from './example10/app'

const app = express()
const port = 3000
const api = '/internal.api'

app.use(cors())
app.use(express.json())

app.use((req, _res, next) => {
  console.log('✅ Someone just sent a request: ', req.method, req.url)
  next()
})

app.get(`${api}/descriptions`, async (_req: Request, res: Response) => {
  try {
    res.json({ descriptions })
  } catch (error) {
    console.error('Error in GET /descriptions:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
})
//example2
app.post(`${api}/get-answer-example2`, async (req: Request, res: Response) => {
  try {
    console.log('/Get-answer-example2 Request body: (all messages w/o system prompt)', req.body)

    const { messages } = req.body as { messages: Message[] }

    if (!messages) {
      console.error('Question parameter is required')
    }

    const answer = await getAnswerFromOpenAiExample2(openAiConfig, messages)
    console.log('Current answer from OpenAI:', answer)

    res.status(200).json({ answer })
  } catch (error) {
    console.error('Error in POST /get-answer: ', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
//example3
app.get(`${api}/get-flag-example3`, async (_req: Request, res: Response) => {
  const answer = await sendFinalAnswerExample3()

  try {
    res.json({ flag: answer?.message })
  } catch (error) {
    console.error('Error in GET /get-flag-example3:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
})
//example4
app.get(`${api}/get-files-example4`, async (_req: Request, res: Response) => {
  try {
    const dirPath = path.join(__dirname, 'example4')
    const files = fs.readdirSync(dirPath)
    const result: Record<string, string> = {}

    files.forEach((file) => {
      const filePath = path.join(dirPath, file)
      result[file] = fs.readFileSync(filePath, 'utf-8')
    })

    res.json(result)
  } catch (error) {
    console.error('Error in GET /get-flag-example4:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
})
//example5
app.get(`${api}/get-flag-example5`, async (_req: Request, res: Response) => {
  const answer = await sendFinalAnswerExample5()

  try {
    res.json({ flag: answer?.message })
  } catch (error) {
    console.error('Error in GET /get-flag-example5:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
})
//example6
app.get(`${api}/get-flag-example6`, async (_req: Request, res: Response) => {
  const answer = await sendFinalAnswerExample6()

  try {
    res.json({ flag: answer?.message })
  } catch (error) {
    console.error('Error in GET /get-flag-example6:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
})
// Example7
app.post(
  `${api}/post-images-example7`,
  handleMulterError,
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Files from frontend: ', req.files)

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({ error: 'No images provided' })
        return
      }

      const cityName = await analyzeImages(req.files)

      res.json({ city: cityName })
    } catch (error) {
      console.error('Error in POST /post-images-example7:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
)
//example8
app.get(`${api}/get-example8-result`, async (_req: Request, res: Response) => {
  const result = await handleProcessExample8()

  try {
    res.json({ result })
  } catch (error) {
    console.error('Error in GET /get-flag-example8:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
})
//example9
app.get(`${api}/get-flag-example9`, async (_req: Request, res: Response) => {
  const result = await handleProcessExample9()

  try {
    res.json({ flag: result?.flag?.message })
  } catch (error) {
    console.error('Error in GET /get-flag-example9:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
})
//example10
app.get(`${api}/get-flag-example10`, async (_req: Request, res: Response) => {
  const flag = await handleProcessExample10()

  try {
    res.json({ flag })
  } catch (error) {
    console.error('Error in GET /get-flag-example10:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
})

app.listen(port, () => {
  console.log(`Backend works on http://localhost:${port}`)
})
