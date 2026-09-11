// ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { usePass } from "./ProtectedPass"

const ProtectedRoute = () => {
  const { isVerified } = usePass();

  // If the user is not authenticated, redirect them to the login page
  if (!isVerified) {
    return <Navigate to="/SignUp" replace />;
  }

  // Otherwise, render the child route component
  return <Outlet />;
};

export default ProtectedRoute;