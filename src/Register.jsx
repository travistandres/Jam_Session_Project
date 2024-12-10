import { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { register } from "./api/endpointMethods/Users.cjs";
import React from "react";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordIsMatch, setPasswordIsMatch] = useState(true);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const togglePasswordVisibility2 = () => {
    setPasswordVisible2(!passwordVisible2);
  };

  //Password criteria
  const isPasswordLongEnough = password.length >= 8;
  const containsNumber = /\d/.test(password);

  const validatePassword = (password) => {
    const isValid = /^(?=.*[0-9])(?=.{8,})/.test(password);
    return isValid;
  };

  useEffect(() => {
    setPasswordIsMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (validatePassword(password) && password == confirmPassword) {
      register(username, email, password)
        .then((result) => {
          console.log("Response data", result);
          console.log("Successfully signed up");
          setLoading(false);
          navigate("/signup/verified");
        })
        .catch((err) => {
          console.log("Error during API call: ", err);
        });
    } else {
      console.log("Not Valid");
    }
  };

  return (
    <>
      <div className="flex-col flex">
        <header>
          <h1 className="text-2xl text-center mt-6">Jam Session</h1>
        </header>
        <main className="mt-16 text-center justify-center align-middle">
          <section className="mb-4">
            <div>
              <h1 className="text-5xl text-center">Create an account</h1>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 max-w-xs mx-auto">
              <div className="mb-4">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border p-2 w-full rounded-lg text-black textfield-bg"
                  required
                  placeholder="Username"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 w-full rounded-lg text-black textfield-bg"
                  required
                  placeholder="Email"
                />
              </div>
              <div className="mb-4 relative">
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
                  className="absolute top-4 right-3 transform -translate-y-2 cursor-pointer z-10"
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
                <div className="pt-4 pb-1 flex flex-col content-start flex-wrap">
                  <p>Password must have:</p>
                </div>
                <ul className="list-disc list-inside content-start text-left">
                  <li
                    className={`${
                      isPasswordLongEnough ? "password-met" : "password-unmet"
                    }`}
                  >
                    At least 8 characters
                  </li>
                  <li
                    className={`${
                      containsNumber ? "password-met" : "password-unmet"
                    }`}
                  >
                    At least 1 number
                  </li>
                </ul>
              </div>
              <div className="relative">
                <input
                  type={passwordVisible2 ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border p-2 w-full rounded-lg text-black textfield-bg pr-10"
                  required
                  placeholder="Confirm password"
                />
                <div
                  onClick={togglePasswordVisibility2}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer z-10"
                >
                  {passwordVisible2 ? (
                    <AiFillEyeInvisible
                      size={24}
                      style={{ color: "#1A181B" }}
                    />
                  ) : (
                    <AiFillEye size={24} style={{ color: "#1A181B" }} />
                  )}
                </div>
              </div>
              <div className="mt-2 mb-5">
                {!passwordIsMatch && (
                  <p className="text-left password-unmet">
                    Passwords don't match
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn-bg text-white p-4 rounded-lg w-full cursor-pointer "
              >
                {loading ? <div className="loading-icon"></div> : "Register"}
              </button>
            </form>
          </section>
          <section>
            <p>
              Already have an account?
              <a href="/">
                <span className="px-1 text-btn">Sign In</span>
              </a>
            </p>
          </section>
        </main>
      </div>
    </>
  );
}

export default Register;
