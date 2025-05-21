import { useState, useRef } from 'react'
import axios from 'axios'
import './Example7.css'

const Example7 = () => {
  //todo: separate input section / button / result section
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')
  const [currentError, setCurrentError] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles(files)
    const urls = files.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const handleChooseFiles = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return
    setIsLoading(true)
    const formData = new FormData()
    selectedFiles.forEach((file) => {
      formData.append('images', file)
    })
    try {
      const response = await axios.post('/internal.api/post-images-example7', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setResult(response.data.city)
    } catch (error) {
      setCurrentError(`Error uploading images: ${currentError}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="example7">
      <h3 className="example7__title">Example 7 - Image Analysis</h3>
      <div className="example7__file-input-group">
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button type="button" className="example7__choose-btn" onClick={handleChooseFiles}>
          Choose files
        </button>
        <span className="example7__file-count">
          {selectedFiles.length === 0
            ? 'No files selected'
            : `Files selected: ${selectedFiles.length}`}
        </span>
      </div>
      {previewUrls.length > 0 && (
        <div className="example7__preview-row">
          {previewUrls.map((url, index) => (
            <div key={index} className="example7__preview-imgbox">
              <img src={url} alt={`Preview ${index + 1}`} className="example7__preview-img" />
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={selectedFiles.length === 0 || isLoading}
        className="example7__analyze-btn"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Images'}
      </button>
      {result && (
        <div className="example7__result">
          <p>Detected city: {result}</p>
        </div>
      )}
      {currentError && (
        <div className="example7__error">
          <p>{currentError}</p>
        </div>
      )}
    </div>
  )
}

export default Example7
