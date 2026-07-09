import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const links = [
    { to: '/dashboard', label: 'All Complaints' },
    ...(user?.role === 'user' ? [{ to: '/add-complaint', label: 'Add Complaint' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Admin Panel' }] : []),
  ];

  return (
    <aside className="w-full md:w-64 bg-white shadow-md rounded-lg p-4 h-fit">
      <h2 className="font-semibold text-gray-700 mb-4">Menu</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`block px-3 py-2 rounded transition-colors ${
                location.pathname === link.to
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
