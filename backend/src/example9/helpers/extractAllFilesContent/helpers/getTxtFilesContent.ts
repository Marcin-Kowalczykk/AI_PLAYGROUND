import * as fs from 'fs'
import * as path from 'path'
import { IExtractedTextContentWithFilename } from '../../../model'

export const getTxtFilesContent = (
  files: string[],
  inputDir: string,
): IExtractedTextContentWithFilename[] => {
  const result = files.map((filename) => {
    const content = fs.readFileSync(path.join(inputDir, filename), 'utf-8')

    return { filename, content }
  })
  return result
}
