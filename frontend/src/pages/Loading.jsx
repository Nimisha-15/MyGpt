import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext"; // To get current theme
// import StyledWrapper from "styled-components";
import Loader from "../components/Loader";

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
    <div className="flex items-center justify-center h-screen bg-black">
      <Loader />
    </div>
  );
};

export default Loading;
