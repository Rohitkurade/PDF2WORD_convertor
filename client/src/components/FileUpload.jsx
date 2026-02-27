import { useState, useRef } from 'react'
import './FileUpload.css'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function FileUpload({ onConversionComplete }) {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState(null)
  const [convertedFileName, setConvertedFileName] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (file) => {
    if (!file) return

    const ext = file.name.split('.').pop().toLowerCase()
    if (ext !== 'pdf' && ext !== 'docx') {
      setMessage({ type: 'error', text: 'Only PDF and DOCX files are allowed' })
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setMessage({ type: 'error', text: 'File size must be less than 10MB' })
      return
    }

    setFile(file)
    setMessage(null)
    setConvertedFileName(null)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(0)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentage = (e.loaded / e.total) * 50
          setProgress(percentage)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          setProgress(100)
          
          const blob = xhr.response
          const contentDisposition = xhr.getResponseHeader('Content-Disposition')
          let fileName = 'converted-file'
          
          if (contentDisposition) {
            const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition)
            if (matches != null && matches[1]) {
              fileName = matches[1].replace(/['"]/g, '')
            }
          }

          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = fileName
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)

          setMessage({ type: 'success', text: `✅ Conversion successful! Downloaded ${fileName}` })
          setConvertedFileName(fileName)
          setFile(null)
          
          if (onConversionComplete) {
            onConversionComplete()
          }
        } else {
          const errorText = JSON.parse(xhr.responseText)
          setMessage({ type: 'error', text: errorText.message || 'Conversion failed' })
        }
        setIsUploading(false)
      })

      xhr.addEventListener('error', () => {
        setMessage({ type: 'error', text: 'Network error. Please try again' })
        setIsUploading(false)
      })

      xhr.responseType = 'blob'
      xhr.open('POST', 'http://localhost:5000/upload')
      xhr.send(formData)

      setProgress(50)
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const reset = () => {
    setFile(null)
    setMessage(null)
    setProgress(0)
    setConvertedFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="file-upload">
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {!file ? (
          <div className="drop-zone-content">
            <div className="upload-icon">📤</div>
            <h3>Drop your file here</h3>
            <p>or click to browse</p>
            <div className="file-types">
              <span className="badge">PDF</span>
              <span className="badge">DOCX</span>
            </div>
            <p className="file-limit">Max file size: 10MB</p>
          </div>
        ) : (
          <div className="file-info">
            <div className="file-icon">
              {file.name.endsWith('.pdf') ? '📄' : '📝'}
            </div>
            <div className="file-details">
              <h4>{file.name}</h4>
              <p>{formatFileSize(file.size)}</p>
              <div className="conversion-arrow">
                {file.name.endsWith('.pdf') ? '→ DOCX' : '→ PDF'}
              </div>
            </div>
            <button className="remove-btn" onClick={(e) => { e.stopPropagation(); reset(); }}>
              ✕
            </button>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">
            {progress < 50 ? 'Uploading...' : 'Converting...'}  {Math.round(progress)}%
          </p>
        </div>
      )}

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {file && !isUploading && (
        <div className="actions">
          <button className="btn btn-primary" onClick={handleUpload}>
            🚀 Convert Now
          </button>
          <button className="btn btn-secondary" onClick={reset}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

export default FileUpload
