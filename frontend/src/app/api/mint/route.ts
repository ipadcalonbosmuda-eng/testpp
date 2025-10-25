import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${BACKEND_URL}/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    
    if (response.status === 402) {
      // Pass through x402 response
      return NextResponse.json(data, { status: 402 })
    }
    
    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Minting failed' }, { status: response.status })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Mint API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
