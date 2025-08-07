import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect user to their own dashboard
    return user.role === "admin"
      ? <Navigate to="/admin" replace />
      : <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
