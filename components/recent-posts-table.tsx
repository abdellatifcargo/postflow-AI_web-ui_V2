'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, AlertCircle } from 'lucide-react'

export interface Post {
  id: string
  content: string
  platform: string
  status: 'ready' | 'processing' | 'failed'
  date: string
}

export function RecentPostsTable() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/posts')
        if (!response.ok) throw new Error('Failed to fetch posts')
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        console.error('Error fetching posts:', err)
        setError('Failed to load posts')
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch immediately
    fetchPosts()

    // Set up interval to fetch every 5 seconds
    const interval = setInterval(fetchPosts, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-900 text-green-200'
      case 'processing':
        return 'bg-yellow-900 text-yellow-200'
      case 'failed':
        return 'bg-red-900 text-red-200'
      default:
        return 'bg-gray-900 text-gray-200'
    }
  }

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      twitter: 'bg-blue-900 text-blue-200',
      instagram: 'bg-pink-900 text-pink-200',
      linkedin: 'bg-indigo-900 text-indigo-200',
      facebook: 'bg-blue-800 text-blue-200',
      threads: 'bg-gray-800 text-gray-200',
      tiktok: 'bg-purple-900 text-purple-200',
    }
    return colors[platform] || 'bg-gray-900 text-gray-200'
  }

  if (isLoading && posts.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-gray-500 animate-spin mx-auto mb-3" />
            <p className="text-gray-400">Loading posts...</p>
          </div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gray-900 border-gray-800 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </Card>
    )
  }

  if (posts.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-800 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-400">No posts yet. Create your first post to get started.</p>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900 border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Recent Posts</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Content</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Platform</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3 text-gray-300">
                  <div className="max-w-xs truncate" title={post.content}>
                    {post.content}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge className={`capitalize ${getPlatformColor(post.platform)}`}>
                    {post.platform}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className={`capitalize ${getStatusColor(post.status)}`}>
                    {post.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
