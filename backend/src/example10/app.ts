import 'dotenv/config'
import { join } from 'path'
import { DIR_NAMES, FILE_NAMES } from './constants'
import { downlaodAndSaveArticle } from './helpers/downlaodAndSaveArticle'
import { downloadAndSaveMultimedia } from './helpers/downloadAndSaveMultimedia'
import { downloadAndSaveQuestions } from './helpers/downloadAndSaveQuestions'
import { generateAndSaveImageDescriptions } from './helpers/generateAndSaveImageDescriptions'
import { transcribeAndSaveAudioFile } from './helpers/transcribeAndSaveAudioFile'
import { createFinalArticleMarkdown } from './helpers/createFinalArticleMarkdown'
import { createArticleMarkdownWithPlaceholders } from './helpers/createArticleMarkdownWithPlaceholders'
import { answerQuestionsWithLLM } from './helpers/answerQuestionsWithLLM'
import { sendAnswersExample10 } from './helpers/sendAnswersExample10'

const savedDataPath = join(__dirname, DIR_NAMES.SAVED_DATA_DIR_NAME)
const articleHtmlPath = join(savedDataPath, FILE_NAMES.ARTICLE_HTML_FILE_NAME_DEFAULT)
const articleMdPathWoAudioAndImages = join(
  savedDataPath,
  FILE_NAMES.ARTICLE_MD_FILE_NAME_WO_AUDIO_AND_IMAGES,
)
const questionsPath = join(savedDataPath, FILE_NAMES.QUESTIONS_FILE_NAME)
const finalArticleMdPath = join(savedDataPath, FILE_NAMES.ARTICLE_MD_FILE_NAME_FINAL)
const imagesPath = join(savedDataPath, DIR_NAMES.IMAGES_DIR_NAME)
const imageDescriptionsPath = join(imagesPath, DIR_NAMES.IMAGE_DESCRIPTIONS_DIR_NAME)
const recordsPath = join(savedDataPath, DIR_NAMES.RECORDS_DIR_NAME)
const transcriptionsPath = join(recordsPath, DIR_NAMES.TRANSCRIPTIONS_DIR_NAME)
const answersPath = join(savedDataPath, FILE_NAMES.ANSWERS_FILE)

export const handleProcessExample10 = async (): Promise<string | undefined> => {
  await downlaodAndSaveArticle(savedDataPath, articleHtmlPath)
  await downloadAndSaveQuestions(savedDataPath, questionsPath)
  await downloadAndSaveMultimedia(savedDataPath, imagesPath, recordsPath)
  await createArticleMarkdownWithPlaceholders(articleHtmlPath, articleMdPathWoAudioAndImages)
  await transcribeAndSaveAudioFile(FILE_NAMES.AUDIO_FILE_NAME, transcriptionsPath, recordsPath)
  await generateAndSaveImageDescriptions(imageDescriptionsPath, imagesPath, savedDataPath)
  await createFinalArticleMarkdown(
    articleMdPathWoAudioAndImages,
    imageDescriptionsPath,
    transcriptionsPath,
    finalArticleMdPath,
  )
  await answerQuestionsWithLLM(answersPath, finalArticleMdPath, questionsPath)
  const answerFromCentral = await sendAnswersExample10(answersPath)

  return answerFromCentral?.message
}

// handleProcessExample10()
