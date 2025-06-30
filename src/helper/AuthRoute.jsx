import Loader from "@/components/Loader";
import React, { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoute = () => {
  const isAuthenticated = localStorage.getItem("user-visited-dashboard");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Suspense fallback={<Loader/>}>
      <Outlet />
    </Suspense>
  );
};

export default AuthRoute;