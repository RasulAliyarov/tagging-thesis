'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { Toaster } from 'react-hot-toast'
import { AuthTokenResponseType } from '@/types'

interface AuthContextType {
    user: any | null
    token: string | null
    login: (data: AuthTokenResponseType) => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()


    // 🔑 INIT AUTH 
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        const cookieToken = Cookies.get('token');

        if (cookieToken) {
            setToken(cookieToken);
        }

        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        setIsLoading(false);
    }, []);


    // 🔒 AUTH GUARD 
    useEffect(() => {
        if (!isLoading && !token) {
            router.replace('/login');
        }

    }, [token, isLoading, router]);

    const login = (data: AuthTokenResponseType) => {
        Cookies.set('token', data.access_token, { expires: 1, secure: true })
        localStorage.setItem('user', JSON.stringify(data.user))
        setToken(data.access_token)
        setUser(data.user)
        router.push('/dashboard')
    }

    const logout = () => {
        Cookies.remove('token')
        localStorage.removeItem('user')

        setToken(null)
        setUser(null)

        router.replace('/login');
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
            <Toaster />
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
