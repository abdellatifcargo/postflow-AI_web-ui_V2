# PostFlow AI Dashboard

A production-ready Next.js 15 SaaS dashboard for managing social media posts with AI-powered content creation.

## Features

- **Create New Post Form**: Submit posts with content, optional image prompts, and platform selection
- **Recent Posts Table**: Real-time updates every 5 seconds showing post status and performance
- **Platform Support**: Twitter/X, Instagram, LinkedIn, Facebook, Threads, TikTok
- **Status Tracking**: Track posts through ready, processing, and failed states
- **Professional Dark Theme**: Modern, clean interface with responsive design
- **n8n Integration**: Server-side webhook integration for seamless post distribution

## Quick Start

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local and add your n8n webhook URL
# N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/publisher

# Start development server
pnpm dev
```

### Environment Variables

- `N8N_WEBHOOK_URL`: Your n8n webhook URL for post publishing

## Deployment

### Docker Deployment (VPS)

```bash
# Build Docker image
docker build -t postflow-ai:latest .

# Run container
docker run -d \
  --name postflow-ai \
  -p 3000:80 \
  -e N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/publisher \
  postflow-ai:latest
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - N8N_WEBHOOK_URL
```

### Traditional Server Deployment

```bash
# Build for production
pnpm build

# Start production server
NODE_ENV=production pnpm start
```

## Architecture

### Components

- **Header**: Branding and navigation
- **CreatePostForm**: Form for submitting new posts
- **RecentPostsTable**: Table displaying recent posts with real-time updates
- **Footer**: Webhook configuration note

### API Routes

- **POST `/api/create-post`**: Accept post data and forward to n8n webhook
  - Request body: `{ text, imagePrompt?, platform }`
  - Returns: n8n webhook response
  
- **GET `/api/posts`**: Fetch recent posts
  - Returns: Array of post objects with status and metadata

## Development

### Project Structure

```
app/
  ├── api/
  │   ├── create-post/route.ts
  │   └── posts/route.ts
  ├── page.tsx
  └── layout.tsx
components/
  ├── header.tsx
  ├── footer.tsx
  ├── create-post-form.tsx
  └── recent-posts-table.tsx
```

### Technology Stack

- **Framework**: Next.js 16.2.6
- **UI Components**: shadcn/ui with Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS 4.2
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast)
- **Containerization**: Docker with multi-stage build

## Building and Testing

```bash
# Run type checking
pnpm tsc --noEmit

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

## API Integration

### Creating a Post

```javascript
const response = await fetch('/api/create-post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Your post content',
    imagePrompt: 'Optional image description',
    platform: 'twitter', // or: instagram, linkedin, facebook, threads, tiktok
  }),
});
```

### Fetching Recent Posts

```javascript
const response = await fetch('/api/posts');
const posts = await response.json();
```

## n8n Webhook Integration

The dashboard forwards all post requests to your configured n8n webhook URL. The webhook receives:

```json
{
  "text": "Post content",
  "imagePrompt": "Optional image prompt",
  "platform": "twitter"
}
```

Your n8n workflow can then:
1. Generate AI images (if imagePrompt provided)
2. Format the content for the specific platform
3. Schedule or publish the post
4. Send a notification to Telegram
5. Store the post record in your database

## Performance Optimizations

- Real-time table updates every 5 seconds
- Responsive layout that adapts to mobile and desktop
- Optimized build with Next.js 16 Turbopack
- Efficient CSS with Tailwind CSS
- Component-level code splitting

## Security Considerations

- Server-side webhook forwarding (no CORS issues)
- Environment variable protection for webhook URL
- Input validation on both client and server
- Type-safe data handling with Zod

## Troubleshooting

### Form submission fails

1. Check that `N8N_WEBHOOK_URL` is set in `.env.local`
2. Ensure the n8n webhook URL is accessible from your server
3. Check browser console for error messages
4. Check server logs: `tail -f /tmp/dev.log` (or your log location)

### Posts don't load in the table

1. Verify the `/api/posts` endpoint is working: `curl http://localhost:3000/api/posts`
2. Check browser network tab for errors
3. Ensure no CORS issues (API is same-origin)

### Docker build fails

1. Ensure `pnpm-lock.yaml` is present
2. Check that Node.js version 22+ is available
3. Verify all dependencies are correctly specified in `package.json`

## License

MIT
