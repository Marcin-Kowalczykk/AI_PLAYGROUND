import { DEFAULT_BODY } from '../constants'
import { IBody, Answer } from '../model'

export const sendAnswerToVerify = async (
  body: IBody,
  answerSetter: React.Dispatch<React.SetStateAction<Answer>>,
  errorSetter: React.Dispatch<React.SetStateAction<string>>,
) => {
  try {
    const response = await fetch('/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body ? body : DEFAULT_BODY),
    })

    if (!response.ok) {
      throw new Error(`Login Error: ${response.status}`)
    }
    const data = await response.json()
    answerSetter({ msgID: data.msgID.toString(), text: data.text })
    return data
  } catch (error) {
    errorSetter(`Login error: ${error}`)
    throw error
  }
}
