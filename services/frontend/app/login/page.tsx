'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, Loader2, Sparkles, ArrowLeft, Mail, UserCircleIcon } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast'
import { AuthTokenResponseType } from '@/types'

export default function LoginPage() {
    const authExample = {
        email: '',
        fullname: '',
        username: '',
        password: ''
    }

    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [auth, setAuth] = useState(authExample)
    const { login } = useAuth();

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

            const payload: any = isLogin
                ? { email: auth.email, password: auth.password }
                : {
                    username: auth.username,
                    email: auth.email,
                    password: auth.password,
                    fullname: auth.fullname,
                };

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                // FastAPI sends errors in "detail" field
                const message = data.detail?.[0]?.msg || data.detail || 'Failed to authenticate user';
                toast.error(message);
                throw new Error(message);
            }

            if (isLogin) {
                // login: save token & update context
                Cookies.set('token', data.access_token, { expires: 1, secure: true });
                login(data); // your context function
                toast.success('Logged in successfully!');
            } else {
                // registration: switch to login view
                setIsLogin(true);
                toast.success('Account created successfully! Please log in.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setAuth(authExample); // reset form
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f172a]">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {isLogin ? 'Welcome Back' : 'Get Started'}
                        </h2>
                        <p className="text-slate-400">
                            {isLogin ? 'Enter your credentials to continue' : 'Create your account for AI insights'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {
                            !isLogin && (
                                <>
                                    <div className="relative">
                                        <UserCircleIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            required
                                            value={auth.fullname}
                                            onChange={(e) =>
                                                setAuth(prev => ({ ...prev, fullname: e.target.value }))
                                            }
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            required
                                            value={auth.username}
                                            onChange={(e) =>
                                                setAuth(prev => ({ ...prev, username: e.target.value }))
                                            }
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                </>

                            )
                        }

                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={auth.email}
                                onChange={(e) =>
                                    setAuth(prev => ({ ...prev, email: e.target.value }))
                                }
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={auth.password}
                                onChange={(e) =>
                                    setAuth(prev => ({ ...prev, password: e.target.value }))
                                }
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>



                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : isLogin ? 'Sign In' : 'Sign Up'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
                        >
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}