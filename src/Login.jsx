import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { login, register } from "./api/endpointMethods/Users.cjs";
import React from 'react';

function Login() {
  const [userLogin, setUserLogin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    login(userLogin, password)
      .then((result) => {
        console.log("Response data", result);

        // decode JWT token to get userData
        const decoded = jwtDecode(result.token);

        localStorage.setItem("token", result.token);
        localStorage.setItem("userData", JSON.stringify(decoded));
        navigate("/home");
        setLoading(false);
      })
      .catch((err) => {
        setError("Invalid credentials, please try again.");
        console.error("Error during API call: ", err);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="flex-col flex">
        <header>
          <h1 className="text-2xl text-center mt-6">Jam Session</h1>
        </header>
        <main className="mt-32 text-center justify-center align-middle">
          <section className="mb-4">
            <div>
              <h1 className="text-5xl text-center">Welcome!</h1>
            </div>
            <form
              onSubmit={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                handleSubmit(e);
              }}
              className="mt-6 max-w-xs mx-auto"
            >
              <div className="password-unmet h-7 text-xs">
                {error && <p>{error}</p>}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  id="email"
                  value={userLogin}
                  onChange={(e) => setUserLogin(e.target.value)}
                  className="border p-2 w-full rounded-lg text-black textfield-bg"
                  required
                  placeholder="Email or Username"
                />
              </div>
              <div className="mb-5 relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 w-full rounded-lg text-black textfield-bg pr-10"
                  required
                  placeholder="Password"
                />
                <div
                  onClick={togglePasswordVisibility}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer z-10"
                >
                  {passwordVisible ? (
                    <AiFillEyeInvisible
                      size={24}
                      style={{ color: "#1A181B" }}
                    />
                  ) : (
                    <AiFillEye size={24} style={{ color: "#1A181B" }} />
                  )}
                </div>
              </div>

              <div className="mb-5 text-btn">
                <a href="">
                  <p>Forgot password?</p>
                </a>
              </div>
              <button
                type="submit"
                className="btn-bg text-white p-4 rounded-lg w-full cursor-pointer"
                disabled={loading}
              >
                {loading ? <div className="loading-icon"></div> : "Login"}
              </button>
            </form>
          </section>
          <section>
            <p>
              Don't have an account?
              <a href="/signup">
                <span className="px-1 text-btn">Sign Up</span>
              </a>
            </p>
          </section>
        </main>
      </div>
    </>
  );
}

export default Login;
