import React, { useState } from 'react'
import { DEFAULT_BODY } from './constants'
import { sendAnswerToVerify } from './helpers/sendAnswerToVerify'
import Description from './Description/Description'
import { Conversation, Message } from './model'
import { sendQuestionToApi } from './helpers/sendQuestionToApi'

const Example2 = () => {
  const [currentError, setCurrentError] = useState('')
  const [isConversationStarted, setIsConversationStarted] = useState(false)
  const [finalAnswer, setFinalAnswer] = useState('')
  const [conversation, setConversation] = useState<Conversation>([])

  const handleVerifyProcess = async () => {
    setIsConversationStarted(true)

    try {
      const firstQuestion = await sendAnswerToVerify(DEFAULT_BODY, setCurrentError, setConversation)

      const messageID = firstQuestion.msgID
      let currentVerifyResponse = firstQuestion
      let localMessages: Message[] = [
        { role: 'user', content: `${firstQuestion.text} msgID:${messageID}` },
      ]

      while (!currentVerifyResponse.text.includes('{{FLG:')) {
        const aIResponse = await sendQuestionToApi(localMessages, setCurrentError, setConversation)

        localMessages = [...localMessages, { role: 'assistant', content: aIResponse.text }]

        currentVerifyResponse = await sendAnswerToVerify(
          { msgID: messageID, text: aIResponse.text },
          setCurrentError,
          setConversation,
        )

        localMessages = [...localMessages, { role: 'user', content: currentVerifyResponse.text }]
      }

      setFinalAnswer('Verification approved hello Mr Robot')
    } catch (error) {
      setCurrentError(`Error in verification process: ${error}`)
    }
  }

  return (
    <div>
      <h3>Example 2</h3>
      <Description />
      <br />
      <button onClick={handleVerifyProcess}>Start verification process</button>
      {currentError && <p style={{ color: 'red' }}>{currentError}</p>}
      {isConversationStarted && (
        <ul>
          <li
            key={`human_${DEFAULT_BODY.text}_${DEFAULT_BODY.msgID}`}
          >{`Human: ${DEFAULT_BODY.text}`}</li>
          {conversation.map((item, idx) => (
            <li key={`${item.role}_${item.msgID}_${idx}`}>
              {item.role === 'robot' ? `Robot: ${item.text}` : `Human(OpenAi): ${item.text}`}
            </li>
          ))}
          {finalAnswer && (
            <li style={{ marginBottom: '10px' }} key={`robot_final_answer`}>
              {finalAnswer}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default Example2
