import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { STARS } from '../constants';

export default function Register() {
    const [form, setForm] = useState({
        name: '', age: '', gender: 'Male', star: '', email: '', phone: '', password: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/auth/register', form);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            alert("Registration failed. Email might be used.");
        }
    };

    // ... imports same ...

    // ... imports same ...

    return (
        <div className="flex min-h-screen items-center justify-center bg-stone-100 py-10">
            <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl border border-stone-200">
                <h2 className="text-3xl font-bold mb-8 text-center text-amber-800">Devotee Registration</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                    <input placeholder="Full Name" required className="border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                        value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Age" required className="border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                            value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
                        <select className="border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                            <option>Male</option>
                            <option>Female</option>
                        </select>
                    </div>

                    <select required className="border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                        value={form.star} onChange={e => setForm({ ...form, star: e.target.value })}>
                        <option value="">-- Select Star (Nakshatra) --</option>
                        {STARS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <input type="email" placeholder="Email" required className="border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                        value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

                    <input type="tel" placeholder="Mobile Number" required className="border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                        value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

                    <input type="password" placeholder="Password" required className="border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                        value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

                    <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl hover:from-amber-700 hover:to-orange-700 transition font-bold shadow-md mt-4">Register</button>
                </form>
                <div className="mt-8 text-center text-sm space-y-3">
                    <p className="text-stone-600">
                        Already registered? <Link to="/login" className="text-amber-700 font-bold hover:underline">Login here</Link>
                    </p>
                    <Link to="/" className="text-stone-400 hover:text-amber-600 block transition">← Back to Dashboard</Link>
                </div>
            </div>
        </div>
    );
}
