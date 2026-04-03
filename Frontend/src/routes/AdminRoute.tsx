import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { ReactNode } from "react";

const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "admin") return <Navigate to="/" />;

  return children;
};

export default AdminRoute;  