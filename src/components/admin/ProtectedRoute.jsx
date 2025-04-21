import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Check if user is admin
  const isAdmin = currentUser?.role === 'admin';

  // If not logged in or not an admin, redirect to login page
  if (!currentUser || !isAdmin) {
    // Save the location they were trying to access for redirect after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If logged in and is admin, render the protected route
  return children;
};

export default ProtectedRoute;
