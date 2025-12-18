import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Events() {
    const [events, setEvents] = useState([]);
    const [form, setForm] = useState({ name: '', date: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/events');
            setEvents(res.data);
        } catch (err) {
            console.error("Failed to fetch events", err);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`/api/events/${editId}`, form);
                setIsEditing(false);
                setEditId(null);
            } else {
                await axios.post('/api/events', form);
            }
            setForm({ name: '', date: '', description: '' });
            fetchEvents();
        } catch (err) {
            alert("Error saving event");
        }
    };

    //... imports same

    //... fetchEvents same

    //... handleSubmit same with logic for edit

    const handleEdit = (ev) => {
        setForm({ name: ev.name, date: ev.date.split('T')[0], description: ev.description });
        setIsEditing(true);
        setEditId(ev.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    //... handleDelete same

    return (
        <div className="bg-stone-100 min-h-screen text-stone-800">
            <h1 className="text-3xl font-bold mb-8 text-amber-800">Manage Temple Events</h1>

            {/* Create/Edit Event Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-10 border border-stone-200">
                <h2 className="text-xl font-bold mb-6 text-stone-700">
                    {isEditing ? 'Edit Event' : 'Add New Event'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-stone-500 font-bold mb-2 uppercase text-xs tracking-wider">Event Name</label>
                            <input required className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition" placeholder="e.g. Maha Shivaratri"
                                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-stone-500 font-bold mb-2 uppercase text-xs tracking-wider">Date</label>
                            <input type="date" required className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                                value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-stone-500 font-bold mb-2 uppercase text-xs tracking-wider">Description</label>
                        <textarea required className="w-full border border-stone-300 p-3 rounded-lg bg-stone-50 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition" rows="3" placeholder="Event details..."
                            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
                    </div>

                    <div className="flex gap-4">
                        <button className={`px-8 py-3 rounded-xl font-bold text-white transition shadow-md w-full md:w-auto ${isEditing ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'}`}>
                            {isEditing ? 'Update Event' : '+ Create Event'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={() => { setIsEditing(false); setForm({ name: '', date: '', description: '' }); }}
                                className="px-6 py-3 rounded-xl font-bold text-stone-500 border border-stone-300 hover:bg-stone-50 transition">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Events List */}
            <div className="space-y-4">
                {events.map(ev => (
                    <div key={ev.id} className={`bg-white p-6 rounded-2xl shadow-md border hover:border-amber-200 transition group ${isEditing && editId === ev.id ? 'border-amber-500 ring-2 ring-amber-100' : 'border-stone-200'}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-xl text-amber-800 group-hover:text-amber-600 transition">{ev.name}</h3>
                                    <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100 font-medium">
                                        {new Date(ev.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-stone-600 leading-relaxed">{ev.description}</p>
                            </div>
                            <div className="flex gap-3 ml-4">
                                <button onClick={() => handleEdit(ev)} className="text-amber-500 hover:text-amber-700 transition p-2 hover:bg-amber-50 rounded-lg" title="Edit">
                                    ✏️
                                </button>
                                <button onClick={() => handleDelete(ev.id)} className="text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg" title="Delete">
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {events.length === 0 && <p className="text-center text-stone-400 italic py-8">No events scheduled.</p>}
            </div>
        </div>
    );
}
