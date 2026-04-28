import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl">
            🏠 EasyHomeSearch
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link to="/listings" className="text-gray-600 hover:text-primary-600 transition-colors">
              Browse
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-outline text-sm px-3 py-1.5"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm px-3 py-1.5">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
