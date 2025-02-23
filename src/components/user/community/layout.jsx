import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";

const Layout = () => {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <aside className="w-64  ">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 py-4 px-16 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
