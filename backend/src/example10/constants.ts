import 'dotenv/config'

export const EXAMPLE_10_QUESTIONS_URL = `https://c3ntrala.ag3nts.org/data/${process.env.POLIGON_API_KEY}/arxiv.txt`
export const EXAMPLE_10_ARTICLE_URL = 'https://c3ntrala.ag3nts.org/dane/arxiv-draft.html'

export const DIR_NAMES = {
  SAVED_DATA_DIR_NAME: 'savedData',
  IMAGE_DESCRIPTIONS_DIR_NAME: 'descriptionsMadeByLLM',
  IMAGES_DIR_NAME: 'images',
  RECORDS_DIR_NAME: 'records',
  TRANSCRIPTIONS_DIR_NAME: 'transcriptions',
} as const

export const FILE_NAMES = {
  ARTICLE_HTML_FILE_NAME_DEFAULT: 'arxiv-article-default.html',
  ARTICLE_MD_FILE_NAME_FINAL: 'arxiv-article-final.html',
  ARTICLE_MD_FILE_NAME_WO_AUDIO_AND_IMAGES: 'arxiv-article-wo-audio-and-images.md',
  ANSWERS_FILE: 'arxiv-answers.txt',
  QUESTIONS_FILE_NAME: 'arxiv-questions.txt',
  AUDIO_FILE_NAME: 'rafal_dyktafon.mp3',
} as const
