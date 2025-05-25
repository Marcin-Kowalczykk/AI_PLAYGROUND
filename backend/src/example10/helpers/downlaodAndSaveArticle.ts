import axios from 'axios'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { EXAMPLE_10_ARTICLE_URL } from '../constants'

export const downlaodAndSaveArticle = async (savedDataPath: string, articleHtmlPath: string) => {
  try {
    if (!existsSync(savedDataPath)) {
      mkdirSync(savedDataPath, { recursive: true })
    }

    if (existsSync(articleHtmlPath)) {
      console.log(`Article already exists at ${articleHtmlPath}, skipping download`)
      return
    }

    const articleResponse = await axios.get(EXAMPLE_10_ARTICLE_URL)

    writeFileSync(articleHtmlPath, articleResponse.data, 'utf-8')
    console.log(`Article saved to ${articleHtmlPath}`)
  } catch (error) {
    console.error('Error during article download: ', error)
  }
}
