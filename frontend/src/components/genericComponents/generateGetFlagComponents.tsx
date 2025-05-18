import React, { ReactNode, useState } from 'react'
import axios from 'axios'
import { extractFlag } from 'components/helpers/extractFlag'

interface IGenerateGetFlagComponentsProps {
  description: ReactNode
  title: string
  getFlagEndpoint: string
}

const GenerateGetFlagComponents: React.FC<IGenerateGetFlagComponentsProps> = ({
  description,
  title,
  getFlagEndpoint,
}) => {
  const [flag, setFlag] = useState<string | null>(null)
  const [currentError, setCurrentError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGetFlag = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/internal.api/${getFlagEndpoint}`)

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
      <h3>{title}</h3>
      {description}
      <button onClick={handleGetFlag}>{isLoading ? '...Processing' : 'get flag'}</button>
      {flag && <p style={{ color: 'green', marginTop: '10px' }}>{flag}</p>}
      {currentError && <p style={{ color: 'red', marginTop: '10px' }}>{currentError}</p>}
    </div>
  )
}

export default GenerateGetFlagComponents
