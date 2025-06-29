import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function AdminPrivateRoute() {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const location = useLocation();

  if (!admin?.token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default AdminPrivateRoute;
