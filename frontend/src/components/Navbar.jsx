import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(true);

  // Load theme from localStorage
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  return (
    <nav className="flex items-center justify-between px-7 py-3 bg-white  dark:bg-black  text-black dark:text-white">
      {/* Left - Logo */}
      <h1 className="text-2xl font-extrabold">MyGPT</h1>

      {/* Center - Navigation */}
      <div className="hidden md:flex space-x-10 font-medium">
        <Link to="/about" className="hover:text-gray-400">
          About
        </Link>
        <Link to="/products" className="hover:text-gray-400">
          Products
        </Link>
        <Link to="/components" className="hover:text-gray-400">
          Components
        </Link>
        <Link to="/support" className="hover:text-gray-400">
          Support
        </Link>
        <Link to="/contact" className="hover:text-gray-400">
          Contact
        </Link>
      </div>

      {/* Right - Theme Toggle + Auth */}
      <div className="flex items-center space-x-6">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
