import { useState } from 'react';
import { STARS } from '../constants';

export default function EditBookingModal({ booking, poojas, onClose, onSave }) {
    const [form, setForm] = useState({
        devoteeName: booking.devoteeName,
        devoteeStar: booking.devoteeStar,
        poojaId: booking.poojaId,
        date: new Date(booking.date).toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(booking.id, form);
    };

    const selectedPooja = poojas.find(p => p.id === parseInt(form.poojaId));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-xl font-bold mb-4 text-slate-800">Edit Booking</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Select Ritual</label>
                        <select className="w-full border p-2 rounded"
                            value={form.poojaId} onChange={e => setForm({ ...form, poojaId: e.target.value })}>
                            {poojas.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (₹{p.rate})</option>
                            ))}
                        </select>
                        <p className="text-sm text-amber-600 mt-1 font-bold">Rate: ₹{selectedPooja?.rate}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Devotee Name</label>
                        <input className="w-full border p-2 rounded"
                            value={form.devoteeName} onChange={e => setForm({ ...form, devoteeName: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Devotee Star</label>
                        <select className="w-full border p-2 rounded"
                            value={form.devoteeStar} onChange={e => setForm({ ...form, devoteeStar: e.target.value })}>
                            <option value="">-- Select Star --</option>
                            {STARS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Pooja Date</label>
                        <input type="date" className="w-full border p-2 rounded"
                            value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div className="flex gap-2 justify-end mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
