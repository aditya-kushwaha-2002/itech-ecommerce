import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, admin = false }) => {
  const location = useLocation();
  const session = JSON.parse(localStorage.getItem("itechSession") || "null");
  if (!session?.token)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (admin && session.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
