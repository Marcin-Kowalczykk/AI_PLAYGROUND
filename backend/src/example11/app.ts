import { readdirSync } from 'fs'
import { join } from 'path'
import { DIR_NAMES, FILE_NAMES } from './constants'
import { createFactsSummarizedFile } from './helpers/createFactsSummarizedFile/createFactsSummarizedFile'
import { createReportsKeywordsFile } from './helpers/createReportsKeywordsFile/createReportsKeywordsFile'
import { ISendAnswerToCentralApiResponse } from '../middlewares/sendAnswerToCentralApi/model'
import { sendAnswerExample11 } from './helpers/sendAnswerExample11'

const FACTS_DIR = join(__dirname, DIR_NAMES.DEFAULT_FILES, DIR_NAMES.FACTS)
const REPORTS_DIR = join(__dirname, DIR_NAMES.DEFAULT_FILES, DIR_NAMES.REPORTS)

const FACTS_SUMMARIZED_TXT_FILE = join(
  __dirname,
  DIR_NAMES.GENERATED_FILES,
  FILE_NAMES.FACTS_SUMMARIZED_TXT,
)

const FACTS_SUMMARIZED_MD_FILE = join(
  __dirname,
  DIR_NAMES.GENERATED_FILES,
  FILE_NAMES.FACTS_SUMMARIZED_MD,
)

const REPORTS_KEYWORDS_FILE = join(
  __dirname,
  DIR_NAMES.GENERATED_FILES,
  FILE_NAMES.REPORTS_KEYWORDS,
)

const factFiles = readdirSync(FACTS_DIR)

export const handleProcessExample11 = async (): Promise<
  ISendAnswerToCentralApiResponse | undefined
> => {
  await createFactsSummarizedFile(
    factFiles,
    FACTS_DIR,
    FACTS_SUMMARIZED_TXT_FILE,
    FACTS_SUMMARIZED_MD_FILE,
  )
  await createReportsKeywordsFile(REPORTS_DIR, FACTS_SUMMARIZED_MD_FILE, REPORTS_KEYWORDS_FILE)
  const result = await sendAnswerExample11(REPORTS_KEYWORDS_FILE)

  return result
}

handleProcessExample11()
// uncomment line above if you want to run process from terminal npm run start:example8 or bun example8
