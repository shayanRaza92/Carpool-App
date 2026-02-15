import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />

      <main className="flex flex-col items-center gap-8 text-center relative z-10 w-full max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm">
            KarPool
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium">
            Share the journey.
          </p>
        </div>

        <p className="text-base text-slate-300 leading-relaxed px-4">
          Save money, make friends, and commute smarter to your university.
        </p>

        <div className="flex flex-col w-full gap-4 mt-8 px-4">
          <Link
            href="/login"
            className="w-full py-4 text-center bg-white text-black font-bold rounded-2xl text-lg hover:bg-slate-200 active:scale-[0.98] transition-all shadow-lg shadow-white/10"
          >
            Sign In
          </Link>
          <a
            href="/app-release.apk"
            download
            className="w-full py-4 text-center bg-white/5 border border-white/20 text-white font-bold rounded-2xl text-lg hover:bg-white/10 active:scale-[0.98] transition-all backdrop-blur-sm"
          >
            Download App
          </a>
        </div>

        <div className="mt-12 text-sm text-slate-500">
          Available on Android
        </div>
      </main>
    </div>
  );
}
