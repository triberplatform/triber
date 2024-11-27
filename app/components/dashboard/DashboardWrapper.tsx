"use client"
import { useState } from "react";

const DashboardWrapper = () => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleDrawerHandler = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <div className="flex h-screen">
      {/* Drawer */}
      <div
        className={`bg-gray-800 text-white fixed top-0 left-0 h-full transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-64`}
      >
        <div className="p-4 text-lg font-bold">Persistent Drawer</div>
        <nav className="p-4 space-y-4">
          <a href="#" className="block hover:text-mainGreen">
            Home
          </a>
          <a href="#" className="block hover:text-mainGreen">
            About
          </a>
          <a href="#" className="block hover:text-mainGreen">
            Services
          </a>
          <a href="#" className="block hover:text-mainGreen">
            Contact
          </a>
        </nav>
      </div>

      {/* Content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          open ? "ml-64" : "ml-0"
        }`}
      >
        <header className="bg-gray-100 p-4 shadow-md flex items-center justify-between">
          <button
            onClick={toggleDrawerHandler}
            className="p-2 bg-gray-800 text-white rounded hover:bg-mainGreen"
          >
            {open ? "Close" : "Menu"}
          </button>
          <h1 className="text-lg font-bold">Persistent Drawer Example</h1>
        </header>

        <main className="p-6">
          <p>
            This is the main content area. When the drawer is opened, the
            content area shifts to accommodate the drawer.
          </p>
        </main>
      </div>
    </div>
  );
};

export default DashboardWrapper;
