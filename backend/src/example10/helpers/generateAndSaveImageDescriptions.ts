import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as cheerio from 'cheerio'
import { FILE_NAMES } from '../constants'
import { askOpenAI } from '../../middlewares/askOpenAI/askOpenAi'

const generateImageDescription = async (
  imagePath: string,
  context?: string,
): Promise<string | undefined> => {
  try {
    const imageFile = readFileSync(imagePath)
    const base64Image = imageFile.toString('base64')

    const response = await askOpenAI({
      systemPrompt:
        'Jesteś ekspertem w analizie i opisywaniu obrazów. Twoim zadaniem jest stworzenie szczegółowego opisu obrazu w języku polskim.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Opisz szczegółowo to zdjęcie. ${context ? `Uwzględnij kontekst: ${context}` : ''} Opis powinien być w języku polskim i zawierać najważniejsze elementy widoczne na zdjęciu.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      model: 'gpt-4o',
      max_tokens: 500,
    })

    return response.answer
  } catch (error) {
    console.error(`Error generating description for ${imagePath}:`, error)
  }
}

export const generateAndSaveImageDescriptions = async (
  imageDescriptionsPath: string,
  imagesPath: string,
  savedDataPath: string,
) => {
  try {
    if (!existsSync(imageDescriptionsPath)) {
      mkdirSync(imageDescriptionsPath, { recursive: true })
    }

    const imageFiles = readdirSync(imagesPath).filter((file) =>
      file.match(/\.(jpg|jpeg|png|gif)$/i),
    )

    for (const imageFile of imageFiles) {
      const imagePath = join(imagesPath, imageFile)
      const descriptionFileName = `${imageFile}-description.txt`
      const descriptionPath = join(imageDescriptionsPath, descriptionFileName)

      if (existsSync(descriptionPath)) {
        console.log(`Description already exists for ${imageFile}, skipping...`)
        continue
      }

      const html = readFileSync(
        join(savedDataPath, FILE_NAMES.ARTICLE_HTML_FILE_NAME_DEFAULT),
        'utf-8',
      )
      const $ = cheerio.load(html)
      const $img = $(`img[src*="${imageFile}"]`)
      let context = ''

      if ($img.length > 0) {
        const $figure = $img.closest('figure')
        if ($figure.length > 0) {
          const $figcaption = $figure.find('figcaption')
          if ($figcaption.length > 0) {
            context = $figcaption.text().trim()
          }
        }
      }

      const description = await generateImageDescription(imagePath, context)

      if (description) {
        writeFileSync(descriptionPath, description, 'utf-8')
        console.log(`Description saved for ${imageFile}`)
      } else {
        console.error(`Failed to generate description for ${imageFile}`)
      }
    }
  } catch (error) {
    console.error('Error during image description generation:', error)
  }
}
