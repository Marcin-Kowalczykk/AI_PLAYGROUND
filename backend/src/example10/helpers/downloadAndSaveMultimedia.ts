import axios from 'axios'
import { readFileSync, writeFileSync } from 'fs'
import { existsSync, mkdirSync } from 'fs'
import { EXAMPLE_10_ARTICLE_URL } from '../constants'
import { join } from 'path'
import { FILE_NAMES } from '../constants'
import * as cheerio from 'cheerio'

export const downloadAndSaveMultimedia = async (
  savedDataPath: string,
  imagesPath: string,
  recordsPath: string,
) => {
  try {
    if (!existsSync(imagesPath)) {
      mkdirSync(imagesPath, { recursive: true })
    }
    if (!existsSync(recordsPath)) {
      mkdirSync(recordsPath, { recursive: true })
    }

    const html = readFileSync(
      join(savedDataPath, FILE_NAMES.ARTICLE_HTML_FILE_NAME_DEFAULT),
      'utf-8',
    )
    const $ = cheerio.load(html)

    const imagePromises: Promise<void>[] = []
    $('img').each((index, element) => {
      const src = $(element).attr('src')
      if (src) {
        const imageUrl = new URL(src, EXAMPLE_10_ARTICLE_URL).toString()
        const imageName = src.split('/').pop()
        const imagePath = join(imagesPath, imageName || `image_${index}.png`)

        if (!existsSync(imagePath)) {
          const promise = axios
            .get(imageUrl, { responseType: 'arraybuffer' })
            .then((response) => {
              writeFileSync(imagePath, response.data)
              console.log(`Image saved: ${imagePath}`)
            })
            .catch((error) => {
              console.error(`Error downloading image ${imageUrl}:`, error)
            })
          imagePromises.push(promise)
        } else {
          console.log(`Image already exists: ${imagePath}`)
        }
      }
    })

    const audioFiles: Array<{ src: string; context: string }> = []
    const processedAudioNames = new Set<string>()

    $('audio, a[href$=".mp3"]').each((index, element) => {
      const $elem = $(element)
      const src = $elem.attr('src') || $elem.attr('href') || ''
      const audioName = src.split('/').pop() || `audio_${index}.mp3`

      if (src.endsWith('.mp3')) {
        if (!processedAudioNames.has(audioName)) {
          processedAudioNames.add(audioName)
          const context = $elem.parent().text().trim()
          audioFiles.push({ src, context })
          $elem.replaceWith(`\n\n[AUDIO_PLACEHOLDER_${audioName}]\n\n`)
        } else {
          $elem.remove()
        }
      }
    })

    const audioPromises: Promise<void>[] = []
    for (const audioFile of audioFiles) {
      const audioName = audioFile.src.split('/').pop() || ''
      $('body').append(`\n\n[AUDIO_PLACEHOLDER_${audioName}]\n\n`)
    }
    await Promise.all([...imagePromises, ...audioPromises])
  } catch (error) {
    console.error('Error during multimedia download:', error)
  }
}
