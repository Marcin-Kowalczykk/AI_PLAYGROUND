import axios from 'axios'
import { Conversation, Message } from '../model'

export const sendQuestionToApi = async (
  messages: Message[],
  errorSetter: React.Dispatch<React.SetStateAction<string>>,
  conversationSetter: React.Dispatch<React.SetStateAction<Conversation>>,
) => {
  try {
    const response = await axios.post('/internal.api/get-answer-example2', { messages })

    const responseData = JSON.parse(response.data.answer)

    console.log('Response from OpenAi:', responseData)

    conversationSetter((prev) => [
      ...prev,
      { role: 'human', text: responseData.text, msgID: responseData.msgID },
    ])
    return responseData
  } catch (error) {
    errorSetter(`Error while sending question to API: ${error}`)
    throw error
  }
}
