import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiLogOut, FiUser, FiGrid, FiSearch, FiCheckSquare, FiBarChart2 } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-wide">
          <FiCalendar className="text-yellow-300" />
          EventPortal
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-yellow-300 transition">Events</Link>
          <Link to="/search" className="flex items-center gap-1 hover:text-yellow-300 transition">
            <FiSearch className="text-sm" /> Search
          </Link>

          {user ? (
            <>
              <Link to="/my-registrations" className="hover:text-yellow-300 transition">My RSVPs</Link>

              <Link to="/check-in" className="flex items-center gap-1 hover:text-yellow-300 transition">
                <FiCheckSquare className="text-sm" /> Check-In
              </Link>

              {user.role === 'admin' && (
                <>
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 hover:text-yellow-300 transition"
                  >
                    <FiGrid /> Admin
                  </Link>

                  <Link
                    to="/admin/analytics"
                    className="flex items-center gap-1 hover:text-yellow-300 transition"
                  >
                    <FiBarChart2 /> Analytics
                  </Link>
                </>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-800 px-3 py-1.5 rounded-md transition text-sm"
              >
                <FiUser /> {user.name}
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-indigo-900 hover:bg-red-600 px-3 py-1.5 rounded-md transition text-sm"
              >
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition">Login</Link>
              <Link
                to="/register"
                className="bg-yellow-400 text-indigo-900 font-semibold px-3 py-1.5 rounded-md hover:bg-yellow-300 transition text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
