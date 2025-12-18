import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Determine title based on state passed from Home
    const isAdmin = location.state?.role === 'admin';
    const title = isAdmin ? 'Admin Login' : 'Devotee Login';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', form);
            const userData = res.data.user;

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(userData));

            // ROBUST REDIRECT LOGIC
            if (userData.role === 'ADMIN') {
                // Admins always go to dashboard, ignoring other intents
                navigate('/admin/bookings');
            } else {
                // If user tried to access Admin Login page, warn them?
                if (isAdmin) {
                    setError("This account is not an Administrator.");
                    localStorage.clear();
                    return;
                }
                // Regular user redirect
                if (location.state?.from) navigate(location.state.from);
                else navigate('/');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.error || 'Invalid credentials');
        }
    };

    // ... imports same ...

    // ... imports same ...

    return (
        <div className="flex h-screen items-center justify-center bg-stone-100">
            <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-stone-200">
                <h2 className="text-3xl font-bold mb-8 text-center text-amber-800">{title}</h2>
                {error && <p className="bg-red-50 text-red-700 p-3 mb-6 rounded-lg text-center border border-red-200 shadow-sm">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-stone-600 font-semibold mb-2">Email</label>
                        <input type="email" required className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-stone-600 font-semibold mb-2">Password</label>
                        <input type="password" required className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    </div>
                    <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl hover:from-amber-700 hover:to-orange-700 transition font-bold shadow-md">Login</button>
                </form>

                <div className="mt-8 text-center text-sm space-y-3">
                    <p className="text-stone-500">
                        New devotee? <Link to="/register" className="text-amber-700 font-bold hover:underline">Register here</Link>
                    </p>
                    <Link to="/" className="text-stone-400 hover:text-amber-600 block transition">← Back to Dashboard</Link>
                </div>
            </div>
        </div>
    );
}
