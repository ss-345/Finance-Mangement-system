import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <span className="text-4xl">🔒</span>
        <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
        <p className="text-gray-500">Your role ({user.role}) doesn't have permission to view this page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;