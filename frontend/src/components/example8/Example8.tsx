import Description from './Description/Description'
import axios from 'axios'
import { useState } from 'react'
import { extractFlag } from 'components/helpers/extractFlag'
import './Example8.css'

const Example8 = () => {
  const [flag, setFlag] = useState<string | null>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)
  const [currentError, setCurrentError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const getExample8Result = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/internal.api/get-example8-result`)

      const extractedFlag = extractFlag(response.data.result.flag.message)
      setFlag(extractedFlag)
      setImageURL(response.data.result.imageURL)
      setCurrentError('')
    } catch (error) {
      setCurrentError(`Error fetching flag: ${error}`)
      setFlag(null)
    }

    setIsLoading(false)
  }

  return (
    <div className="example8">
      <div className="example8__top">
        <h3 className="example8__title">Example8</h3>
        <Description />
        <button className="example8__btn" onClick={getExample8Result}>
          {isLoading ? '...Processing' : 'get image and flag'}
        </button>
        {flag && <p className="example8__flag">{flag}</p>}
        {currentError && <p className="example8__error">{currentError}</p>}
      </div>
      {imageURL && (
        <div className="example8__image-wrapper">
          <img className="example8__image" src={imageURL} alt="Example8" />
        </div>
      )}
    </div>
  )
}

export default Example8
