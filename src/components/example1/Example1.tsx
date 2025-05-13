import React, { useState } from 'react'
import { fetchAndSetQuestion } from './helpers/fetchAndSetQuestion'
import { fetchAnswerFromOpenAI } from './helpers/fetchAnswerFromOpenAI'
import { sendLoginRequest } from './helpers/sendLoginRequest'
import Description from './Description/Description'

const Example1 = () => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentError, setCurrentError] = useState('')
  const [secretPage, setSecretPage] = useState('')

  const handleProcess = async () => {
    setLoading(true)
    setCurrentError('')

    try {
      const fetchedQuestion = await fetchAndSetQuestion(setQuestion, setCurrentError)
      if (fetchedQuestion) {
        const openAIAnswer = await fetchAnswerFromOpenAI(
          fetchedQuestion,
          setAnswer,
          setCurrentError,
        )
        await sendLoginRequest(openAIAnswer, setSecretPage, setCurrentError)
        setLoading(false)
      }
    } catch (error) {
      setCurrentError(`Error during process: ${error}`)
    }
  }

  return (
    <div>
      <h3>Example 1</h3>
      <Description />
      <button onClick={handleProcess} disabled={loading}>
        {loading ? 'Loading...' : 'Start Process'}
      </button>
      {currentError && <p style={{ color: 'red' }}>{currentError}</p>}
      {question && <p>Question: {question}</p>}
      {answer && <p>Answer: {answer}</p>}
      {secretPage && (
        <div>
          <h2>Secret Page</h2>
          <div dangerouslySetInnerHTML={{ __html: secretPage }} />
        </div>
      )}
    </div>
  )
}

export default Example1
