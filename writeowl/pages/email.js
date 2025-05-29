import { useState } from 'react'
import Link from 'next/link'

export default function Email() {
  const [formData, setFormData] = useState({
    to: '',
    purpose: '',
    tone: 'formal',
    wordLimit: 200
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const generateEmail = async () => {
    if (!formData.to || !formData.purpose) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      if (data.success) {
        setResult(data.email)
      } else {
        alert('Error generating email: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  const improveEmail = async () => {
    if (!result) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/improve-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: result, type: 'email' }),
      })
      
      const data = await response.json()
      if (data.success) {
        setResult(data.improvedText)
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result)
      alert('Copied to clipboard!')
    } catch (error) {
      alert('Failed to copy to clipboard')
    }
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/">
            <button className="btn">← Back to Home</button>
          </Link>
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          📧 Email Generator
        </h1>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="input-group">
            <label>To (e.g., professor, manager) *</label>
            <input
              type="text"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="professor"
            />
          </div>

          <div className="input-group">
            <label>Purpose (e.g., application, resignation) *</label>
            <input
              type="text"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="job application"
            />
          </div>

          <div className="input-group">
            <label>Tone</label>
            <select name="tone" value={formData.tone} onChange={handleChange}>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <div className="input-group">
            <label>Word Limit</label>
            <input
              type="number"
              name="wordLimit"
              value={formData.wordLimit}
              onChange={handleChange}
              min="50"
              max="1000"
            />
          </div>

          <button 
            className="btn btn-primary" 
            onClick={generateEmail}
            disabled={loading}
            style={{ width: '100%', padding: '16px' }}
          >
            {loading && <span className="loading"></span>}
            Generate Email
          </button>
        </div>

        {result && (
          <div className="result-container">
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Generated Email:</h3>
            <div className="result-text">{result}</div>
            <div className="button-group">
              <button 
                className="btn btn-success" 
                onClick={improveEmail}
                disabled={loading}
              >
                {loading && <span className="loading"></span>}
                Make it Better
              </button>
              <button className="btn" onClick={copyToClipboard}>
                📋 Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}