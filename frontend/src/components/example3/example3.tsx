import React, { useState } from 'react'
import axios from 'axios'
import Description from './Description/Description'
import { extractFlag } from 'components/helpers/extractFlag'

const Example3 = () => {
  const [flag, setFlag] = useState<string | null>(null)
  const [currentError, setCurrentError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGetFlag = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get('/internal.api/get-flag-example3')

      const extractedFlag = extractFlag(response.data.flag)
      setFlag(extractedFlag)
    } catch (error) {
      setCurrentError(`Error fetching flag: ${error}`)
      setFlag(null)
    }

    setIsLoading(false)
  }

  return (
    <div>
      <h3>Example3</h3>
      <Description />
      <button onClick={handleGetFlag}>{isLoading ? '...Processing' : 'get flag'}</button>
      {flag && <p style={{ color: 'green', marginTop: '10px' }}>{flag}</p>}
      {currentError && <p style={{ color: 'red', marginTop: '10px' }}>{currentError}</p>}
    </div>
  )
}

export default Example3
