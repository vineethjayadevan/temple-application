import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Events from './pages/admin/Events';
import Poojas from './pages/admin/Poojas';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BookPooja from './pages/BookPooja';
import AdminBookings from './pages/admin/AdminBookings';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book-pooja" element={<BookPooja />} />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="events" element={<Events />} />
          <Route path="poojas" element={<Poojas />} />
          <Route path="bookings" element={<AdminBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
