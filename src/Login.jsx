import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const goToHome = () => {
    // navigate("/signup");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
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
            <form onSubmit={handleSubmit} className="mt-8 max-w-xs mx-auto">
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
              <div className="mb-5">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 w-full rounded-lg text-black textfield-bg"
                  required
                  placeholder="Password"
                />
              </div>

              <div className="mb-5 text-btn">
                <a href="">
                  <p>Forgot password?</p>
                </a>
              </div>
              <button
                type="submit"
                className="btn-bg text-white p-4 rounded-lg w-full cursor-pointer "
              >
                Login
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
