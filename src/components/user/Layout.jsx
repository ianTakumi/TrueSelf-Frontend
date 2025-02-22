import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="p-4 flex-grow overflow-auto bg-[#FAFAFA] mt-20 font-raleway">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
