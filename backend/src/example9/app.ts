import { sendAnswerToCentralApi } from '../middlewares/sendAnswerToCentralApi/sendAnswerToCentralApi'
import { TASK_NAME } from './constants'
import { extractAllFilesContent } from './helpers/extractAllFilesContent/extractAllFilesContent'
import { categorizeFilesContent } from './helpers/categorizeFilesContent/categorizeFilesContent'

export const handleProcessExample9 = async (): Promise<string | undefined> => {
  const allFilesContent = await extractAllFilesContent()
  console.log('Categorizing files content...')

  const categorizedFiles = await categorizeFilesContent(allFilesContent)

  const example9Response = await sendAnswerToCentralApi({
    taskName: TASK_NAME,
    answer: categorizedFiles,
  })

  console.log(example9Response)
  console.log('categorizedFiles: ', categorizedFiles)

  return example9Response?.message
}

handleProcessExample9()
