import { Conversation } from '../model'
import { ISendAnswerToVerify } from './model'

export const sendAnswerToVerify = async (
  body: ISendAnswerToVerify,
  errorSetter: React.Dispatch<React.SetStateAction<string>>,
  conversationSetter: React.Dispatch<React.SetStateAction<Conversation>>,
) => {
  try {
    const response = await fetch('/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Login Error: ${response.status}`)
    }
    const data = await response.json()

    const transformedData = { msgID: data.msgID.toString(), text: data.text }

    console.log('Response from verify:', transformedData)

    conversationSetter((prev) => [
      ...prev,
      { role: 'robot', text: transformedData.text, msgID: transformedData.msgID },
    ])

    return transformedData
  } catch (error) {
    errorSetter(`Login error: ${error}`)
    throw error
  }
}
