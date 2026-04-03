import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_BADGE = {
  admin: 'bg-red-100 text-red-700',
  analyst: 'bg-blue-100 text-blue-700',
  viewer: 'bg-green-100 text-green-700',
};

const Navbar = () => {
  const { user, logout, hasRole, page, setPage } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-bold text-emerald-400 tracking-tight">
          FinanceOS
        </Link>
        <div className="flex gap-4 text-sm">
          <Link to="/dashboard" className={`hover:text-emerald-400 transition-colors ${page === "dashboard" ? "text-emerald-400 underline" : ""}`} onClick={() => setPage("dashboard")}>Dashboard</Link>
          <Link to="/transactions" className={`hover:text-emerald-400 transition-colors ${page === "transactions" ? "text-emerald-400 underline" : ""}`} onClick={() => setPage("transactions")}>Transactions</Link>
          {hasRole('admin') && (
            <Link to="/users" className={`hover:text-emerald-400 transition-colors ${page === "users" ? "text-emerald-400 underline" : ""}`} onClick={() => setPage("users")}>Users</Link>
          )}
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${ROLE_BADGE[user.role]}`}
          >
            {user.role.toUpperCase()}
          </span>
          <span className="text-sm text-gray-300">{user.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;