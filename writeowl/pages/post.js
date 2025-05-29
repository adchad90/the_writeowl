import { useState } from 'react'
import Link from 'next/link'

export default function Post() {
  const [formData, setFormData] = useState({
    type: 'social media',
    tone: 'casual',
    wordLimit: 200,
    description: ''
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const generatePost = async () => {
    if (!formData.description) {
      alert('Please provide a description')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      if (data.success) {
        setResult(data.post)
      } else {
        alert('Error generating post: ' + data.error)
      }
    } catch (error) {
      alert('Error: ' + error.message)
    }
    setLoading(false)
  }

  const improvePost = async () => {
    if (!result) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/improve-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: result, type: 'post' }),
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
          📝 Post Generator
        </h1>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="input-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="social media">Social Media</option>
              <option value="blog">Blog Post</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
            </select>
          </div>

          <div className="input-group">
            <label>Tone</label>
            <select name="tone" value={formData.tone} onChange={handleChange}>
              <option value="casual">Casual</option>
              <option value="professional">Professional</option>
              <option value="funny">Funny</option>
              <option value="inspiring">Inspiring</option>
              <option value="informative">Informative</option>
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

          <div className="input-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what you want to post about..."
              rows="4"
            />
          </div>

          <button 
            className="btn btn-primary" 
            onClick={generatePost}
            disabled={loading}
            style={{ width: '100%', padding: '16px' }}
          >
            {loading && <span className="loading"></span>}
            Generate Post
          </button>
        </div>

        {result && (
          <div className="result-container">
            <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Generated Post:</h3>
            <div className="result-text">{result}</div>
            <div className="button-group">
              <button 
                className="btn btn-success" 
                onClick={improvePost}
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
