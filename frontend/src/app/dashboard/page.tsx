"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check for token
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/login');
        }
        // Mock user for now
        setUser({ name: "Traveler" });
    }, [router]);

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
            {/* Navbar */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-12">
                        <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 flex items-center gap-2">
                            <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg>
                            KarPool
                        </h1>
                        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
                            <a href="/find-ride" className="bg-white/5 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors">Find a Seat</a>
                            <a href="/offer-ride" className="hover:text-purple-400 transition-colors py-2">Offer a Ride</a>
                            <a href="/my-journeys" className="hover:text-purple-400 transition-colors py-2">My Journeys</a>
                        </nav>
                    </div>

                    <button
                        onClick={() => {
                            localStorage.removeItem('access_token');
                            router.push('/login');
                        }}
                        className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero Section */}
                <div className="mb-16">
                    <div className="rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-purple-500/20 transition-all duration-1000"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl font-semibold mb-4 leading-tight">
                                Heading to Campus? <br />
                                <span className="text-slate-400">Share the journey.</span>
                            </h2>
                            <p className="text-slate-400 mb-8 max-w-md text-lg">
                                Connect with verified students going your way. Save money, reduce traffic, and make new friends.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => router.push('/find-ride')}
                                    className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-transform active:scale-95 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    Find a Ride
                                </button>
                                <button
                                    onClick={() => router.push('/offer-ride')}
                                    className="bg-white/10 text-white border border-white/10 px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-transform active:scale-95 flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    Offer a Ride
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Journeys */}
                <div className="mb-8">
                    <h3 className="text-2xl font-semibold mb-6">Recent Community Trips</h3>

                    {/* Empty State */}
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <h4 className="text-lg font-medium text-white mb-2">No rides found nearby</h4>
                        <p className="text-slate-500 max-w-sm mx-auto mb-6">
                            Looks like no one from your university has posted a trip yet. Be the first one!
                        </p>
                        <button className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                            Post a Trip Request &rarr;
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
