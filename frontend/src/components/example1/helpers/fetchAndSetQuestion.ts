const AGENTS_API = import.meta.env.VITE_AGENTS_XYZ_API

export const fetchAndSetQuestion = async (
  questionSetter: React.Dispatch<React.SetStateAction<string>>,
  errorSetter: React.Dispatch<React.SetStateAction<string>>,
) => {
  try {
    const response = await fetch(AGENTS_API, {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
      },
    })

    if (!response.ok) {
      throw new Error(`Download page error: ${response.status}`)
    }

    const html = await response.text()

    const questionMatch = html.match(/<p id="human-question">[^<]*<br\s*\/?>\s*([^<]+)<\/p>/)
    if (questionMatch && questionMatch[1]) {
      const question = questionMatch[1].trim()
      questionSetter(question)
      return question
    } else {
      throw new Error('Download question error.')
    }
  } catch (error) {
    errorSetter(`Download question error: ${error}`)
    throw error
  }
}
