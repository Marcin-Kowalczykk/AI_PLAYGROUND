export const combineTranscriptionsObjectIntoText = (
  transcriptions: Record<string, string>,
): string => {
  return Object.entries(transcriptions)
    .map(([fileName, content]) => `=== Transcription from file ${fileName} ===\n${content}\n`)
    .join('\n')
}
