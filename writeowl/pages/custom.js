import { useState } from 'react'
import Link from 'next/link'

export default function Custom() {
  const [formData, setFormData] = useState({
    prompt: '',
    tone: 'neutral',
    wordLimit: 300
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const generateCustom = async () => {
    if (!formData.prompt) {
      alert('Please provide a custom prompt')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-custom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      if (data.success) {
        setResult(data.response)
      } else {
        alert('Error generating response: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  const improveResponse = async () => {
    if (!result) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/improve-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: result, type: 'custom' }),
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
          ⚡ Custom Prompt Generator
        </h1>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="input-group">
            <label>Custom Prompt *</label>
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              placeholder="Enter your custom prompt here..."
              rows="6"
            />
          </div>

          <div className="input-group">
            <label>Tone</label>
            <select name="tone" value={formData.tone} onChange={handleChange}>
              <option value="neutral">Neutral</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="creative">Creative</option>
              <option value="technical">Technical</option>
              <option value="friendly">Friendly</option>
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
              max="2000"
            />
          </div>

          <button 
            className="btn btn-primary" 
            onClick={generateCustom}
            disabled={loading}
            style={{ width: '100%', padding: '16px' }}
          >
            {loading && <span className="loading"></span>}
            Generate Response
          </button>
        </div>

        {result && (
          <div className="result-container">
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Generated Response:</h3>
            <div className="result-text">{result}</div>
            <div className="button-group">
              <button 
                className="btn btn-success" 
                onClick={improveResponse}
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

