import path from 'path'
import fs from 'fs'
import { IDoc, TextSplitter } from '../../middlewares/splitTextService'
import { askOpenAI } from '../../middlewares/askOpenAI/askOpenAi'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

const defaultFilesDirPath = path.join(__dirname, 'defaultFiles')
const splitFilesDirPath = path.join(__dirname, 'splitFiles')
const extractedFilesDirPath = path.join(__dirname, 'extractedFiles')

const loremDefaultFilePath = path.join(defaultFilesDirPath, 'lorem_ipsum.md')
const exampleArticleDefaultFilePath = path.join(defaultFilesDirPath, 'example_article.md')
const sourceDefaultFilePath = path.join(defaultFilesDirPath, 'source.md')
const sourceExtractedFilePath = path.join(extractedFilesDirPath, 'source.md_extracted.md')

const textSplitter = new TextSplitter()

const splitText = async (filePath: string, method: 'lines' | 'linesBreak') => {
  const newJsonFileName = path.basename(filePath) + '.json'
  const outputFilePath = path.join(splitFilesDirPath, newJsonFileName)
  const fileContent = fs.readFileSync(filePath, 'utf8')

  if (fs.existsSync(outputFilePath)) {
    console.log(`File: ${newJsonFileName} already exists, skipping.`)
    return
  }

  let chunks: IDoc[]
  const text = fs.readFileSync(filePath, 'utf8')
  if (method === 'lines') {
    chunks = await textSplitter.split(text, 1000)
  } else if (method === 'linesBreak') {
    chunks = await Promise.all(
      fileContent.split('\n\n').map(async (chunk) => await textSplitter.document(chunk)),
    )
  } else {
    throw new Error('Unknown split method')
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(chunks, null, 2), 'utf8')
  console.log(`File: ${newJsonFileName} has been created`)
}

const extractImportantContentFromSourceFile = async (fileContentPath: string) => {
  const extractedSourceArticleFileName = path.basename(fileContentPath) + '_extracted.md'
  const extractedSourceArticleFilePath = path.join(
    extractedFilesDirPath,
    extractedSourceArticleFileName,
  )

  if (fs.existsSync(extractedSourceArticleFilePath)) {
    console.log(`File: ${extractedSourceArticleFileName} already exists, skipping.`)
    return
  }

  console.log('Extracting important content from source file...')

  const fileContent = fs.readFileSync(fileContentPath, 'utf8')

  const systemPrompt = `
You are a helpful assistant that extracts important content from a source article.`

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: `<document>${fileContent}</document>
      
      Please extract all the information from the article's content related to tools, apps, or software, including links and descriptions in markdown format. Ensure the list items are unique. Always separate each tool with a double line break. Respond only with the concise content and nothing else.`,
    },
  ]

  const extractedSourceArticle = await askOpenAI({
    systemPrompt,
    messages,
    model: 'gpt-4o-mini',
  })

  fs.writeFileSync(extractedSourceArticleFilePath, extractedSourceArticle.answer, 'utf8')
  console.log(`File: ${extractedSourceArticleFileName} has been created`)

  return extractedSourceArticle.answer
}

const splitAndSaveSourceArticle = async () => {
  await extractImportantContentFromSourceFile(sourceDefaultFilePath)

  await splitText(sourceExtractedFilePath, 'linesBreak')
}

splitText(loremDefaultFilePath, 'lines')
splitText(exampleArticleDefaultFilePath, 'lines')
splitAndSaveSourceArticle()
