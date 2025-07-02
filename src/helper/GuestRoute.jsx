import Loader from "@/components/Loader";
import React, { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const isAuthenticated = localStorage.getItem("user-visited-dashboard");

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <Suspense fallback={<Loader/>}>
      <Outlet />
    </Suspense>
  );
};

export default GuestRoute;