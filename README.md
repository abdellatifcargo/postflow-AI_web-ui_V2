# SaaS Pro - Multi-Tenant Platform

A production-ready B2B SaaS platform built with Next.js 16, React 19, Prisma, NextAuth.js v5, Stripe, and TypeScript.

## Features

- **Multi-Tenancy**: Complete data isolation with tenant-scoped queries
- **Authentication**: Email/password authentication with NextAuth.js v5
- **Real-time Updates**: Dashboard posts auto-refresh every 5 seconds
- **Payment Processing**: Stripe integration for subscriptions
- **Social Media Integration**: Store and manage social media API keys
- **Native HTML Select**: Using semantic HTML for form controls
- **Dark Theme**: Built with dark theme by default
- **TypeScript**: Fully typed application for maximum type safety

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Runtime**: React 19
- **Database**: PostgreSQL with Prisma ORM v6.1.0
- **Authentication**: NextAuth.js v5 (beta) with Credentials provider
- **Payments**: Stripe SDK v17.5.0
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS with shadcn/ui components
- **Security**: bcryptjs for password hashing, AES-256-CBC for API key encryption

## Project Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # NextAuth configuration
│   │   ├── posts/             # Post management APIs
│   │   ├── stripe/            # Stripe checkout
│   │   └── webhooks/          # Stripe webhooks
│   ├── dashboard/             # Protected dashboard page
│   ├── login/                 # Login page
│   ├── register/              # Registration page
│   ├── page.tsx               # Homepage
│   ├── layout.tsx             # Root layout with SessionProvider
│   └── globals.css            # Global styles
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── auth-helpers.ts        # Auth utility functions
│   ├── encryption.ts          # API key encryption utilities
│   └── stripe.ts              # Stripe client
├── prisma/
│   └── schema.prisma          # Database schema
├── middleware.ts              # Route protection middleware
├── auth.ts                    # NextAuth.js configuration
├── Dockerfile                 # Production Docker image
└── .env.example              # Environment variables template
```

## Database Schema

### Tables
- **Tenant**: Organization/workspace data
- **User**: User accounts with tenant association
- **Post**: Blog posts for social media publishing
- **SocialAccount**: Encrypted social media API credentials
- **Subscription**: Stripe subscription tracking
- **Account/Session**: NextAuth.js tables for OAuth (if extended)
- **VerificationToken**: Email verification tokens

## Setup Instructions

### Prerequisites
- Node.js 20+
- pnpm v10+
- PostgreSQL database
- Stripe account (for payment features)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd saas-pro
pnpm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env.local
```

Update `.env.local` with your values:

```bash
# Database (replace with your PostgreSQL URL)
DATABASE_URL="postgresql://user:password@localhost:5432/saas_pro"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"

# Encryption (generate with: openssl rand -hex 32)
ENCRYPTION_KEY="your-generated-hex-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_ID_STARTER="price_..."
STRIPE_PRICE_ID_PRO="price_..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Generate Prisma client
pnpm prisma generate

# Create database schema
pnpm prisma db push

# Optional: Seed database with test data
pnpm prisma db seed
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit http://localhost:3000 to see the application.

## API Routes

### Authentication
- `POST /api/auth/signin` - NextAuth sign-in
- `POST /api/auth/register` - Create new tenant and user

### Posts
- `POST /api/posts/create` - Create a new post
- `GET /api/posts` - List recent posts for tenant

### Payments
- `POST /api/stripe/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Handle Stripe events

## Usage

### Create an Account

1. Visit http://localhost:3000/register
2. Fill in user details, tenant name, and slug
3. Password will be hashed with bcryptjs before storage
4. Redirected to login page

### Sign In

1. Go to http://localhost:3000/login
2. Enter email, password, and select tenant
3. Credentials are validated against database
4. JWT session created via NextAuth

### Dashboard

1. Navigate to /dashboard (protected route)
2. View stats: Total posts, Published, Drafts
3. Create new posts with native HTML form
4. Select platform from native HTML select dropdown
5. Posts auto-refresh every 5 seconds
6. All queries scoped to current tenant

### API Key Management

API keys are encrypted with AES-256-CBC before storage:

```javascript
// Encryption happens automatically in API routes
const encryptedKey = encryptApiKey(apiKey);
await prisma.socialAccount.create({
  data: { apiKey: encryptedKey, ... }
});

// Decrypt when needed
const decryptedKey = decryptApiKey(encrypted);
```

## Multi-Tenancy Implementation

All database queries are automatically scoped to the current tenant:

```typescript
// Every query must include tenantId filter
const posts = await prisma.post.findMany({
  where: { tenantId }  // Always required
});
```

The middleware automatically protects `/dashboard/*` routes:

```typescript
// middleware.ts protects dashboard routes
if (request.nextUrl.pathname.startsWith("/dashboard")) {
  if (!session) redirect("/login");
}
```

## Form Validation

All forms use Zod schemas for validation:

```typescript
const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  published: z.boolean().optional().default(false),
});
```

## Deployment

### Docker Deployment

Build the Docker image:

```bash
docker build -t saas-pro .
```

Run the container:

```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  saas-pro
```

### Vercel Deployment

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

```bash
vercel deploy
```

## Security Considerations

- Passwords hashed with bcryptjs (10 salt rounds)
- API keys encrypted with AES-256-CBC
- NextAuth.js JWT-based sessions
- Middleware protects dashboard routes
- All queries scoped to tenant ID
- CSRF protection via NextAuth.js
- Password validation: minimum 6 characters
- Email validation via Zod schema

## Performance

- Real-time updates every 5 seconds via client-side polling
- Database indexes on tenantId, createdAt, and foreign keys
- Prisma client singleton prevents connection pool exhaustion
- Response 200 status from /api/posts/create for success
- Efficient query patterns with select() to limit fields

## Development

### Create Migration

```bash
pnpm prisma migrate dev --name add_feature
```

### View Database in Studio

```bash
pnpm prisma studio
```

### Generate Prisma Client

```bash
pnpm prisma generate
```

## Testing

### Seeding Test Data

Create `prisma/seed.ts`:

```typescript
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';

async function main() {
  const tenant = await prisma.tenant.create({
    data: { name: 'Test Corp', slug: 'test-corp' }
  });

  const password = await bcryptjs.hash('password123', 10);
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password,
      name: 'Test User',
      tenantId: tenant.id
    }
  });
}

main();
```

## Troubleshooting

### Database Connection Issues

```bash
# Check environment variable
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Authentication Issues

- Verify NEXTAUTH_URL matches your domain
- Check NEXTAUTH_SECRET is set (min 32 characters)
- Ensure tenant slug exists for login

### Prisma Issues

```bash
# Clear Prisma cache and regenerate
rm -rf node_modules/.prisma
pnpm prisma generate
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
