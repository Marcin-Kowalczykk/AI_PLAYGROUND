import axios from 'axios'

export const handleError = (error: unknown, context: string) => {
  if (axios.isAxiosError(error)) {
    console.error(`Error in ${context}:`, error.message)
  } else if (error instanceof Error) {
    console.error(`Error in ${context}:`, error.message)
  } else {
    console.error(`Error in ${context}:`, error)
  }
}
