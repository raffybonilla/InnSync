export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-6xl bg-white shadow-2xl overflow-hidden relative">

        {/* HERO IMAGE */}
        <div className="relative h-[700px] w-full">

          {/* ✅ UPDATED HOTEL IMAGE (still luxury hotel vibe) */}
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1600&auto=format&fit=crop"
            alt="Luxury Hotel"
            className="w-full h-full object-cover"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* TOP BAR */}
          <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-5 z-10">

            {/* MENU ICON */}
            <button className="text-white text-3xl">
              ☰
            </button>

            {/* LOGO */}
            <div className="text-center">

              <h1 className="text-5xl font-serif text-white drop-shadow-lg">
                Inn Sync
              </h1>

              <p className="text-xs tracking-[4px] text-white mt-1">
                SMART HOTEL AUTOMATION
              </p>

            </div>

            <div className="w-8"></div>

          </div>

          {/* CENTER CONTENT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">

            <h1 className="text-6xl md:text-7xl font-serif text-white drop-shadow-2xl">
              Inn Sync
            </h1>

            <p className="text-white text-lg md:text-xl mt-4 max-w-2xl leading-relaxed drop-shadow-lg">
              Experience seamless hotel booking,
              smart automation, and modern hospitality in Cebu.
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-col md:flex-row gap-4">

              {/* USER */}
              <a
                href="/auth/user"
                className="px-10 py-4 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition duration-300 shadow-lg"
              >
                Login as Guest
              </a>

              {/* ADMIN */}
              <a
                href="/auth/admin"
                className="px-10 py-4 bg-black/70 backdrop-blur-md text-white font-semibold rounded-md border border-white/20 hover:bg-black transition duration-300 shadow-lg"
              >
                Login as Admin
              </a>

              {/* STAFF */}
              <a
                href="/auth/staff"
                className="px-10 py-4 bg-black/70 backdrop-blur-md text-white font-semibold rounded-md border border-white/20 hover:bg-black transition duration-300 shadow-lg"
              >
                Login as Staff
              </a>

            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="bg-[#2f3a4c] text-white">

          <div className="flex flex-col md:flex-row items-center justify-between px-6 py-5 text-sm gap-3">

            <p className="hover:text-gray-300 cursor-pointer transition">
              Privacy Policy
            </p>

            <div className="text-center">

              <h1 className="text-3xl font-serif">
                Inn Sync
              </h1>

              <p className="text-[10px] tracking-[3px]">
                SMART HOTEL AUTOMATION
              </p>

            </div>

            <p className="hover:text-gray-300 cursor-pointer transition">
              User Generated Content
            </p>

          </div>

          <div className="border-t border-white/10 text-center text-xs py-3 text-gray-300">
            © InnSync. All rights reserved.
          </div>

        </div>

      </div>

    </div>
  );
}