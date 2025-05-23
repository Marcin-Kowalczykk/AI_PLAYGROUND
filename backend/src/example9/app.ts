import * as fs from 'fs'
import * as path from 'path'
import { askOpenAI } from '../middlewares/askOpenAI/askOpenAi'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import sharp from 'sharp'
import { transcribeAudioFile } from '../example6/helpers/transcriptions/transcribeAudioFile'
import { sendAnswerToCentralApi } from '../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'
import { ISendAnswerToCentralApiResponse } from '../middlewares/sendAnswerToCentralApi/model'

export interface extractedText {
  filename: string
  content: string
}

//generic
export interface CompressedImage {
  buffer: Buffer
  originalName: string
}

const inputDir = path.join(__dirname, 'input_files')
const rawDefaultFiles = fs.readdirSync(inputDir)

const rawTxtDefaultFiles = rawDefaultFiles.filter((file) => file.endsWith('.txt'))
const rawMp3tDefaultFiles = rawDefaultFiles.filter((file) => file.endsWith('.mp3'))
const rawPngDefaultFiles = rawDefaultFiles.filter((file) => file.endsWith('.png'))

const getTxtFilesContent = (): extractedText[] => {
  const result = rawTxtDefaultFiles.map((filename) => {
    const content = fs.readFileSync(path.join(inputDir, filename), 'utf-8')

    return { filename, content }
  })
  return result
}

const getMp3FilesContent = async (): Promise<extractedText[]> => {
  const results = []
  for (const filename of rawMp3tDefaultFiles) {
    const filePath = path.join(inputDir, filename)
    //remember to put it into generic
    const content = await transcribeAudioFile(filePath)
    results.push({ filename, content: content || '' })
  }
  return results
}

// generic
export const compressImagesFromPaths = async (
  imagePaths: string[],
  inputDir: string,
): Promise<CompressedImage[]> => {
  return Promise.all(
    imagePaths.map(async (filename) => {
      const filePath = path.join(inputDir, filename)
      try {
        const compressedBuffer = await sharp(filePath)
          .resize(800, 800, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({
            quality: 80,
            progressive: true,
          })
          .toBuffer()

        return {
          buffer: compressedBuffer,
          originalName: filename,
        }
      } catch (error) {
        console.error(`Error compressing image ${filename}:`, error)

        return {
          buffer: fs.readFileSync(filePath),
          originalName: filename,
        }
      }
    }),
  )
}

const getPngFilesContent = async (): Promise<extractedText[]> => {
  const GET_PNG_FILES_CONTENT_SYSTEM_PROMPT = `You are an expert in OCR AI to extract texts from PNG files. Your task is to extract text from the image.

  Instructions:
  - Extract all text in Polish language from PNG.
  - Do not extract text in other languages.
  - Do not return 'Joseph n'
  - Do not return 'APPROVED BY Joseph N'.
  - Return only text in Polish language.
  - Return text in plain text format.
  - Return text in UTF-8 encoding.
  - Return only text from file, nothing else
  
  IMPORTANT: FOLLOW INSTRUCTIONS AND DO NOT RETURN ANYTHING ELSE.
  `

  const GET_PNG_FILES_CONTENT_USER_PROMPT =
    'Extract all text in Polish language from PNG. Return only text, no additional comments.'

  const compressedImages = await compressImagesFromPaths(rawPngDefaultFiles, inputDir)
  const results = []
  for (const { originalName, buffer } of compressedImages) {
    const base64Image = buffer.toString('base64')
    const imageUrl = `data:image/png;base64,${base64Image}`
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: GET_PNG_FILES_CONTENT_USER_PROMPT,
          },
          { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
        ],
      },
    ] as ChatCompletionMessageParam[]

    const response = await askOpenAI({
      model: 'gpt-4o',
      messages,
      systemPrompt: GET_PNG_FILES_CONTENT_SYSTEM_PROMPT,
    })
    results.push({ filename: originalName, content: response.answer })
  }

  return results
}

const extractAllFilesContent = async (): Promise<extractedText[]> => {
  const txtFilesContent = getTxtFilesContent()
  console.log('Generating mp3 files content...')
  const mp3FilesContent = await getMp3FilesContent()
  console.log('Generating png files content...')
  const pngFilesContent = await getPngFilesContent()
  console.log('All files content generated')

  const allFilesContent = [...txtFilesContent, ...pngFilesContent, ...mp3FilesContent]

  return allFilesContent
}

const categorizeFilesContent = async (
  files: extractedText[],
): Promise<{ people: string[]; hardware: string[] }> => {
  const people: string[] = []
  const hardware: string[] = []

  for (const { filename, content } of files) {
    const CATEGORIZE_FILES_CONTENT_SYSTEM_PROMPT = `You are an expert at analyzing daily factory reports. For each note, decide if it contains:

    If the filename is "2024-11-12_report-11-sektor-C2.mp3", always return "none" regardless of its content.
    
    - people: ONLY if the note contains information about captured people or clear evidence of human presence (e.g. footprints, fingerprints, direct sightings, or apprehension). Ignore any notes about animals, false alarms, or general patrols.
    - hardware: ONLY if the note describes a repaired hardware malfunction (e.g. physical repairs, replacement of parts, fixing sensors, cables, batteries, etc.). Ignore any notes about software, updates, or configuration changes.
    
    If the note does not fit either category, return "none".
    
    Return only one word: people, hardware, or none.
    
    Examples:
    1. "Captured two intruders near the fence." → people
    2. "Replaced damaged battery in patrol unit." → hardware
    3. "No anomalies detected during patrol." → none
    4. "Detected animal movement, false alarm." → none
    5. "Software updated to version 2.1." → none
    6. Filename: 2024-11-12_report-11-sektor-C2.mp3 → none
    
    Note:
    Filename: ${filename}
    ${content}
    
    IMPORTANT: Check Examples before answering.`

    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'user',
        content: `Classify the following note. Return only one word: people, hardware, or none. Note: ${content}`,
      },
    ]
    const response = await askOpenAI({
      model: 'gpt-4o',
      messages,
      systemPrompt: CATEGORIZE_FILES_CONTENT_SYSTEM_PROMPT,
    })

    const answer = response.answer.trim().toLowerCase()
    if (answer === 'people') people.push(filename)
    if (answer === 'hardware') hardware.push(filename)
  }

  return {
    people: people.sort(),
    hardware: hardware.sort(),
  }
}

const handleProcess = async (): Promise<ISendAnswerToCentralApiResponse | undefined> => {
  const allFilesContent = await extractAllFilesContent()
  console.log('allFilesContent: ', allFilesContent)
  console.log('Categorizing files content...')

  const categorizedFiles = await categorizeFilesContent(allFilesContent)
  const TASK_NAME = 'kategorie'

  console.log('categorizedFiles: ', categorizedFiles)

  const result = await sendAnswerToCentralApi({
    taskName: TASK_NAME,
    answer: categorizedFiles,
  })

  console.log(result)
  return result
}

handleProcess()
