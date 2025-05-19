export const combineTranscriptionsObjectIntoText = (
  transcriptions: Record<string, string>,
): string => {
  return Object.entries(transcriptions)
    .map(([fileName, content]) => `=== Transkrypcja z pliku ${fileName} ===\n${content}\n`)
    .join('\n')
}
