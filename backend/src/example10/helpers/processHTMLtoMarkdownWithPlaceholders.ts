import * as cheerio from 'cheerio'
import { readFileSync } from 'fs'
import TurndownService from 'turndown'

export interface IProcessedContent {
  markdown: string
  images: Array<{ src: string; alt: string; context: string }>
  audioFiles: Array<{ src: string; context: string }>
}

export const processHTMLtoMarkdownWithPlaceholders = async (
  htmlPath: string,
): Promise<IProcessedContent> => {
  const html = readFileSync(htmlPath, 'utf-8')
  const $ = cheerio.load(html)

  $('audio').each((_, audioElem) => {
    $(audioElem)
      .contents()
      .filter(function () {
        return (
          this.type === 'text' &&
          $(this).text().trim() === 'Twoja przeglądarka nie obsługuje elementu audio.'
        )
      })
      .remove()
  })

  const images: Array<{ src: string; alt: string; context: string }> = []
  $('img').each((index, element) => {
    const $img = $(element)
    const src = $img.attr('src') || ''
    const alt = $img.attr('alt') || ''
    const imageName = src.split('/').pop() || `image_${index}.png`

    const $figure = $img.closest('figure')
    let figcaptionText = ''

    if ($figure.length > 0) {
      const $figcaption = $figure.find('figcaption')
      if ($figcaption.length > 0) {
        figcaptionText = $figcaption.text().trim()
        $figcaption.replaceWith(
          `\n\nOryginalny Opis zdjęcia przed transkrypcją: ${figcaptionText}\n\n`,
        )
      }
    }

    images.push({
      src,
      alt,
      context: figcaptionText ? `Opis pod zdjęciem: ${figcaptionText}` : '',
    })

    $img.replaceWith(`\n\n[IMAGE_PLACEHOLDER_${imageName}]\n\n`)
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

  for (const audioFile of audioFiles) {
    const audioName = audioFile.src.split('/').pop() || ''
    $('body').append(`\n\n[AUDIO_PLACEHOLDER_${audioName}]\n\n`)
  }

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  })

  $('script, style, noscript').remove()

  const markdown = turndownService.turndown($.html())

  return {
    markdown,
    images,
    audioFiles,
  }
}
