import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { STARS } from '../constants';

export default function BookPooja() {
    const [poojas, setPoojas] = useState([]);
    const [user, setUser] = useState(null);
    const [date, setDate] = useState('');
    // Each entry tracks a devotee's specific details and their chosen ritual
    const [entries, setEntries] = useState([{ name: '', star: '', poojaId: '' }]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login', { state: { from: '/book-pooja' } });
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Initialize first entry with logged-in user's data
        setEntries([{ name: parsedUser.name, star: parsedUser.star || '', poojaId: '' }]);

        axios.get('http://localhost:3000/api/poojas').then(res => setPoojas(res.data));
    }, [navigate]);

    const handleEntryChange = (index, field, value) => {
        const newEntries = [...entries];
        newEntries[index][field] = value;
        setEntries(newEntries);
    };

    const addEntry = () => {
        setEntries([...entries, { name: '', star: '', poojaId: '' }]);
    };

    const removeEntry = (index) => {
        const newEntries = entries.filter((_, i) => i !== index);
        setEntries(newEntries);
    };

    // Calculate Total Cost
    const totalCost = entries.reduce((sum, entry) => {
        const pooja = poojas.find(p => p.id === parseInt(entry.poojaId));
        return sum + (pooja ? parseFloat(pooja.rate) : 0);
    }, 0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!date) {
            alert("Please select a date for the rituals.");
            return;
        }

        const confirmMsg = `
        Confirm Booking Details:
        Date: ${new Date(date).toLocaleDateString()}
        Total Devotees: ${entries.length}
        Total Cost: ₹${totalCost}

        Proceed?
        `;

        if (!window.confirm(confirmMsg)) return;

        try {
            const promises = entries.map(entry =>
                axios.post('http://localhost:3000/api/bookings', {
                    userId: user.id,
                    poojaId: parseInt(entry.poojaId),
                    date: date,
                    devoteeName: entry.name,
                    devoteeStar: entry.star
                })
            );

            await Promise.all(promises);

            alert(`✅ Successful! Booked for ${entries.length} devotee(s). Total: ₹${totalCost}`);
            navigate('/');
        } catch (err) {
            console.error(err);
            alert("Booking Failed. Please try again.");
        }
    };

    //... imports same

    //... imports same

    return (
        <div className="min-h-screen bg-stone-100 p-6 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-xl border border-stone-200">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-amber-800">Book Pooja Rituals</h2>
                    <Link to="/" className="text-stone-500 hover:text-amber-600 transition">← Back to Dashboard</Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Common Date Selection */}
                    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                        <label className="block text-amber-800 font-bold mb-2">📅 Select Date for Rituals</label>
                        <input type="date" required className="w-full md:w-1/3 border border-amber-200 p-3 rounded-lg bg-white text-stone-700 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                            value={date} onChange={e => setDate(e.target.value)} />
                        <p className="text-xs text-amber-700/70 mt-2 font-medium">This date applies to all bookings below.</p>
                    </div>

                    {/* Devotee Entries */}
                    <div className="space-y-6">
                        {entries.map((entry, index) => {
                            const selectedPooja = poojas.find(p => p.id === parseInt(entry.poojaId));

                            return (
                                <div key={index} className="flex flex-col md:flex-row gap-5 items-start bg-stone-50 p-6 rounded-2xl shadow-sm border border-stone-200 relative group hover:border-amber-200 transition-colors duration-300">
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wide">Devotee Name</label>
                                        <input required className="w-full border border-stone-300 p-3 rounded-lg bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition" placeholder="Full Name"
                                            value={entry.name} onChange={e => handleEntryChange(index, 'name', e.target.value)} />
                                    </div>
                                    <div className="w-full md:w-1/4">
                                        <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wide">Star</label>
                                        <select required className="w-full border border-stone-300 p-3 rounded-lg bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                                            value={entry.star} onChange={e => handleEntryChange(index, 'star', e.target.value)}>
                                            <option value="">-- Star --</option>
                                            {STARS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs text-stone-500 mb-1 font-bold uppercase tracking-wide">Select Ritual</label>
                                        <select required className="w-full border border-stone-300 p-3 rounded-lg bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition"
                                            value={entry.poojaId} onChange={e => handleEntryChange(index, 'poojaId', e.target.value)}>
                                            <option value="">-- Choose Pooja --</option>
                                            {poojas.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.rate})</option>)}
                                        </select>
                                    </div>

                                    {/* Rate Display */}
                                    <div className="w-full md:w-24 text-right pt-8">
                                        <span className="font-bold text-lg text-amber-700">₹{selectedPooja ? selectedPooja.rate : '0'}</span>
                                    </div>

                                    {entries.length > 1 && (
                                        <button type="button" onClick={() => removeEntry(index)}
                                            className="absolute top-2 right-2 md:static md:pt-8 text-stone-400 hover:text-red-500 transition text-xl font-bold md:ml-2" title="Remove">
                                            ×
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions and Total */}
                    <div className="flex flex-col md:flex-row justify-between items-center border-t border-stone-100 pt-8 gap-6">
                        <button type="button" onClick={addEntry} className="text-amber-700 font-bold hover:bg-amber-50 px-6 py-3 rounded-xl transition border border-dashed border-amber-300 hover:border-solid hover:border-amber-400">
                            + Add Another Devotee
                        </button>

                        <div className="text-right">
                            <p className="text-stone-500 text-sm font-medium">Total Amount</p>
                            <p className="text-4xl font-bold text-stone-800">₹{totalCost}</p>
                        </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-xl text-xl font-bold hover:from-amber-700 hover:to-orange-700 transition shadow-lg transform hover:-translate-y-0.5">
                        Confirm Booking (₹{totalCost})
                    </button>
                </form>
            </div>
        </div>
    );
}
