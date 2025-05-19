import axios from 'axios'
import { useState } from 'react'
import Description from './Description/Description'

const Example4 = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentError, setCurrentError] = useState('')
  const [files, setFiles] = useState<Record<string, string> | null>(null)

  const handleExample4Files = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/internal.api/get-files-example4`)

      setFiles(response.data)
    } catch (error) {
      setCurrentError(`Error fetching flag: ${error}`)
      setFiles(null)
    }

    setIsLoading(false)
  }

  return (
    <div>
      <h3>Example 4</h3>
      <Description />
      <button onClick={handleExample4Files}>{isLoading ? '...Processing' : 'get files'}</button>
      {files &&
        Object.entries(files).map(([fileName, content]) => (
          <div key={fileName}>
            <h3>{fileName}</h3>
            <textarea
              value={content}
              readOnly
              style={{
                width: '90vw',
                height: '40vh',
              }}
            />
          </div>
        ))}
      {currentError && <p style={{ color: 'red', marginTop: '10px' }}>{currentError}</p>}
    </div>
  )
}

export default Example4
