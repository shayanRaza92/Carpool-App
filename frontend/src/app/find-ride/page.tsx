"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/api';

const KARACHI_AREAS = [
    "Gulshan-e-Iqbal",
    "Gulistan-e-Jauhar",
    "North Nazimabad",
    "Federal B Area",
    "Clifton",
    "DHA",
    "PECHS",
    "Bahria Town",
    "Malir",
    "Nazimabad",
    "Saddar",
    "Garden",
    "Lyari",
    "Korangi",
    "Landhi",
    "Other"
];

export default function FindRide() {
    const router = useRouter();
    const [selectedArea, setSelectedArea] = useState(KARACHI_AREAS[0]);
    const [customArea, setCustomArea] = useState('');
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Auth Check
    useEffect(() => {
        if (!localStorage.getItem('access_token')) router.push('/login');
    }, [router]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSearched(true);

        let areaToSearch = selectedArea;
        if (selectedArea === "Other") {
            if (!customArea.trim()) {
                alert("Please enter your area name");
                setLoading(false);
                return;
            }
            areaToSearch = customArea.trim();
        }

        try {
            // Fetch rides matching the area
            // Note: In a real app, we'd use query params properly formatted
            const data = await api.get(`/rides/search?area=${encodeURIComponent(areaToSearch)}`);
            setRides(data || []);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch rides.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">

            {/* Header */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 cursor-pointer flex items-center gap-2" onClick={() => router.push('/dashboard')}>
                        <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg>
                        KarPool
                    </h1>
                    <button onClick={() => router.push('/dashboard')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Back to Dashboard
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h2 className="text-4xl font-bold mb-4">Find Your Seat</h2>
                    <p className="text-slate-400 text-lg">Select your area to find classmates heading your way.</p>
                </div>

                {/* Search Box */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 mb-12 shadow-2xl shadow-purple-900/10">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-2 ml-1">Your Location</label>
                            <div className="relative">
                                <select
                                    value={selectedArea}
                                    onChange={(e) => setSelectedArea(e.target.value)}
                                    className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white appearance-none focus:border-purple-500 transition-colors outline-none cursor-pointer"
                                >
                                    {KARACHI_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            {selectedArea === "Other" && (
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        placeholder="Enter Area Name"
                                        value={customArea}
                                        onChange={(e) => setCustomArea(e.target.value)}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 focus:border-purple-500 transition-colors outline-none"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto bg-white text-black font-bold py-4 px-8 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 min-w-[160px]"
                            >
                                {loading ? (
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        Search
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results */}
                {searched && (
                    <div className="space-y-4 animate-fade-in">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            Available Rides
                            <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-full">{rides.length}</span>
                        </h3>

                        {rides.length === 0 ? (
                            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                <p className="text-slate-400 mb-4">No rides found from <span className="text-white font-medium">{selectedArea}</span> yet.</p>
                                <button className="text-purple-400 hover:text-purple-300 font-medium text-sm">Be the first to offer a ride!</button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {rides.map((ride) => (
                                    <div key={ride.id} className="bg-[#0a0a0a] border border-white/5 hover:border-purple-500/50 transition-colors p-6 rounded-xl flex flex-col md:flex-row justify-between items-center group">
                                        <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg font-bold">
                                                {ride.driver_email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-lg">To {ride.destination_area}</h4>
                                                    <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-500/20">
                                                        {ride.seats_available} seats left
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                        {ride.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        {ride.departure_time}
                                                    </span>
                                                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                    <span>{ride.driver_email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full md:w-auto">
                                            <button
                                                onClick={() => window.open(`https://wa.me/${ride.whatsapp_number}?text=Hi, I want to book a seat for your ride from ${ride.origin_area}`, '_blank')}
                                                className="flex-1 md:flex-none bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                                WhatsApp
                                            </button>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    if (window.confirm("Confirm booking this seat?")) {
                                                        try {
                                                            console.log("Attempting to book ride:", ride.id);
                                                            await api.post(`/rides/${ride.id}/book`, {});
                                                            alert("Booking Confirmed!");
                                                            // Update UI locally
                                                            setRides(rides.map(r => r.id === ride.id ? { ...r, seats_available: r.seats_available - 1 } : r).filter(r => r.seats_available > 0));
                                                        } catch (err: any) {
                                                            console.error("Booking failed:", err);
                                                            alert(err.message || "Booking failed");
                                                        }
                                                    }
                                                }}
                                                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                Book Seat
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
