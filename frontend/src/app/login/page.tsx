"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/api';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeField, setActiveField] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await api.post('/auth/login', formData);
            if (data && data.access_token) {
                localStorage.setItem('access_token', data.access_token);
                // Soft fade out could go here
                router.push('/dashboard');
            } else {
                throw new Error("Invalid response.");
            }
        } catch (err: any) {
            setError("We couldn't verify your credentials. Please double-check them.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2 bg-[#050505] text-white overflow-hidden">

            {/* Visual / Brand Panel */}
            <div className="h-64 lg:h-auto w-full flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-black">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/login.jpg"
                        alt="University Campus"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                </div>          <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter text-white/90 flex items-center gap-2">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg>
                        Carpool
                    </h1>
                </div>

                <div className="relative z-10 lg:max-w-lg hidden lg:block">
                    <h2 className="text-5xl font-extralight leading-tight mb-6">
                        Classmates. <br />
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Co-pilots.</span>
                    </h2>
                    <p className="text-lg text-white/60 font-light">
                        Your campus commute, reimagined. Save efficient miles with students you know.
                    </p>
                </div>

                {/* Mobile-only Text */}
                <div className="relative z-10 lg:hidden mt-auto">
                    <h2 className="text-2xl font-bold">University Carpooling</h2>
                    <p className="text-white/80 text-sm">Sign in to continue.</p>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-[#0a0a0a]">
                <div className="w-full max-w-sm">
                    <div className="mb-10">
                        <h3 className="text-3xl font-semibold mb-2">Welcome back</h3>
                        <p className="text-slate-400">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-200 text-sm">
                            <span className="bg-red-500 rounded-full w-1.5 h-1.5 flex-shrink-0"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">Email</label>
                            <div className={`transition-all duration-300 rounded-xl border ${activeField === 'email' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 bg-slate-900'} p-1`}>
                                <input
                                    type="email"
                                    required
                                    suppressHydrationWarning
                                    className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-600"
                                    placeholder="name@university.edu"
                                    value={formData.email}
                                    onFocus={() => setActiveField('email')}
                                    onBlur={() => setActiveField(null)}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                            </div>
                            <div className={`transition-all duration-300 rounded-xl border ${activeField === 'password' ? 'border-blue-500 bg-blue-500/5' : 'border-slate-800 bg-slate-900'} p-1`}>
                                <input
                                    type="password"
                                    required
                                    suppressHydrationWarning
                                    className="w-full bg-transparent border-none outline-none text-white px-4 py-3 placeholder:text-slate-600"
                                    placeholder="••••••"
                                    value={formData.password}
                                    onFocus={() => setActiveField('password')}
                                    onBlur={() => setActiveField(null)}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Authenticating...' : 'Sign In'}
                            </button>

                            <button
                                type="button"
                                onClick={() => router.push('/register')}
                                className="w-full mt-4 py-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm font-medium"
                            >
                                Create an account
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-xs text-slate-600">© 2026 Carpool Inc. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
