import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import EditBookingModal from '../components/EditBookingModal';

// ... imports remain same ...

// ... imports same ...

export default function Home() {
    const [events, setEvents] = useState([]);
    const [poojas, setPoojas] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        axios.get('/api/events').then(res => setEvents(res.data));
        axios.get('/api/poojas').then(res => setPoojas(res.data));
    }, []);

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 350;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const upcomingEvents = events.filter(ev => new Date(ev.date) >= new Date().setHours(0, 0, 0, 0));

    return (
        <div className="min-h-screen bg-stone-100 font-sans text-stone-800">
            {/* Navbar */}
            <nav className="bg-amber-900 text-amber-50 p-4 shadow-lg flex justify-between items-center rounded-b-xl mx-2 mt-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-wide">Poothrikkovil Sri Narasimha Moorthi Kshethram</h1>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="font-semibold text-amber-200 hidden md:block">Hi, {user.name}</span>
                            <Link to="/profile" className="bg-amber-800/50 text-amber-100 px-4 py-2 rounded-full text-sm hover:bg-amber-800 transition border border-amber-700/50">
                                ✏️ Edit Profile
                            </Link>
                            <button onClick={() => {
                                localStorage.removeItem('user');
                                localStorage.removeItem('token');
                                setUser(null);
                                navigate('/');
                            }} className="text-red-300 hover:text-red-200 text-sm font-semibold transition">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="bg-amber-100 text-amber-900 px-5 py-2 rounded-full font-bold hover:bg-white transition shadow-sm">Devotee Login</Link>
                            <Link to="/login" state={{ role: 'admin' }} className="text-amber-300 hover:text-white transition text-sm">Admin Login</Link>
                        </>
                    )}
                </div>
            </nav>

            <div className="container mx-auto p-6 md:p-10 space-y-8">
                {user ? (
                    // LOGGED IN DASHBOARD
                    <>
                        {/* Header & Action */}
                        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 rounded-2xl shadow-xl border border-stone-200">
                            <div>
                                <h2 className="text-3xl font-bold text-amber-800 mb-2">Namaste, {user.name} 🙏</h2>
                                <p className="text-stone-500 text-lg">Manage your bookings and view upcoming temple events.</p>
                            </div>
                            <button onClick={() => navigate('/book-pooja')}
                                className="mt-6 md:mt-0 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:from-amber-700 hover:to-orange-700 shadow-md transition transform hover:scale-105 flex items-center gap-2">
                                <span className="text-2xl">+</span> Book New Pooja
                            </button>
                        </div>

                        {/* Recent/Upcoming Events - Horizontal Cards */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-stone-700 flex items-center gap-2 px-1">
                                🗓️ Upcoming Events
                            </h3>
                            {upcomingEvents.length === 0 ? (
                                <p className="text-stone-400 italic px-1">No upcoming events scheduled.</p>
                            ) : (
                                <div className="relative group px-2">
                                    {/* Left Arrow */}
                                    <button
                                        onClick={() => scroll('left')}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-5 z-10 bg-white/90 backdrop-blur text-amber-800 p-3 rounded-full shadow-lg border border-amber-100 hover:bg-amber-800 hover:text-amber-50 transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 duration-300 hidden md:block"
                                        title="Scroll Left"
                                    >
                                        ←
                                    </button>

                                    {/* Scroll Container (Train) */}
                                    <div
                                        ref={scrollRef}
                                        className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-1"
                                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                    >
                                        {upcomingEvents.map(ev => (
                                            <div key={ev.id} className="min-w-[300px] md:min-w-[350px] bg-white p-6 rounded-2xl shadow-lg border border-stone-100 hover:border-amber-200 transition group flex flex-col h-full transform hover:-translate-y-1 duration-300">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-bold text-lg text-amber-800 truncate group-hover:text-amber-600 transition flex-1 pr-2" title={ev.name}>{ev.name}</h4>
                                                    <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1 rounded-full border border-amber-100 whitespace-nowrap">
                                                        {new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-stone-500 line-clamp-3 leading-relaxed flex-1" title={ev.description}>{ev.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Arrow */}
                                    <button
                                        onClick={() => scroll('right')}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-5 z-10 bg-white/90 backdrop-blur text-amber-800 p-3 rounded-full shadow-lg border border-amber-100 hover:bg-amber-800 hover:text-amber-50 transition-all transform hover:scale-110 opacity-0 group-hover:opacity-100 duration-300 hidden md:block"
                                        title="Scroll Right"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* User Bookings Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-200">
                            <h3 className="text-xl font-bold text-stone-700 mb-6 flex items-center gap-2">
                                📜 My Bookings
                            </h3>
                            <UserBookingsList userId={user.id} poojas={poojas} />
                        </div>
                    </>
                ) : (
                    // GUEST DASHBOARD
                    <>
                        {/* Welcome Section */}
                        <div className="text-center py-12">
                            <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-orange-600 mb-6 drop-shadow-sm">Om namo narayanaya namah</h2>
                            <p className="text-2xl text-stone-500 font-light">Experience peace and divine connection.</p>
                        </div>

                        {/* Action Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Upcoming Events */}
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                                <h3 className="text-2xl font-bold text-stone-700 mb-6 flex items-center">
                                    🗓️ Upcoming Events
                                </h3>
                                <div className="space-y-4">
                                    {events.filter(ev => new Date(ev.date) >= new Date().setHours(0, 0, 0, 0)).length === 0 ? <p className="text-stone-400">No upcoming events.</p> :
                                        events.filter(ev => new Date(ev.date) >= new Date().setHours(0, 0, 0, 0)).slice(0, 5).map(ev => (
                                            <div key={ev.id} className="border-b border-stone-100 pb-4 last:border-0 hover:bg-stone-50 p-4 rounded-xl transition">
                                                <h4 className="font-bold text-amber-700 text-lg">{ev.name}</h4>
                                                <p className="text-sm text-stone-400 mb-2">{new Date(ev.date).toLocaleDateString()}</p>
                                                <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">{ev.description}</p>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Book Pooja CTA */}
                            <div className="bg-gradient-to-br from-white to-orange-50 p-10 rounded-3xl shadow-xl border border-orange-100 flex flex-col items-center text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-400"></div>
                                <h3 className="text-3xl font-bold text-amber-800 mb-4 mt-2">
                                    🙏 Book a Pooja
                                </h3>
                                <p className="text-lg text-stone-600 mb-8 max-w-lg leading-relaxed">
                                    Perform a sacred ritual for yourself or your loved ones. Choose from our list of available poojas and book a slot today.
                                </p>
                                <div onClick={() => navigate('/login', { state: { from: '/book-pooja' } })}
                                    className="cursor-pointer bg-gradient-to-r from-orange-600 to-red-600 text-white px-10 py-4 rounded-xl text-xl font-bold hover:shadow-2xl transition transform hover:-translate-y-1">
                                    Book Now
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Sub-component for listing user bookings to keep Home clean
function UserBookingsList({ userId, poojas }) {
    const [bookings, setBookings] = useState([]);
    const [editingBooking, setEditingBooking] = useState(null);

    const fetchBookings = () => {
        axios.get('/api/bookings').then(res => {
            const myBookings = res.data.filter(b => b.userId === userId || (b.user && b.user.id === userId));
            setBookings(myBookings);
        });
    };

    useEffect(() => {
        fetchBookings();
    }, [userId]);

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
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to cancel");
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            await axios.put(`/api/bookings/${id}`, data);
            alert("Booking updated.");
            setEditingBooking(null);
            fetchBookings();
        } catch (err) {
            alert(err.response?.data?.error || "Failed to update");
        }
    };

    if (bookings.length === 0) return <p className="text-stone-400 italic">You haven't made any bookings yet.</p>;

    return (
        <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-stone-50 text-stone-700 border-b border-stone-200">
                        <th className="p-4 font-bold text-sm uppercase tracking-wider">Pooja Date</th>
                        <th className="p-4 font-bold text-sm uppercase tracking-wider">Booking Date</th>
                        <th className="p-4 font-bold text-sm uppercase tracking-wider">Pooja</th>
                        <th className="p-4 font-bold text-sm uppercase tracking-wider">Devotee</th>
                        <th className="p-4 font-bold text-sm uppercase tracking-wider text-center">Status</th>
                        <th className="p-4 font-bold text-sm uppercase tracking-wider text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(b => (
                        <tr key={b.id} className="border-b border-stone-100 hover:bg-amber-50/30 transition">
                            <td className="p-4 font-medium text-stone-800">{new Date(b.date).toLocaleDateString()}</td>
                            <td className="p-4 text-stone-500 text-sm">{new Date(b.createdAt).toLocaleDateString()}</td>
                            <td className="p-4 text-amber-700 font-bold">{b.pooja?.name || 'Unknown Ritual'}</td>
                            <td className="p-4">
                                <span className="block text-stone-800 font-medium">{b.devoteeName}</span>
                                <span className="text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full mt-1 inline-block">{b.devoteeStar}</span>
                            </td>
                            <td className="p-4 text-center">
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">{b.status || 'Confirmed'}</span>
                            </td>
                            <td className="p-4 text-center">
                                {isFuture(b.date) ? (
                                    <div className="flex justify-center gap-3">
                                        <button onClick={() => setEditingBooking(b)} className="text-amber-600 hover:text-amber-800 text-sm font-semibold hover:underline">Edit</button>
                                        <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold hover:underline">Cancel</button>
                                    </div>
                                ) : (
                                    <span className="text-xs text-stone-400 italic">Completed</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
