export interface IPhotoOperation {
  type: 'REPAIR' | 'DARKEN' | 'BRIGHTEN'
  filename: string
}

export interface IProcessedPhoto {
  url: string
  filename: string
  isProcessed: boolean
  finalUrl?: string
}
