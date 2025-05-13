import React, { useState } from 'react'
import { DEFAULT_BODY } from './constants'
import { Answer } from './model'
import { sendAnswerToVerify } from './helpers/sendAnswerToVerify'
import Description from './Description/Description'

const Example2 = () => {
  const [currentError, setCurrentError] = useState('')
  const [answer, setAnswer] = useState<Answer>({ msgID: '', text: '' })
  const [inputValue, setInputValue] = useState('')
  const [isInputEnable, setIsInputEnable] = useState(false)

  const handleInputOnEnter = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    setCurrentError('')
    if (event.key === 'Enter') {
      await sendAnswerToVerify(
        { msgID: answer.msgID, text: inputValue },
        setAnswer,
        setCurrentError,
      )
    }
  }

  const handleButtonClick = async () => {
    await sendAnswerToVerify(DEFAULT_BODY, setAnswer, setCurrentError)
    setIsInputEnable(true)
  }

  return (
    <div>
      <h3>Example 2</h3>
      <Description />
      <br />
      {answer.msgID === '' && <button onClick={handleButtonClick}>Click me if Ready!</button>}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleInputOnEnter}
        placeholder="Type your message and press Enter"
        disabled={!isInputEnable}
      />
      {currentError && <p style={{ color: 'red' }}>{currentError}</p>}
      {answer.text && !currentError.length && <p>Response: {answer.text}</p>}
    </div>
  )
}

export default Example2
