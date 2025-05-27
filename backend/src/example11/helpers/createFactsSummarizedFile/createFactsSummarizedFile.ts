import { existsSync } from 'fs'
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { askOpenAI } from '../../../middlewares/askOpenAI/askOpenAi'
import { FILE_NAMES } from '../../constants'
import { generateFactsFileUserPrompt } from './generateFactsFileUserPrompt'
import { SYSTEM_PROMPT } from './constants'

export const createFactsSummarizedFile = async (
  factFiles: string[],
  factsDir: string,
  factsSummarizedTxtFile: string,
  factsSummarizedMdFile: string,
) => {
  try {
    if (existsSync(factsSummarizedTxtFile) && existsSync(factsSummarizedMdFile)) {
      console.log(
        `File: ${FILE_NAMES.FACTS_SUMMARIZED_TXT} and ${FILE_NAMES.FACTS_SUMMARIZED_MD} already exists. Skipping...`,
      )
      return
    }

    console.log('Start generating facts summary...')

    let allSummariesTxt = ''
    let allSummariesMd = '# Podsumowanie faktów\n\n'

    for (const fileName of factFiles) {
      const filePath = join(factsDir, fileName)
      const documentContent = readFileSync(filePath, 'utf-8')
      console.log(`Processing file: ${fileName} ...`)

      const response = await askOpenAI({
        systemPrompt: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: generateFactsFileUserPrompt(documentContent) }],
        model: 'gpt-4o',
      })

      allSummariesTxt += `\n=== ${fileName} ===\n${response.answer}\n`
      allSummariesMd += `## ${fileName}\n\n${response.answer}\n\n`
    }

    writeFileSync(factsSummarizedTxtFile, allSummariesTxt, 'utf-8')
    writeFileSync(factsSummarizedMdFile, allSummariesMd, 'utf-8')
    console.log('Summaries have been saved to:', factsSummarizedTxtFile)
    console.log('Markdown summary has been saved to:', factsSummarizedMdFile)
  } catch (error) {
    console.error('Error processing facts:', error)
  }
}
