import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => location.pathname.includes(path)
        ? 'bg-amber-100 text-amber-900 shadow-sm'
        : 'text-stone-400 hover:text-amber-100 hover:bg-amber-900/30';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-stone-100 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-amber-950 text-amber-50 flex flex-col p-6 shadow-2xl z-10">
                <h2 className="text-2xl font-bold mb-10 text-amber-500 tracking-wide border-b border-amber-900 pb-4">Devvaswom Admin</h2>
                <nav className="flex flex-col space-y-3">
                    <Link to="/admin/bookings" className={`block p-3 rounded-xl transition font-medium ${isActive('bookings')}`}>
                        📅 Bookings
                    </Link>
                    <Link to="/admin/poojas" className={`block p-3 rounded-xl transition font-medium ${isActive('poojas')}`}>
                        🪔 Manage Poojas
                    </Link>
                    <Link to="/admin/events" className={`block p-3 rounded-xl transition font-medium ${isActive('events')}`}>
                        🎉 Manage Events
                    </Link>

                    <div className="pt-8 border-t border-amber-900/50 mt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left bg-red-900/20 hover:bg-red-900/40 text-red-200 hover:text-red-100 p-3 rounded-xl transition font-medium flex items-center gap-3"
                        >
                            🚪 Sign Out
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-stone-100 p-8">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
