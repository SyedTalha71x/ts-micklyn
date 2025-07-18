import React from 'react';
import Sidebar from '@/components/admin-dashboard/Sidebar';
import Header from '@/components/admin-dashboard/Header';
import { Outlet } from 'react-router-dom';
const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;