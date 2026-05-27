import { Mail } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-black/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Post Dashboard</h1>
            <p className="text-xs text-gray-500">PostFlow AI</p>
          </div>
        </div>
      </div>
    </header>
  )
}
