import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return 

  if (!user?.is_authenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
