import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CM</span>
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">
              Complaint Management
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Hello, <span className="font-medium text-gray-900">{user.name}</span>
                  <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full capitalize">
                    {user.role}
                  </span>
                </span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-sm text-gray-600 hover:text-primary-600">
                    Admin Panel
                  </Link>
                )}
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary-600">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm py-1.5 px-3">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-3">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4 space-y-2">
            {user ? (
              <>
                <p className="text-sm text-gray-600 px-2">{user.name} ({user.role})</p>
                <Link to="/dashboard" className="block px-2 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-2 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded text-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-2 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block px-2 py-2 text-sm hover:bg-gray-50 rounded" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
