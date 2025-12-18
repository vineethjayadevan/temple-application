import { useState, useEffect } from 'react';
import axios from 'axios';
import EditBookingModal from '../../components/EditBookingModal';
import { STARS } from '../../constants';

export default function AdminBookings() {
    const [poojas, setPoojas] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [form, setForm] = useState({ poojaId: '', devoteeName: '', devoteeStar: '', date: '' });
    const [message, setMessage] = useState('');
    const [editingBooking, setEditingBooking] = useState(null);
    const [activeTab, setActiveTab] = useState('admin'); // 'admin' | 'user'

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [poojaRes, bookingRes] = await Promise.all([
                axios.get('/api/poojas'),
                axios.get('/api/bookings')
            ]);
            setPoojas(poojaRes.data);
            setBookings(bookingRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userStr = localStorage.getItem('user');
            const adminId = userStr ? JSON.parse(userStr).id : 1;

            await axios.post('/api/bookings', {
                userId: adminId,
                poojaId: parseInt(form.poojaId),
                devoteeName: form.devoteeName,
                devoteeStar: form.devoteeStar,
                date: form.date
            });
            setMessage("Booking successful!");
            setForm({ poojaId: '', devoteeName: '', devoteeStar: '', date: '' });
            fetchData();
        } catch (err) {
            setMessage("Booking failed.");
        }
    };

    const isFuture = (dateStr) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(dateStr) >= today;
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await axios.delete(`/api/bookings/${id}`);
            alert("Booking cancelled.");
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to cancel");
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await axios.put(`/api/bookings/${id}`, data);
            alert("Booking updated.");
            setEditingBooking(null);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to update");
        }
    };

    const adminBookings = bookings.filter(b => b.user?.role === 'ADMIN' || b.user?.role === 'admin');
    const userBookings = bookings.filter(b => b.user?.role !== 'ADMIN' && b.user?.role !== 'admin');

    //... imports same

    //... imports same

    return (
        <div className="bg-stone-100 min-h-screen text-stone-800 p-6">
            <h1 className="text-3xl font-bold mb-8 text-amber-800">Booking Management</h1>

            {/* 1. Admin Booking Form (Always Visible) */}
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-10 border border-stone-200">
                <h2 className="text-xl font-bold mb-6 text-stone-700 flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 p-2 rounded-lg text-sm">Create</span>
                    New Admin Booking
                </h2>
                {message && <p className={`p-4 mb-6 rounded-xl border ${message.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{message}</p>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-stone-500 font-bold mb-2 uppercase text-xs tracking-wider">Select Pooja</label>
                        <select required className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                            value={form.poojaId} onChange={e => setForm({ ...form, poojaId: e.target.value })}>
                            <option value="">-- Select Pooja --</option>
                            {poojas.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.rate})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-stone-500 font-bold mb-2 uppercase text-xs tracking-wider">Date</label>
                        <input type="date" required className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                            value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-stone-500 font-bold mb-2 uppercase text-xs tracking-wider">Devotee Name</label>
                        <input required className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition" placeholder="Enter Full Name"
                            value={form.devoteeName} onChange={e => setForm({ ...form, devoteeName: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-stone-500 font-bold mb-2 uppercase text-xs tracking-wider">Devotee Star</label>
                        <select required className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                            value={form.devoteeStar} onChange={e => setForm({ ...form, devoteeStar: e.target.value })}>
                            <option value="">-- Select Star --</option>
                            {STARS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition md:col-span-2 mt-2 shadow-md">
                        Confirm Booking
                    </button>
                </form>
            </div>

            {/* 2. Tabs for Tables */}
            <div className="flex gap-8 mb-6 border-b border-stone-200">
                <button
                    onClick={() => setActiveTab('admin')}
                    className={`pb-3 px-2 text-lg font-bold transition ${activeTab === 'admin' ? 'border-b-4 border-amber-600 text-amber-700' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    Admin Bookings ({adminBookings.length})
                </button>
                <button
                    onClick={() => setActiveTab('user')}
                    className={`pb-3 px-2 text-lg font-bold transition ${activeTab === 'user' ? 'border-b-4 border-amber-600 text-amber-700' : 'text-stone-400 hover:text-stone-600'}`}
                >
                    Online User Bookings ({userBookings.length})
                </button>
            </div>

            {/* Tab Content Tables */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-stone-200 mb-12">
                {activeTab === 'admin' ? (
                    <div className="overflow-x-auto animate-fade-in">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-stone-50 text-stone-600 text-sm uppercase tracking-wide border-b border-stone-200">
                                    <th className="p-4 rounded-tl-xl">Pooja Date</th>
                                    <th className="p-4">Ritual</th>
                                    <th className="p-4">Devotee</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center rounded-tr-xl">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adminBookings.map(b => (
                                    <tr key={b.id} className="border-b border-stone-100 hover:bg-amber-50/50 transition duration-150">
                                        <td className="p-4 font-medium text-stone-800">{new Date(b.date).toLocaleDateString()}</td>
                                        <td className="p-4 font-bold text-amber-700">{b.pooja?.name}</td>
                                        <td className="p-4">
                                            <div className="font-semibold text-stone-800">{b.devoteeName}</div>
                                            <div className="text-xs text-stone-500 bg-stone-100 inline-block px-2 py-0.5 rounded-full mt-1">{b.devoteeStar}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 shadow-sm">{b.status}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {isFuture(b.date) ? (
                                                <div className="flex justify-center gap-3">
                                                    <button onClick={() => setEditingBooking(b)} className="text-amber-600 hover:text-amber-800 text-sm font-semibold hover:underline">Edit</button>
                                                    <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold hover:underline">Cancel</button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-stone-400 italic">Locked</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {adminBookings.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-stone-400 italic">No admin bookings found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto animate-fade-in">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-stone-50 text-stone-600 text-sm uppercase tracking-wide border-b border-stone-200">
                                    <th className="p-4 rounded-tl-xl">Pooja Date</th>
                                    <th className="p-4">Ritual</th>
                                    <th className="p-4">Devotee</th>
                                    <th className="p-4">Booked By (User)</th>
                                    <th className="p-4 rounded-tr-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userBookings.map(b => (
                                    <tr key={b.id} className="border-b border-stone-100 hover:bg-amber-50/50 transition duration-150">
                                        <td className="p-4 font-medium text-stone-800">{new Date(b.date).toLocaleDateString()}</td>
                                        <td className="p-4 font-bold text-amber-700">{b.pooja?.name}</td>
                                        <td className="p-4">
                                            <div className="font-semibold text-stone-800">{b.devoteeName}</div>
                                            <div className="text-xs text-stone-500 bg-stone-100 inline-block px-2 py-0.5 rounded-full mt-1">{b.devoteeStar}</div>
                                        </td>
                                        <td className="p-4 text-sm text-stone-600">
                                            <div className="font-medium">{b.user?.name}</div>
                                            <span className="text-xs text-stone-400">{b.user?.phone || b.user?.email}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 shadow-sm">{b.status}</span>
                                        </td>
                                    </tr>
                                ))}
                                {userBookings.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-stone-400 italic">No user bookings found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {editingBooking && (
                <EditBookingModal
                    booking={editingBooking}
                    poojas={poojas}
                    onClose={() => setEditingBooking(null)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
}
