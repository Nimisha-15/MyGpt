import React, { useState } from "react";

const Login = () => {
  const [mode, setMode] = useState("login"); // login | register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = mode === "register";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "login") {
      console.log("LOGIN DATA", { email, password });
    } else {
      console.log("REGISTER DATA", { name, email, password });
    }
  };

  return (
    <div className="min-h-screen bg-slate-600 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-6xl h-[85vh] bg-white rounded-2xl overflow-hidden">
        {/* SLIDER */}
        <div
          className={`flex w-[200%] h-full transition-transform duration-700 ease-in-out ${
            isRegister ? "-translate-x-1/2" : "translate-x-0"
          }`}
        >
          {/* ================= LOGIN ================= */}
          <div className="w-1/2 h-full flex">
            {/* IMAGE */}
            <div className="w-1/2 bg-slate-900 flex items-center justify-center">
              <img
                src="https://readymadeui.com/signin-image.webp"
                className="w-[80%]"
                alt="login"
              />
            </div>

            {/* FORM */}
            <div className="w-1/2 flex items-center justify-center">
              <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <h2 className="text-3xl font-bold mb-4">Login</h2>

                <p className="text-sm mb-6">
                  Don’t have an account?
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-blue-800 ml-1 underline"
                  >
                    Create New Account
                  </button>
                </p>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full mb-4 border-b py-2 outline-none"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full mb-8 border-b py-2 outline-none"
                />

                <button
                  type="submit"
                  className="w-full py-3 mt-6 bg-slate-900 text-white rounded-full"
                >
                  Login
                </button>
              </form>
            </div>
          </div>

          {/* ================= REGISTER ================= */}
          <div className="w-1/2 h-full flex">
            {/* IMAGE */}
            <div className="w-1/2 bg-slate-900 flex items-center justify-center">
              <img
                src="https://readymadeui.com/signin-image.webp"
                className="w-[80%]"
                alt="register"
              />
            </div>

            {/* FORM */}
            <div className="w-1/2 flex items-center justify-center">
              <form onSubmit={handleSubmit} className="w-full max-w-sm">
                <h2 className="text-3xl font-bold mb-4">Create Account</h2>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full mb-4 border-b py-2 outline-none"
                />

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full mb-4 border-b py-2 outline-none"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full mb-8 border-b py-2 outline-none"
                />

                <p className="text-sm mb-4">
                  Already have an account?
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-blue-600 ml-1 underline"
                  >
                    Login
                  </button>
                </p>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 text-white rounded-full"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
