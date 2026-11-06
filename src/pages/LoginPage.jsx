import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Hotel,
    LockKeyhole,
    Mail
} from 'lucide-react'

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate('/dashboard', { replace: true });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.message ||
                'Login failed. Please try again'
            );
        } finally {
            setLoading(false)
        }
    };

    return (
        <main className='flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10'>
            <section className='w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm'>
                <div className='mb-8 text-center '>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <Hotel size={28} />
                    </div>
                    <h1 className='mt-3 text-2xl font-bold text-slate-800'>
                        Hotel Admin
                    </h1>
                    <p className='text-sm text-slate-500 mt-1'>
                        Sign in to manage hotel operations
                    </p>
                </div>

                {error && (
                    <div className='mb-5 rounded-lg border border-red-200 bg-red--50 p-3 text-sm text-red-700'>
                        {error}
                    </div>
                )}


                {/* input form */}
                <form onSubmit={handleSubmit}
                    className="space-y-5">

                    <div >
                        <label
                            htmlFor="email"
                            className="text-sm text-slate-500 mb-2 block font-medium  "
                        >
                            Email Address

                        </label>
                        <div className='flex items-center gap-3 border border-slate-300 px-3 rounded-xl focus-within:border-blue-500'>
                            <Mail size={18} className="text-slate-400"/>
                            <input
                            id="email"
                            type='email'
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="username"
                            required
                            className="w-full bg-transparent px-3 py-3 text-sm outline-none"/>
                        </div>
                    </div>

                    <div>
                        <label
                        htmlFor="password"
                            className="text-sm text-slate-500 mb-2 block font-medium  "
                        >
                            Password
                        </label>
                        <div className="flex items-center gap-3 border border-slate-300 px-3 rounded-xl focus-within:border-blue-500">
                            <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full bg-transparent px-3 py-3 text-sm outline-none"/>
                        </div>
                    </div>

                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
                        {loading ? "Signing in..." : "Sign In"}

                    </button>

                </form>

                <p className='mt-7 text-center text-sm text-slate-400'>
                    Authorized hotel staff only
                </p>
            </section>
        </main>
    )
}

export default LoginPage;