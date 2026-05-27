import { NextResponse } from 'next/server'

// Mock data for posts - in production, this would come from a database
const mockPosts = [
  {
    id: '1',
    content: 'Just launched our new AI-powered dashboard! 🚀 Check out the latest features.',
    platform: 'twitter',
    status: 'ready',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    content: 'Excited to announce that PostFlow AI is now available to all users. Sign up today!',
    platform: 'linkedin',
    status: 'ready',
    date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    content: 'Behind the scenes: How we built the fastest post scheduler in the market.',
    platform: 'instagram',
    status: 'processing',
    date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    content: 'New feature alert: AI-powered image generation for your posts is live!',
    platform: 'facebook',
    status: 'ready',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    content: 'Join 10k+ creators already using PostFlow AI to grow their audience.',
    platform: 'threads',
    status: 'failed',
    date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET() {
  try {
    // Return mock data
    // In production, you would query your database here
    return NextResponse.json(mockPosts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
