import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.error('Gemini API key is missing')
    return res.status(500).json({ 
      success: false, 
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env.local file.' 
    })
  }

  const { type, tone, wordLimit, description } = req.body

  if (!description) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required field: description is required' 
    })
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `You are a creative content writer specializing in ${type} posts. Write an engaging ${type} post about: ${description}. The tone should be ${tone}. Keep it under ${wordLimit} words. Make it engaging and appropriate for the ${type} platform. Include relevant hashtags if appropriate.`

    const result = await model.generateContent(prompt)
    const post = result.response.text().trim()

    res.status(200).json({ success: true, post })
  } catch (error) {
    console.error('Gemini API error:', error)
    
    // More specific error messages
    if (error.message.includes('API_KEY_INVALID')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid Gemini API key. Please check your API key in .env.local' 
      })
    }
    
    if (error.message.includes('QUOTA_EXCEEDED')) {
      return res.status(429).json({ 
        success: false, 
        error: 'Gemini API quota exceeded. Please wait or upgrade your plan.' 
      })
    }

    res.status(500).json({ 
      success: false, 
      error: `Failed to generate post: ${error.message || 'Unknown error'}` 
    })
  }
}

