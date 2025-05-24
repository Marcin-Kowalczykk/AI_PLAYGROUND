export interface ITranscribeFilesFromDirectory {
  directory: string
  fileExtension?: string
  returnAs?: 'object' | 'text'
}
