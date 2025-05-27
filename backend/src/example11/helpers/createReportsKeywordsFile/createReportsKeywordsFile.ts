import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { askOpenAI } from '../../../middlewares/askOpenAI/askOpenAi'
import { FILE_NAMES } from '../../constants'
import { IReportKeywords } from './model'
import { REPORTS_KEYWORDS_SYSTEM_PROMPT } from './constants'
import { generateReportKeywordsPromptV2 } from './generateReportKeywordsPromptV2'

export const createReportsKeywordsFile = async (
  reportsDir: string,
  factsSummarizedFile: string,
  reportsKeywordsFile: string,
) => {
  try {
    if (existsSync(reportsKeywordsFile)) {
      console.log(`File: ${FILE_NAMES.REPORTS_KEYWORDS} already exists. Skipping...`)
      return
    }

    console.log('Start processing reports...')

    const factsSummary = readFileSync(factsSummarizedFile, 'utf-8')

    const reportFiles = readdirSync(reportsDir)
    const reportKeywords: IReportKeywords = {}

    for (const fileName of reportFiles) {
      console.log(`Processing file: ${fileName} ...`)
      const filePath = join(reportsDir, fileName)
      const content = readFileSync(filePath, 'utf-8')

      const response = await askOpenAI({
        systemPrompt: REPORTS_KEYWORDS_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: generateReportKeywordsPromptV2(factsSummary, content, fileName),
          },
        ],
        model: 'gpt-4o',
      })

      reportKeywords[fileName] = response.answer
    }

    writeFileSync(reportsKeywordsFile, JSON.stringify(reportKeywords, null, 2), 'utf-8')
    console.log('Report keywords have been saved to:', reportsKeywordsFile)
  } catch (error) {
    console.error('Error processing reports:', error)
  }
}
