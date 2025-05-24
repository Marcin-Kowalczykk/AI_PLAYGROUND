import * as fs from 'fs'
import * as path from 'path'
import { IExtractedTextContentWithFilename } from '../../model'
import { getTxtFilesContent } from './helpers/getTxtFilesContent'
import { getMp3FilesContent } from './helpers/getMp3FilesContent'
import { getPngFilesContent } from './helpers/getPngFilesContent/getPngFilesContent'

const inputDir = path.join(__dirname, '../../input_files')
const rawDefaultFiles = fs.readdirSync(inputDir)
const rawTxtDefaultFiles = rawDefaultFiles.filter((file) => file.endsWith('.txt'))
const rawMp3tDefaultFiles = rawDefaultFiles.filter((file) => file.endsWith('.mp3'))
const rawPngDefaultFiles = rawDefaultFiles.filter((file) => file.endsWith('.png'))

export const extractAllFilesContent = async (): Promise<IExtractedTextContentWithFilename[]> => {
  console.log('Generating txt files content...')
  const txtFilesContent = getTxtFilesContent(rawTxtDefaultFiles, inputDir)
  console.log('Process finished')
  console.log('Generating mp3 files content...')
  const mp3FilesContent = await getMp3FilesContent(rawMp3tDefaultFiles, inputDir)
  console.log('Process finished')
  console.log('Generating png files content...')
  const pngFilesContent = await getPngFilesContent(rawPngDefaultFiles, inputDir)
  console.log('Process finished')
  console.log('All files content generated:')

  const allFilesContent = [...txtFilesContent, ...pngFilesContent, ...mp3FilesContent]

  console.log('All files content generated:')
  console.log('All Files to categorize: ', allFilesContent)

  return allFilesContent
}
