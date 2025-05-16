export const extractFlag = (flagString: string | null) => {
  if (!flagString) return ''
  const match = flagString.match(/\{\{FLG:(.+?)\}\}/)
  return match ? match[1] : flagString
}
