import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { text, imagePrompt, platform } = body

    // Validate required fields
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Post content is required' },
        { status: 400 }
      )
    }

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      )
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL is not configured')
      return NextResponse.json(
        { error: 'Webhook configuration is missing' },
        { status: 500 }
      )
    }

    // Forward to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        imagePrompt: imagePrompt || null,
        platform,
      }),
    })

    // Return the n8n response
    const responseData = await response.json()

    return NextResponse.json(responseData, {
      status: response.status,
    })
  } catch (error) {
    console.error('Error in create-post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
