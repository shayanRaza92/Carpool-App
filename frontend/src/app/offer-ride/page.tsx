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

const KARACHI_UNIVERSITIES = [
    "Institute of Business Administration (IBA)",
    "FAST-NUCES",
    "NED University of Engineering and Technology",
    "University of Karachi (UoK)",
    "SZABIST",
    "Dow University of Health Sciences (DUHS)",
    "Jinnah Sindh Medical University (JSMU)",
    "Other"
];

export default function OfferRide() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        origin_area: KARACHI_AREAS[0],
        destination_area: KARACHI_UNIVERSITIES[0],
        departure_time: '08:00',
        date: new Date().toISOString().split('T')[0],
        seats_available: 3,
        whatsapp_number: ''
    });
    const [customOrigin, setCustomOrigin] = useState('');
    const [customDestination, setCustomDestination] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('access_token')) router.push('/login');
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (formData.whatsapp_number.length !== 11) {
            alert("Please enter a valid 11-digit WhatsApp number (e.g. 03001234567)");
            setLoading(false);
            return;
        }

        const payload = { ...formData };
        if (formData.origin_area === "Other") {
            if (!customOrigin.trim()) {
                alert("Please enter origin area");
                setLoading(false);
                return;
            }
            payload.origin_area = customOrigin.trim();
        }
        if (formData.destination_area === "Other") {
            if (!customDestination.trim()) {
                alert("Please enter destination university");
                setLoading(false);
                return;
            }
            payload.destination_area = customDestination.trim();
        }

        try {
            await api.post('/rides/', payload);
            alert("Ride Posted Successfully! Students visible to your area can now find you.");
            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            alert("Failed to post ride. " + (err.message || ""));
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
                        Carpool
                    </h1>
                    <button onClick={() => router.push('/dashboard')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Cancel
                    </button>
                </div>
            </header>

            <main className="max-w-xl mx-auto px-6 py-12">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-2">Offer a Ride</h2>
                    <p className="text-slate-400">Share your journey with fellow students.</p>
                </div>

                <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Origin */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-2 ml-1">Picking up from (Area)</label>
                            <select
                                value={formData.origin_area}
                                onChange={(e) => setFormData({ ...formData, origin_area: e.target.value })}
                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:border-purple-500 outline-none"
                            >
                                {KARACHI_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                            </select>
                            {formData.origin_area === "Other" && (
                                <input
                                    type="text"
                                    placeholder="Enter Area Name"
                                    value={customOrigin}
                                    onChange={(e) => setCustomOrigin(e.target.value)}
                                    className="mt-2 w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none placeholder:text-slate-600"
                                    required
                                />
                            )}
                        </div>

                        {/* Destination */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-2 ml-1">Going to (University)</label>
                            <select
                                value={formData.destination_area}
                                onChange={(e) => setFormData({ ...formData, destination_area: e.target.value })}
                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:border-purple-500 outline-none"
                            >
                                {KARACHI_UNIVERSITIES.map(uni => <option key={uni} value={uni}>{uni}</option>)}
                            </select>
                            {formData.destination_area === "Other" && (
                                <input
                                    type="text"
                                    placeholder="Enter University Name"
                                    value={customDestination}
                                    onChange={(e) => setCustomDestination(e.target.value)}
                                    className="mt-2 w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none placeholder:text-slate-600"
                                    required
                                />
                            )}
                        </div>

                        {/* Time & Seats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date Selection */}
                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">Date</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Day */}
                                    <select
                                        className="bg-[#111] border border-white/10 rounded-xl px-3 py-3 text-white appearance-none focus:border-purple-500 outline-none"
                                        value={new Date(formData.date).getDate()}
                                        onChange={(e) => {
                                            const d = new Date(formData.date);
                                            d.setDate(parseInt(e.target.value));
                                            const y = d.getFullYear();
                                            const m = String(d.getMonth() + 1).padStart(2, '0');
                                            const day = String(d.getDate()).padStart(2, '0');
                                            setFormData({ ...formData, date: `${y}-${m}-${day}` });
                                        }}
                                    >
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>

                                    {/* Month */}
                                    <select
                                        className="bg-[#111] border border-white/10 rounded-xl px-3 py-3 text-white appearance-none focus:border-purple-500 outline-none"
                                        value={new Date(formData.date).getMonth()}
                                        onChange={(e) => {
                                            const d = new Date(formData.date);
                                            d.setMonth(parseInt(e.target.value));
                                            const y = d.getFullYear();
                                            const m = String(d.getMonth() + 1).padStart(2, '0');
                                            const day = String(d.getDate()).padStart(2, '0');
                                            setFormData({ ...formData, date: `${y}-${m}-${day}` });
                                        }}
                                    >
                                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                                            <option key={i} value={i}>{m}</option>
                                        ))}
                                    </select>

                                    {/* Year */}
                                    <select
                                        className="bg-[#111] border border-white/10 rounded-xl px-3 py-3 text-white appearance-none focus:border-purple-500 outline-none"
                                        value={new Date(formData.date).getFullYear()}
                                        onChange={(e) => {
                                            const d = new Date(formData.date);
                                            d.setFullYear(parseInt(e.target.value));
                                            const y = d.getFullYear();
                                            const m = String(d.getMonth() + 1).padStart(2, '0');
                                            const day = String(d.getDate()).padStart(2, '0');
                                            setFormData({ ...formData, date: `${y}-${m}-${day}` });
                                        }}
                                    >
                                        <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                        <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Time Selection */}
                            <div className="space-y-2">
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">Time</label>
                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 bg-[#111] border border-white/10 rounded-xl px-3 py-3 text-white appearance-none focus:border-purple-500 outline-none"
                                        value={formData.departure_time.split(':')[0]}
                                        onChange={(e) => {
                                            const [_, min] = formData.departure_time.split(':');
                                            setFormData({ ...formData, departure_time: `${e.target.value}:${min}` });
                                        }}
                                    >
                                        {Array.from({ length: 24 }, (_, i) => i).map(h => (
                                            <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                    <span className="flex items-center text-slate-500">:</span>
                                    <select
                                        className="flex-1 bg-[#111] border border-white/10 rounded-xl px-3 py-3 text-white appearance-none focus:border-purple-500 outline-none"
                                        value={formData.departure_time.split(':')[1]}
                                        onChange={(e) => {
                                            const [hour, _] = formData.departure_time.split(':');
                                            setFormData({ ...formData, departure_time: `${hour}:${e.target.value}` });
                                        }}
                                    >
                                        {["00", "15", "30", "45"].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">Available Seats</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:border-purple-500 outline-none"
                                        value={formData.seats_available}
                                        onChange={(e) => setFormData({ ...formData, seats_available: parseInt(e.target.value) })}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Seat{n > 1 ? 's' : ''}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 uppercase tracking-widest mb-2 ml-1">WhatsApp Number</label>
                            <input
                                type="text"
                                placeholder="03001234567"
                                maxLength={11}
                                value={formData.whatsapp_number}
                                onChange={(e) => {
                                    if (/^\d*$/.test(e.target.value)) setFormData({ ...formData, whatsapp_number: e.target.value })
                                }}
                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                            />
                            <p className="text-xs text-slate-500 mt-1 ml-1">Students will contact you on this number.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-all mt-4"
                        >
                            {loading ? 'Publishing Ride...' : 'Publish Ride'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
