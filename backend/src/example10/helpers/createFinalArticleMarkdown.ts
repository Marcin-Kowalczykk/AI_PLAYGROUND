import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export const createFinalArticleMarkdown = async (
  articleMdPathWoAudioAndImages: string,
  imageDescriptionsPath: string,
  transcriptionsPath: string,
  finalArticleMdPath: string,
) => {
  try {
    console.log('Reading preliminary markdown from:', articleMdPathWoAudioAndImages)
    let markdown = readFileSync(articleMdPathWoAudioAndImages, 'utf-8')

    console.log('Looking for descriptions in:', imageDescriptionsPath)
    if (existsSync(imageDescriptionsPath)) {
      const descriptionFiles = readdirSync(imageDescriptionsPath)
      console.log('Found description files:', descriptionFiles)

      for (const descFile of descriptionFiles) {
        const imageName = descFile.replace('-description.txt', '')
        const description = readFileSync(join(imageDescriptionsPath, descFile), 'utf-8')
        const imagePlaceholderRegex = new RegExp(
          String.raw`\\*\[IMAGE\\*_PLACEHOLDER\\*_${imageName.replace(/_/g, String.raw`\\_`)}\\*\]`,
          'g',
        )

        console.log(`Processing image: ${imageName}`)
        console.log(`Looking for placeholder regex: ${imagePlaceholderRegex}`)

        if (markdown.match(imagePlaceholderRegex)) {
          const replacement = `Nazwa zdjęcia: ${imageName} Opis zdjęcia: \n\n${description}`
          markdown = markdown.replace(imagePlaceholderRegex, replacement)
          console.log(`Successfully replaced placeholder for ${imageName}`)
        } else {
          console.log(`Placeholder not found for ${imageName}`)
        }
      }
    } else {
      console.log('Descriptions directory not found:', imageDescriptionsPath)
    }

    console.log('Looking for transcriptions in:', transcriptionsPath)
    if (existsSync(transcriptionsPath)) {
      const transcriptionFiles = readdirSync(transcriptionsPath)
      console.log('Found transcription files:', transcriptionFiles)

      for (const transFile of transcriptionFiles) {
        const audioName = transFile.replace('.txt', '')
        const transcription = readFileSync(join(transcriptionsPath, transFile), 'utf-8')

        const placeholderRegex = new RegExp(
          String.raw`\\*\[AUDIO\\*_PLACEHOLDER\\*_${audioName.replace(/_/g, String.raw`\\_`)}\\*\.mp3\\*\]`,
          'g',
        )

        console.log(`Processing audio: ${audioName}`)
        console.log(`Looking for placeholder regex: ${placeholderRegex}`)

        if (markdown.match(placeholderRegex)) {
          const replacement = `Nazwa nagrania audio: ${audioName}.mp3\n\nTranskrypcja nagrania audio:\n${transcription}`
          markdown = markdown.replace(placeholderRegex, replacement)
          console.log(`Successfully replaced placeholder for ${audioName}`)
        }
      }
    } else {
      console.log('Transcriptions directory not found:', transcriptionsPath)
    }

    writeFileSync(finalArticleMdPath, markdown, 'utf-8')
    console.log(`Final markdown saved to ${finalArticleMdPath}`)
  } catch (error) {
    console.error('Error creating final markdown:', error)
  }
}
