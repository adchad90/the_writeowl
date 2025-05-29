import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="container">
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '3rem' }}>
          <span className="owl-icon">🦉</span>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Welcome to WriteOwl
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: '#e2e8f0',
            marginBottom: '3rem'
          }}>
            This owl writes for you
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Link href="/email">
            <button className="btn" style={{
              padding: '16px 32px',
              fontSize: '18px',
              minWidth: '150px'
            }}>
              📧 Email
            </button>
          </Link>
          <Link href="/post">
            <button className="btn" style={{
              padding: '16px 32px',
              fontSize: '18px',
              minWidth: '150px'
            }}>
              📝 Post
            </button>
          </Link>
          <Link href="/custom">
            <button className="btn" style={{
              padding: '16px 32px',
              fontSize: '18px',
              minWidth: '150px'
            }}>
              ⚡ Custom Prompt
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
