export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🏨</div>
        <h1 className="text-5xl font-bold text-white mb-4">Inn Sync</h1>
        <p className="text-xl text-white mb-8">Smart Hotel-Booth Automation</p>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/auth/user"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            User Login / Register
          </a>
        </div>
      </div>
    </div>
  );
}
