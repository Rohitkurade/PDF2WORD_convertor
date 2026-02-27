import { useState, useEffect } from 'react'
import FileUpload from './components/FileUpload'
import Stats from './components/Stats'
import './App.css'

function App() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">
            <span className="icon">📄</span>
            PDF ↔ Word Converter
          </h1>
          <p className="tagline">Convert PDF to Word and Word to PDF instantly</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <FileUpload onConversionComplete={fetchStats} />
          {stats && <Stats stats={stats} />}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2026 PDF-Word Converter • Fast • Secure • Free</p>
        </div>
      </footer>
    </div>
  )
}

export default App
