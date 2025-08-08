import Loader from "@/components/Loader";
import { ProfileProvider } from "@/Context/ProfileContext";
import React, { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("user-visited-dashboard");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === "/") {
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/chat" replace />;
    }
  }

  return (
    <Suspense fallback={<Loader />}>
      <ProfileProvider>
        <Outlet />
      </ProfileProvider>
    </Suspense>
  );
};

export default AuthRoute;
