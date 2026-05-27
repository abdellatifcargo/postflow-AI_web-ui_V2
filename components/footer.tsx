export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black/80 backdrop-blur-sm py-4">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-sm text-gray-500">
          💡 <span className="text-gray-400">Posts are sent to your n8n webhook for processing. Configure your webhook URL in the environment variables.</span>
        </p>
      </div>
    </footer>
  )
}
