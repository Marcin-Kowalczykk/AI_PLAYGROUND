const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const OPENAI_API = import.meta.env.VITE_OPENAI_API

export const fetchAnswerFromOpenAI = async (
  question: string,
  anwerSetter: React.Dispatch<React.SetStateAction<string>>,
  errorSetter: React.Dispatch<React.SetStateAction<string>>,
) => {
  try {
    const response = await fetch(`${OPENAI_API}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: question }],
        max_tokens: 100,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI - communication error: ${response.status}`)
    }

    const data = await response.json()
    anwerSetter(data.choices[0].message.content.trim())

    return data.choices[0].message.content.trim()
  } catch (error) {
    errorSetter(`OpenAI - communication error: ${error}`)
  }
}
