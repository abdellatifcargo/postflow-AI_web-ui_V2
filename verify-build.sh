#!/bin/bash

echo "=== SaaS Pro Build Verification ==="
echo ""

echo "✓ Checking Docker configuration..."
if grep -q "pnpm install --frozen-lockfile --ignore-scripts" Dockerfile; then
  echo "  ✅ Dockerfile uses correct pnpm flags"
else
  echo "  ❌ Dockerfile missing --frozen-lockfile --ignore-scripts"
fi

echo ""
echo "✓ Checking API Routes..."
routes=(
  "app/api/auth/register/route.ts"
  "app/api/posts/create/route.ts"
  "app/api/posts/route.ts"
  "app/api/stripe/checkout/route.ts"
  "app/api/webhooks/stripe/route.ts"
)

for route in "${routes[@]}"; do
  if [ -f "$route" ]; then
    if grep -q "export async function POST\|export async function GET" "$route"; then
      echo "  ✅ $route uses export async function"
    else
      echo "  ⚠️  $route may not use export async function syntax"
    fi
  else
    echo "  ❌ $route not found"
  fi
done

echo ""
echo "✓ Checking for native HTML select..."
if grep -q '<select' app/login/page.tsx && grep -q '<select' app/dashboard/page.tsx; then
  echo "  ✅ Using native HTML select elements"
else
  echo "  ⚠️  May not be using native HTML select"
fi

echo ""
echo "✓ Checking package versions..."
if grep -q '"next-auth": "5.0.0-beta.31"' package.json; then
  echo "  ✅ NextAuth v5 beta pinned"
fi

if grep -q '"@auth/prisma-adapter": "2.11.2"' package.json; then
  echo "  ✅ Prisma adapter pinned"
fi

if grep -q '"prisma": "6.1.0"' package.json; then
  echo "  ✅ Prisma pinned"
fi

if grep -q '"bcryptjs": "2.4.3"' package.json; then
  echo "  ✅ bcryptjs pinned"
fi

if grep -q '"stripe": "17.5.0"' package.json; then
  echo "  ✅ Stripe SDK pinned"
fi

echo ""
echo "✓ Checking project structure..."
required_files=(
  "Dockerfile"
  "docker-compose.yml"
  ".env.example"
  "README.md"
  "IMPLEMENTATION.md"
  "prisma/schema.prisma"
  "auth.ts"
  "middleware.ts"
  "lib/prisma.ts"
  "lib/auth-helpers.ts"
  "lib/encryption.ts"
  "lib/stripe.ts"
  "components/providers.tsx"
  "types/next-auth.d.ts"
)

for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file NOT FOUND"
  fi
done

echo ""
echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Set up environment variables: cp .env.example .env.local"
echo "2. Start PostgreSQL: docker-compose up -d"
echo "3. Set up database: pnpm prisma db push"
echo "4. Run dev server: pnpm dev"
echo "5. Visit: http://localhost:3000"
