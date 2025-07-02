import Loader from "@/components/Loader";
import React, { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthRoute = () => {

  const location = useLocation();
  const isAuthenticated = localStorage.getItem("user-visited-dashboard");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && location.pathname === "/") {
    return <Navigate to="/chat" replace />;
  }

  return (
    <Suspense fallback={<Loader/>}>
      <Outlet />
    </Suspense>
  );
};

export default AuthRoute;