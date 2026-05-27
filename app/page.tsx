'use client'

import { Header } from '@/components/header'
import { CreatePostForm } from '@/components/create-post-form'
import { RecentPostsTable } from '@/components/recent-posts-table'
import { Footer } from '@/components/footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
            {/* Left Column */}
            <div>
              <CreatePostForm />
            </div>

            {/* Right Column */}
            <div>
              <RecentPostsTable />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
