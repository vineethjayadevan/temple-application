import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Poojas() {
    const [poojas, setPoojas] = useState([]);
    const [form, setForm] = useState({ name: '', rate: '', description: '' });
    const [editing, setEditing] = useState(null);

    const fetchPoojas = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/poojas');
            setPoojas(res.data);
        } catch (err) {
            console.error("Failed to fetch poojas", err);
        }
    };

    useEffect(() => { fetchPoojas(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/poojas', {
                ...form,
                rate: parseFloat(form.rate)
            });
            setForm({ name: '', rate: '', description: '' });
            fetchPoojas();
        } catch (err) {
            alert("Error saving pooja");
        }
    };

    const handleUpdate = async (id) => {
        try {
            await axios.put(`http://localhost:3000/api/poojas/${id}`, {
                name: editing.name,
                rate: parseFloat(editing.rate),
                description: editing.description // Keep description for consistency
            });
            setEditing(null);
            fetchPoojas();
        } catch (err) {
            alert("Error updating pooja");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`http://localhost:3000/api/poojas/${id}`);
            fetchPoojas();
        } catch (err) {
            alert("Error deleting pooja");
        }
    };

    return (
        <div className="bg-stone-100 min-h-screen text-stone-800 p-8">
            <h1 className="text-3xl font-bold mb-8 text-amber-800">Manage Pooja Rituals</h1>

            {/* Create Pooja Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-10 border border-stone-200">
                <h2 className="text-xl font-bold mb-6 text-stone-700">Add New Ritual</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-stone-500 font-bold mb-2 uppercase text-xs tracking-wider">Ritual Name</label>
                        <input required className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition" placeholder="e.g. Ganapathy Homam"
                            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-stone-500 font-bold mb-2 uppercase text-xs tracking-wider">Rate (₹)</label>
                        <input type="number" required className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition" placeholder="e.g. 50"
                            value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} />
                    </div>
                    <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 transition shadow-md">
                        + Add Ritual
                    </button>
                </form>
            </div>

            {/* Poojas List */}
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-stone-50 text-stone-600 text-sm uppercase tracking-wide border-b border-stone-200">
                            <th className="p-4 rounded-tl-xl">Ritual Name</th>
                            <th className="p-4">Rate</th>
                            <th className="p-4 rounded-tr-xl text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {poojas.map(p => (
                            <tr key={p.id} className="border-b border-stone-100 hover:bg-amber-50/50 transition">
                                <td className="p-4 font-bold text-stone-800">
                                    {editing?.id === p.id ? (
                                        <input className="border border-stone-300 p-2 rounded w-full bg-white" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
                                    ) : p.name}
                                </td>
                                <td className="p-4 font-medium text-amber-700">
                                    {editing?.id === p.id ? (
                                        <input type="number" className="border border-stone-300 p-2 rounded w-24 bg-white" value={editing.rate} onChange={e => setEditing({ ...editing, rate: e.target.value })} />
                                    ) : `₹${p.rate}`}
                                </td>
                                <td className="p-4 text-center">
                                    {editing?.id === p.id ? (
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => handleUpdate(p.id)} className="text-green-600 hover:text-green-800 font-semibold px-3 py-1 bg-green-100 rounded-lg">Save</button>
                                            <button onClick={() => setEditing(null)} className="text-stone-500 hover:text-stone-700 font-semibold px-3 py-1 bg-stone-100 rounded-lg">Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center gap-3">
                                            <button onClick={() => setEditing(p)} className="text-amber-600 hover:text-amber-800 text-sm font-semibold hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold hover:underline">Delete</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {poojas.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-stone-400 italic">No rituals added yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
