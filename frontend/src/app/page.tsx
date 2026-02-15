import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Carpooling App
        </h1>
        <p className="text-xl text-slate-400 max-w-lg">
          Share rides, save money, and make new friends on your way to university.
        </p>

        <div className="flex gap-4 mt-8">
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-slate-200 transition-all"
          >
            Sign In
          </Link>
          <a
            href="/app-release.apk"
            download
            className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all"
          >
            Download App
          </a>
        </div>
      </main>
    </div>
  );
}
