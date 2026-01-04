import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // To get current theme

const Loading = () => {
  const navigate = useNavigate();
  const { theme, fetchUser } = useAppContext();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUser();
      navigate("/");
    }, 9000); // Redirect after 15 seconds

    return () => clearTimeout(timeout);
  }, [navigate]);

  const isDark = theme === "dark";

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center transition-all duration-1000 ${
        isDark
          ? "bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"
          : "bg-gradient-to-br from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]"
      }`}
    >
      {/* Animated Background Orbs (subtle) */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse ${
            isDark ? "bg-cyan-500" : "bg-sky-400"
          }`}
        />
        <div
          className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse delay-1000 ${
            isDark ? "bg-purple-600" : "bg-blue-500"
          }`}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo + App Name */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                M
              </span>
            </div>
          </div>
          <h1
            className={`text-4xl font-bold tracking-tight ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            MyChatGPT
          </h1>
        </div>

        {/* Spinner */}
        <div className="relative">
          <div
            className={`w-16 h-16 rounded-full border-4 border-transparent animate-spin
              bg-gradient-to-r from-cyan-500 to-blue-600 p-1`}
          >
            <div className="w-full h-full rounded-full bg-inherit"></div>
          </div>
          <div className="absolute inset-0 rounded-full animate-ping">
            <div
              className={`w-full h-full rounded-full ${
                isDark ? "bg-cyan-400/20" : "bg-sky-400/30"
              }`}
            />
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <p
            className={`text-lg font-medium ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Loading your experience...
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting in few seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
