"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/api';

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

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        university: KARACHI_UNIVERSITIES[0],
        phone: ''
    });
    const [customUniversity, setCustomUniversity] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeField, setActiveField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.phone.length !== 11) {
            setError("Phone number must be exactly 11 digits.");
            setLoading(false);
            return;
        }

        const payload = { ...formData };
        if (formData.university === "Other") {
            if (!customUniversity.trim()) {
                setError("Please enter your university name.");
                setLoading(false);
                return;
            }
            payload.university = customUniversity.trim();
        }

        try {
            await api.post('/auth/register', payload);
            router.push('/login');
        } catch (err: any) {
            setError(err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-[#050505] text-white overflow-hidden">

            {/* Visual / Brand Panel */}
            <div className="h-64 lg:h-auto w-full flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden bg-gradient-to-br from-purple-900 via-slate-900 to-black">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/register.jpg"
                        alt="Carpool Journey"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                </div>

                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter text-white/90 flex items-center gap-2">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg>
                        Carpool
                    </h1>
                </div>

                <div className="relative z-10 lg:max-w-lg hidden lg:block mb-12">
                    <h2 className="text-5xl font-extralight leading-tight mb-6">
                        Drive Less. <br />
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Live More.</span>
                    </h2>
                    <p className="text-lg text-white/60 font-light">
                        The reliable ride-sharing network exclusively for university students.
                    </p>
                </div>

                {/* Mobile-only Text */}
                <div className="relative z-10 lg:hidden mt-auto">
                    <h2 className="text-2xl font-bold">Join the Network</h2>
                    <p className="text-white/80 text-sm">Create your student account.</p>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-[#0a0a0a] overflow-y-auto">
                <div className="w-full max-w-sm py-8 animate-fade-in-up">
                    <div className="mb-8">
                        <h3 className="text-3xl font-semibold mb-2">Create Account</h3>
                        <p className="text-slate-400">Join 'Carpool' network in seconds.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-200 text-sm">
                            <span className="bg-red-500 rounded-full w-1.5 h-1.5 flex-shrink-0"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <div className={`transition-all duration-300 rounded-xl border ${activeField === 'name' ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800 bg-slate-900'} p-1`}>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-600"
                                    placeholder="Shayan Raza"
                                    value={formData.full_name}
                                    onFocus={() => setActiveField('name')}
                                    onBlur={() => setActiveField(null)}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">University Email</label>
                            <div className={`transition-all duration-300 rounded-xl border ${activeField === 'email' ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800 bg-slate-900'} p-1`}>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-600"
                                    placeholder="student@uni.edu"
                                    value={formData.email}
                                    onFocus={() => setActiveField('email')}
                                    onBlur={() => setActiveField(null)}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">Password</label>
                            <div className={`transition-all duration-300 rounded-xl border ${activeField === 'password' ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800 bg-slate-900'} p-1`}>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onFocus={() => setActiveField('password')}
                                    onBlur={() => setActiveField(null)}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Uni & Phone Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">University</label>
                                <div className={`transition-all duration-300 rounded-xl border ${activeField === 'uni' ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800 bg-slate-900'} p-1`}>
                                    <select
                                        className="w-full bg-transparent border-none outline-none text-white px-4 py-3 appearance-none bg-[#0a0a0a]"
                                        value={formData.university}
                                        onFocus={() => setActiveField('uni')}
                                        onBlur={() => setActiveField(null)}
                                        onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                    >
                                        {KARACHI_UNIVERSITIES.map(u => <option key={u} value={u} className="bg-slate-900">{u}</option>)}
                                    </select>
                                </div>
                                {formData.university === "Other" && (
                                    <div className={`mt-2 transition-all duration-300 rounded-xl border ${activeField === 'customUni' ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800 bg-slate-900'} p-1`}>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-600"
                                            placeholder="Enter University Name"
                                            value={customUniversity}
                                            onFocus={() => setActiveField('customUni')}
                                            onBlur={() => setActiveField(null)}
                                            onChange={(e) => setCustomUniversity(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                                <div className={`transition-all duration-300 rounded-xl border ${activeField === 'phone' ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800 bg-slate-900'} p-1`}>
                                    <input
                                        type="text"
                                        required
                                        maxLength={11}
                                        className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-600"
                                        placeholder="0300..."
                                        value={formData.phone}
                                        onFocus={() => setActiveField('phone')}
                                        onBlur={() => setActiveField(null)}
                                        onChange={(e) => {
                                            if (/^\d*$/.test(e.target.value)) setFormData({ ...formData, phone: e.target.value })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                            >
                                {loading ? 'Creating Profile...' : 'Sign Up'}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/login')}
                                className="w-full mt-4 py-4 rounded-xl text-slate-400 hover:text-white transition-all text-sm font-medium"
                            >
                                Already have an account? <span className="text-purple-400 underline decoration-purple-500/30 underline-offset-4">Log in</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
