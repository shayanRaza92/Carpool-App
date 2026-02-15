"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/api';

export default function MyJourneys() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'bookings' | 'requests'>('bookings');
    const [rides, setRides] = useState<any[]>([]); // My Bookings
    const [requests, setRequests] = useState<any[]>([]); // Driver Requests
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem('access_token')) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [bookingsData, requestsData] = await Promise.all([
                    api.get('/rides/booked'),
                    api.get('/rides/driver/requests')
                ]);
                setRides(bookingsData || []);
                setRequests(requestsData || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [router]);

    const handleAction = async (bookingId: number, action: 'accepted' | 'rejected') => {
        try {
            await api.put(`/rides/bookings/${bookingId}/status`, { status: action });
            // Refresh data
            const requestsData = await api.get('/rides/driver/requests');
            setRequests(requestsData || []);
            alert(`Booking ${action}`);
        } catch (err: any) {
            alert(err.message || "Action failed");
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
                <div className="mb-8">
                    <h2 className="text-4xl font-bold mb-4">My Journeys</h2>
                    <p className="text-slate-400 text-lg">Manage your rides and bookings.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mb-8 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-4 text-lg font-medium transition-colors relative ${activeTab === 'bookings' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Booked Rides
                        {activeTab === 'bookings' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-full"></span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`pb-4 text-lg font-medium transition-colors relative ${activeTab === 'requests' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Driver Requests
                        {requests.length > 0 && <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{requests.length}</span>}
                        {activeTab === 'requests' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500 rounded-full"></span>}
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <span className="animate-spin inline-block h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></span>
                    </div>
                ) : (
                    <>
                        {/* Bookings View */}
                        {activeTab === 'bookings' && (
                            rides.length === 0 ? (
                                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                    <p className="text-slate-400 mb-4">You haven't booked any rides yet.</p>
                                    <button onClick={() => router.push('/find-ride')} className="text-purple-400 hover:text-purple-300 font-medium">Find a ride now &rarr;</button>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {rides.map((ride) => (
                                        <div key={ride.booking_id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl flex flex-col md:flex-row justify-between items-center group">
                                            <div className="flex items-center gap-6 w-full md:w-auto mb-4 md:mb-0">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg font-bold">
                                                    {ride.driver_email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-semibold text-lg">To {ride.destination_area}</h4>
                                                        <span className={`text-xs px-2 py-0.5 rounded border ${ride.booking_status === 'accepted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                                ride.booking_status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                            }`}>
                                                            {ride.booking_status.charAt(0).toUpperCase() + ride.booking_status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                                        <span>{ride.date} • {ride.departure_time}</span>
                                                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                        <span>From: {ride.origin_area}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {ride.booking_status === 'accepted' && (
                                                <button
                                                    onClick={() => window.open(`https://wa.me/${ride.whatsapp_number}?text=Hi, my booking was accepted!`, '_blank')}
                                                    className="w-full md:w-auto bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                                    Message Driver
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        {/* Requests View */}
                        {activeTab === 'requests' && (
                            requests.length === 0 ? (
                                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                    <p className="text-slate-400">No pending requests at the moment.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {requests.map((request) => (
                                        <div key={request.booking_id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl flex flex-col justify-between group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h4 className="font-semibold text-xl mb-1">{request.passenger_name}</h4>
                                                    <p className="text-slate-400 text-sm">{request.passenger_email}</p>
                                                </div>
                                                <div className="text-right text-sm text-slate-500">
                                                    <div>{request.origin} &rarr; {request.destination}</div>
                                                    <div>{request.time}</div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleAction(request.booking_id, 'accepted')}
                                                    className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold transition-colors"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAction(request.booking_id, 'rejected')}
                                                    className="flex-1 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 py-3 rounded-lg font-bold transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}
                    </>
                )}

            </main>
        </div>
    );
}
