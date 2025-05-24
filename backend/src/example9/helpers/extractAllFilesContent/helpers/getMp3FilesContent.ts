import path from 'path'
import { transcribeAudioFileFromPath } from '../../../../middlewares/transcribeFiles/transcribeAudioFileFromPath'
import { IExtractedTextContentWithFilename } from '../../../model'

export const getMp3FilesContent = async (
  files: string[],
  inputDir: string,
): Promise<IExtractedTextContentWithFilename[]> => {
  const results = []
  for (const filename of files) {
    const filePath = path.join(inputDir, filename)
    const content = await transcribeAudioFileFromPath(filePath)
    results.push({ filename, content: content || '' })
  }
  return results
}
