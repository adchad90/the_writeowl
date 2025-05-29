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

  const { prompt, tone, wordLimit } = req.body

  if (!prompt) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required field: prompt is required' 
    })
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const fullPrompt = `You are a helpful AI assistant. Please respond to the following prompt in a ${tone} tone and keep your response under ${wordLimit} words. Be accurate, helpful, and engaging.

User prompt: ${prompt}`

    const result = await model.generateContent(fullPrompt)
    const response = result.response.text().trim()

    res.status(200).json({ success: true, response })
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
      error: `Failed to generate response: ${error.message || 'Unknown error'}` 
    })
  }
}
