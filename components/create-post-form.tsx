'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function CreatePostForm() {
  const [content, setContent] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [platform, setPlatform] = useState('twitter')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Please enter post content')
      return
    }

    if (!platform) {
      toast.error('Please select a platform')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/create-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          imagePrompt: imagePrompt || undefined,
          platform,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send post request')
      }

      toast.success('Post request sent! Your post will be ready for review on Telegram shortly.')
      setContent('')
      setImagePrompt('')
      setPlatform('twitter')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to send post request.')
    } finally {
      setIsLoading(false)
    }
  }

  const isDisabled = !content.trim() || isLoading

  return (
    <Card className="bg-gray-900 border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Create New Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="content" className="text-gray-300 mb-2 block">
            Post Content
          </Label>
          <Textarea
            id="content"
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 resize-none"
            rows={6}
          />
          <p className="text-xs text-gray-500 mt-1">{content.length} characters</p>
        </div>

        <div>
          <Label htmlFor="imagePrompt" className="text-gray-300 mb-2 block">
            Image Prompt <span className="text-gray-500">(Optional)</span>
          </Label>
          <Input
            id="imagePrompt"
            type="text"
            placeholder="Describe the image you want to generate..."
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
          />
        </div>

        <div>
          <Label htmlFor="platform" className="text-gray-300 mb-2 block">
            Platform
          </Label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="twitter">Twitter / X</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="threads">Threads</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>

        <Button
          type="submit"
          disabled={isDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Create Post'
          )}
        </Button>
      </form>
    </Card>
  )
}
