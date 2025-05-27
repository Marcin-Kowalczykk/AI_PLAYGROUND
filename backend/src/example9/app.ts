import { sendAnswerToCentralApi } from '../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'
import { TASK_NAME } from './constants'
import { extractAllFilesContent } from './helpers/extractAllFilesContent/extractAllFilesContent'
import { categorizeFilesContent } from './helpers/categorizeFilesContent/categorizeFilesContent'
import { ICategorizeFilesContentResponse } from './helpers/categorizeFilesContent/model'
import { ISendAnswerToCentralApiResponse } from '../middlewares/sendAnswerToCentralApi/model'

export const handleProcessExample9 = async (): Promise<{
  flag: ISendAnswerToCentralApiResponse | undefined
  categorizedFiles: ICategorizeFilesContentResponse
}> => {
  const allFilesContent = await extractAllFilesContent()
  console.log('Categorizing files content...')

  const categorizedFiles = await categorizeFilesContent(allFilesContent)

  const example9Response = await sendAnswerToCentralApi({
    taskName: TASK_NAME,
    answer: categorizedFiles,
  })

  console.log(example9Response)
  console.log('categorizedFiles: ', categorizedFiles)

  return {
    flag: example9Response,
    categorizedFiles,
  }
}

// handleProcessExample9()
// uncomment line above if you want to run process from terminal npm run start:example8 or bun example8
