import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/stats`)
    const data = await response.json()
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
