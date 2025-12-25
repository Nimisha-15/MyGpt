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

const App = () => {
  const { user } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/loading") return <Loading />;

  return (
    <>
      {!isMenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert"
          onClick={() => setIsMenuOpen(true)}
        />
      )}

      {/* 🔹 Main app always loads, even if user is demo */}
      <div className="dark:bg-gradient-to-b dark:from-[#242124] dark:to-[#000000] dark:text-white">
        <div className="flex h-screen w-screen p-2">
          <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

          <Routes>
            <Route path="/" element={<Chatbox />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/community" element={<Community />} />
            <Route path="/login" element={<Login />} />
          </Routes>

          <Message />
        </div>
      </div>
    </>
  );
};

export default App;
