import TurndownService from 'turndown'
import axios from 'axios'

export const convertHtmlToMarkdown = async (url: string): Promise<string> => {
  try {
    const response = await axios.get(url)
    const htmlContent = response.data

    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    })

    const markdown = turndownService.turndown(htmlContent)
    return markdown
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error)
    throw error
  }
}
