export default function InProgressPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-8"></div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Page Under Construction
        </h1>
        <p className="text-gray-400 mb-8">
          This feature is coming soon!
        </p>
        <a 
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  )
}