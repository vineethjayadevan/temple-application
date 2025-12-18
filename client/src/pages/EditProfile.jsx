import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { STARS } from '../constants';

export default function EditProfile() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', password: '', star: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setForm({ name: parsedUser.name, email: parsedUser.email, password: '', star: parsedUser.star || '' });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        // Placeholder for update logic - in a real app, we'd hit a PUT /api/users/:id endpoint
        // For now, we'll just update localStorage to simulate a name change
        const updatedUser = { ...user, name: form.name, star: form.star };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        alert("Profile Updated (Local Simulation)");
    };

    if (!user) return <div>Loading...</div>;

    // ... imports same ...
    // ... imports same ...
    return (
        <div className="min-h-screen bg-stone-100 p-6 flex justify-center items-center">
            <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-stone-200">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-amber-800">Edit Profile</h2>
                    <button onClick={() => navigate('/')} className="text-sm text-stone-500 hover:text-amber-600 transition">← Back</button>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <label className="block text-stone-600 font-semibold mb-2">Name</label>
                        <input className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-stone-600 font-semibold mb-2">Star</label>
                        <select className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                            value={form.star} onChange={e => setForm({ ...form, star: e.target.value })}>
                            <option value="">-- Select Star --</option>
                            {STARS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-stone-600 font-semibold mb-2">Email</label>
                        <input disabled className="w-full border border-stone-200 p-3 rounded-lg bg-stone-100 text-stone-500 cursor-not-allowed"
                            value={form.email} />
                    </div>
                    <div>
                        <label className="block text-stone-600 font-semibold mb-2">New Password (Optional)</label>
                        <input type="password" className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition" placeholder="Leave blank to keep current"
                            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    </div>

                    <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition shadow-md">
                        Update Profile
                    </button>
                </form>

                <div className="mt-8 border-t border-stone-100 pt-6">
                    <button onClick={handleLogout} className="w-full text-red-500 hover:bg-red-50 py-3 rounded-xl transition border border-red-200 font-semibold">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
