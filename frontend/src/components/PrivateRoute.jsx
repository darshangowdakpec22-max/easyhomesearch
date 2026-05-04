import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center p-20 text-gray-500">Loading…</div>;
  return user ? children : <Navigate to="/login" replace />;
}
