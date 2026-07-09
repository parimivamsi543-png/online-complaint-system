import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const logout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          ComplaintHub
        </Link>
        <div className="flex gap-4 items-center text-sm sm:text-base">
          {user ? (
            <>
              <span className="hidden sm:inline">Hi, {user.name}</span>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:underline">
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="bg-white text-blue-700 px-3 py-1 rounded font-medium hover:bg-blue-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
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
