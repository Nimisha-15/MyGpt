import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Message from "./components/Message";
import Chatbox from "./components/Chatbox";
import Credits from "./pages/Credits";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Loading from "./pages/Loading";
import { assets } from "./assets/assets";
import { useAppContext } from "./context/AppContext";
import "./assets/prism.css";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user, loadingUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/loading" || loadingUser) return <Loading />;

  return (
    <>
      <Toaster />
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      {/* 🔹 Main app always loads, even if user is demo */}
      {user ? (
        <div className="dark:bg-linear-to-b dark:from-[#242124] dark:to-[#000000] dark:text-white">
          <div className="flex h-screen w-screen p-2">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<Chatbox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
            <Message />
          </div>
        </div>
      ) : (
        <div className="dark:bg-linear-to-b dark:from-[#242124] dark:to-[#000000] flex items-center justify-center h-screen w-screen ">
          <Login />
        </div>
      )}
    </>
  );
};

export default App;
