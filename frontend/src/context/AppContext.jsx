import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // 🔹 Use a dummy user so UI loads immediately
  const [user, setUser] = useState({
    name: "Demo User",
    credits: 100,
  });

  const [chats, setChats] = useState(dummyChats);
  const [selectedChats, setSelectedChats] = useState(dummyChats[0]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // 🔹 Fetch real user if logged in (overwrites dummy user)
  const fetchUser = async () => {
    try {
      const res = await fetch(dummyUserData, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch (err) {
      console.log("Not logged in, using demo user");
    }
  };

  // 🔹 Fetch user chats
  const fetchUserChats = async () => {
    try {
      const res = await fetch(dummyChats, {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();
      setChats(data.chats);
      setSelectedChats(data.chats[0] || null);
    } catch (error) {
      console.log("Chat fetch failed, using empty chats");
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await fetch("http://localhost:4500/api/auth/logout", {
        credentials: "include",
      });
    } catch (err) {
      console.log("Logout failed");
    } finally {
      setUser({ name: "Demo User", credits: 100 }); // restore dummy user
      setChats([]);
      setSelectedChats(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]);
      setSelectedChats(null);
    }
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    fetchUser,
    logout,
    chats,
    setChats,
    selectedChats,
    setSelectedChats,
    theme,
    setTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
