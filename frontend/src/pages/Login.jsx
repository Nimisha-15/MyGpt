import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { axios, setUser } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const url = state === "login" ? "/api/user/login" : "/api/user/register";
    const payload =
      state === "login"
        ? { email: formData.email, password: formData.password }
        : formData;

    try {
      console.log("API Call:", url, payload);
      const { data } = await axios.post(url, payload, {
        withCredentials: true,
      });

      console.log("API Response:", data);

      // 🔥 FIXED SAFE CHECK
      if (data && (data.success === true || data.success !== false)) {
        setUser(data.user || data.data?.user || data);
        toast.success(data.message || "Success!");
        navigate("/");
      } else {
        toast.error(data?.message || "Registration/Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-screen w-full flex p-6">
      <div className="hidden md:block w-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1766582888708-04ab69f2277a?q=80&w=1036&auto=format&fit=crop"
          alt="login"
        />
      </div>

      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-950">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl px-8 py-10"
        >
          <h1 className="text-white text-3xl font-medium text-center">
            {state === "login" ? "Login" : "Sign up"}
          </h1>
          <p className="text-gray-400 text-sm mt-2 text-center">
            Please sign in to continue
          </p>

          {state === "register" && (
            <div className="flex items-center mt-6 bg-gray-800 border border-gray-700 h-12 rounded-full pl-6 gap-2">
              <input
                type="text"
                placeholder="Name"
                className="w-full text-white outline-none bg-transparent"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex items-center mt-4 bg-gray-800 border border-gray-700 h-12 rounded-full pl-6 gap-2">
            <input
              type="email"
              placeholder="Email id"
              className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center mt-4 bg-gray-800 border border-gray-700 h-12 rounded-full pl-6 gap-2">
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full h-11 rounded-full text-white bg-indigo-600 hover:bg-indigo-500 transition"
          >
            {state === "login" ? "Login" : "Sign up"}
          </button>

          <p
            className="text-gray-400 text-sm mt-6 text-center cursor-pointer"
            onClick={() => setState(state === "login" ? "register" : "login")}
          >
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span className="text-indigo-400 hover:underline ml-1">
              click here
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
