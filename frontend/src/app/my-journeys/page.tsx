"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/api';

function StarRating({ rating, onRate, interactive = false, size = 'md' }: { rating: number; onRate?: (r: number) => void; interactive?: boolean; size?: string }) {
    const [hover, setHover] = useState(0);
    const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`${sizeClass} transition-colors duration-150 ${interactive ? 'cursor-pointer' : ''} ${(interactive ? hover || rating : rating) >= star ? 'text-amber-400' : 'text-slate-600'}`}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                    onClick={() => interactive && onRate?.(star)}
                    fill="currentColor" viewBox="0 0 24 24"
                >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    );
}

function ReviewModal({ ride, onClose, onSubmitted }: { ride: any; onClose: () => void; onSubmitted: () => void }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) { alert("Please select a rating"); return; }
        setSubmitting(true);
        try {
            await api.post('/reviews/', { ride_id: ride.id, rating, comment: comment.trim() || null });
            onSubmitted();
        } catch (err: any) {
            alert(err.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div className="relative bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full animate-fade-in shadow-2xl shadow-purple-900/20" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors text-xl">&times;</button>
                <h3 className="text-2xl font-bold mb-1">Rate Your Driver</h3>
                <p className="text-slate-400 mb-6 text-sm">{ride.driver_name} &bull; {ride.origin_area} &rarr; {ride.destination_area}</p>
                <div className="flex justify-center mb-6"><StarRating rating={rating} onRate={setRating} interactive size="lg" /></div>
                <p className="text-center text-sm text-slate-400 mb-6 h-5">{['','Terrible','Poor','Average','Good','Excellent'][rating] || 'Tap a star'}</p>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience (optional)" rows={3} className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:border-purple-500 transition-colors outline-none resize-none mb-6" />
                <button onClick={handleSubmit} disabled={submitting || rating === 0} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-40 text-white py-3.5 rounded-xl font-bold transition-all active:scale-95">
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </div>
        </div>
    );
}

export default function MyJourneys() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'bookings' | 'requests' | 'offered'>('bookings');
    const [rides, setRides] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [offeredRides, setOfferedRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviewRide, setReviewRide] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [bookingsData, requestsData, offeredData] = await Promise.all([
                api.get('/rides/booked'),
                api.get('/rides/driver/requests'),
                api.get('/rides/my-offered')
            ]);
            setRides(bookingsData || []);
            setRequests(requestsData || []);
            setOfferedRides(offeredData || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (!localStorage.getItem('access_token')) { router.push('/login'); return; }
        fetchData();
    }, [router]);

    const handleAction = async (bookingId: number, action: 'accepted' | 'rejected') => {
        try {
            await api.put(`/rides/bookings/${bookingId}/status`, { status: action });
            const requestsData = await api.get('/rides/driver/requests');
            setRequests(requestsData || []);
            alert(`Booking ${action}`);
        } catch (err: any) { alert(err.message || "Action failed"); }
    };

    const handleCompleteRide = async (rideId: number) => {
        if (!window.confirm("Mark this ride as completed? Passengers will be able to leave reviews.")) return;
        try {
            await api.put(`/rides/${rideId}/complete`, {});
            alert("Ride completed!");
            fetchData();
        } catch (err: any) { alert(err.message || "Failed to complete ride"); }
    };

    const statusBadge = (s: string) => {
        const m: Record<string, string> = { accepted: 'bg-green-500/10 text-green-400 border-green-500/20', rejected: 'bg-red-500/10 text-red-400 border-red-500/20', pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20', scheduled: 'bg-purple-500/10 text-purple-400 border-purple-500/20', cancelled: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
        return m[s] || m.pending;
    };

    const tabs = [
        { key: 'bookings' as const, label: 'Booked Rides', count: 0 },
        { key: 'requests' as const, label: 'Driver Requests', count: requests.length },
        { key: 'offered' as const, label: 'My Offered Rides', count: 0 },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30">
            {reviewRide && <ReviewModal ride={reviewRide} onClose={() => setReviewRide(null)} onSubmitted={() => { setReviewRide(null); fetchData(); }} />}

            <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <h1 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 cursor-pointer flex items-center gap-2" onClick={() => router.push('/dashboard')}>
                        <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg>
                        KarPool
                    </h1>
                    <button onClick={() => router.push('/dashboard')} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Back to Dashboard</button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold mb-4">My Journeys</h2>
                    <p className="text-slate-400 text-lg">Manage your rides, bookings, and reviews.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 mb-8 border-b border-white/10 overflow-x-auto">
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key)}
                            className={`pb-4 text-lg font-medium transition-colors relative whitespace-nowrap ${activeTab === t.key ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                            {t.label}
                            {t.count > 0 && <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{t.count}</span>}
                            {activeTab === t.key && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20"><span className="animate-spin inline-block h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full" /></div>
                ) : (
                    <>
                        {/* Bookings View */}
                        {activeTab === 'bookings' && (
                            rides.length === 0 ? (
                                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                    <p className="text-slate-400 mb-4">You haven&apos;t booked any rides yet.</p>
                                    <button onClick={() => router.push('/find-ride')} className="text-purple-400 hover:text-purple-300 font-medium">Find a ride now &rarr;</button>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {rides.map((ride) => (
                                        <div key={ride.booking_id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl group">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div className="flex items-center gap-4 w-full md:w-auto">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg font-bold shrink-0">
                                                        {ride.driver_email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <h4 className="font-semibold text-lg">{ride.driver_name || ride.driver_email}</h4>
                                                            <span className={`text-xs px-2 py-0.5 rounded border ${statusBadge(ride.booking_status)}`}>
                                                                {ride.booking_status.charAt(0).toUpperCase() + ride.booking_status.slice(1)}
                                                            </span>
                                                            {ride.ride_status === 'completed' && (
                                                                <span className={`text-xs px-2 py-0.5 rounded border ${statusBadge('completed')}`}>Ride Completed</span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
                                                            <span>{ride.origin_area} &rarr; {ride.destination_area}</span>
                                                            <span className="w-1 h-1 bg-slate-600 rounded-full" />
                                                            <span>{ride.date} &bull; {ride.departure_time}</span>
                                                        </div>
                                                        {(ride.driver_total_reviews > 0) && (
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <StarRating rating={Math.round(ride.driver_rating)} size="sm" />
                                                                <span className="text-xs text-slate-400">{ride.driver_rating.toFixed(1)} ({ride.driver_total_reviews})</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 w-full md:w-auto shrink-0">
                                                    {ride.booking_status === 'accepted' && ride.ride_status === 'completed' && !ride.has_reviewed && (
                                                        <button onClick={() => setReviewRide(ride)} className="flex-1 md:flex-none bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-5 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 active:scale-95">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                            Leave Review
                                                        </button>
                                                    )}
                                                    {ride.has_reviewed && (
                                                        <span className="flex items-center gap-1.5 text-sm text-emerald-400 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                            Reviewed
                                                        </span>
                                                    )}
                                                    {ride.booking_status === 'accepted' && (
                                                        <button onClick={() => window.open(`https://wa.me/${ride.whatsapp_number}?text=Hi, my booking was accepted!`, '_blank')}
                                                            className="flex-1 md:flex-none bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                                                            WhatsApp
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
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
                                                <button onClick={() => handleAction(request.booking_id, 'accepted')} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold transition-colors">Accept</button>
                                                <button onClick={() => handleAction(request.booking_id, 'rejected')} className="flex-1 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/20 py-3 rounded-lg font-bold transition-colors">Reject</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        )}

                        {/* Offered Rides View */}
                        {activeTab === 'offered' && (
                            offeredRides.length === 0 ? (
                                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                    <p className="text-slate-400 mb-4">You haven&apos;t offered any rides yet.</p>
                                    <button onClick={() => router.push('/offer-ride')} className="text-purple-400 hover:text-purple-300 font-medium">Offer a ride &rarr;</button>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {offeredRides.map((ride) => (
                                        <div key={ride.id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-xl group">
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <h4 className="font-semibold text-lg">{ride.origin_area} &rarr; {ride.destination_area}</h4>
                                                        <span className={`text-xs px-2 py-0.5 rounded border ${statusBadge(ride.status)}`}>
                                                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-slate-400">
                                                        {ride.date} &bull; {ride.departure_time} &bull; {ride.seats_available} seats left
                                                    </div>
                                                </div>
                                                {ride.status === 'scheduled' && (
                                                    <button onClick={() => handleCompleteRide(ride.id)}
                                                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 active:scale-95 w-full md:w-auto justify-center">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                        Complete Ride
                                                    </button>
                                                )}
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
