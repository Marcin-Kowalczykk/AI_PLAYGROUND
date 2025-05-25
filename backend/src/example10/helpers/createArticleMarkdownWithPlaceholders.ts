import { existsSync, writeFileSync } from 'fs'
import { processHTMLtoMarkdownWithPlaceholders } from './processHTMLtoMarkdownWithPlaceholders'

export const createArticleMarkdownWithPlaceholders = async (
  articleHtmlPath: string,
  articleMdPathWoAudioAndImages: string,
) => {
  if (!existsSync(articleHtmlPath)) {
    console.error('Article HTML not found. Please run download first.')
    return
  }

  const processedHTMLtoMarkdown = await processHTMLtoMarkdownWithPlaceholders(articleHtmlPath)

  writeFileSync(articleMdPathWoAudioAndImages, processedHTMLtoMarkdown.markdown, 'utf-8')

  console.log('markdown without images and audio saved to:', articleMdPathWoAudioAndImages)
  console.log(`Found ${processedHTMLtoMarkdown.images.length} images to process`)
  console.log(`Found ${processedHTMLtoMarkdown.audioFiles.length} audio files to process`)

  return processedHTMLtoMarkdown
}
