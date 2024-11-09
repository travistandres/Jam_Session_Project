import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Invalid Credentials");
      }

      const data = await response.json();
      console.log("Response data", data);

      // decode JWT token to get userData
      const decoded = jwtDecode(data.token);

      localStorage.setItem("token", data.token);
      localStorage.setItem("userData", JSON.stringify(decoded));
      navigate("/home");
    } catch (error) {
      console.error("Error during API call: ", error);
      setError("Invalid credentials, please try again.");
    } finally {
      setLoading(false);
    }

    console.log("Email:", email);
    console.log("Password:", password);
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
            <form onSubmit={handleSubmit} className="mt-6 max-w-xs mx-auto">
              <div className="password-unmet h-7">
                {error && <p>{error}</p>}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 w-full rounded-lg text-black textfield-bg"
                  required
                  placeholder="Email"
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
