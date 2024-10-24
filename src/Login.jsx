import { useState } from "react";
import "./index.css";

function Login() {
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <>
      <div className="flex-col flex">
        <header>
          <h1 className="text-2xl text-center mt-6">Jam Session</h1>
        </header>
        <main className="p-32 text-center justify-center align-middle">
          <section className="mb-4">
            <div>
              <h1 className="text-4xl text-center">Welcome!</h1>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 max-w-xs mx-auto">
              <div className="mb-4">
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border p-2 w-full rounded-lg text-black"
                  required
                  placeholder="Username"
                />
              </div>
              <div className="mb-10">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 w-full rounded-lg text-black"
                  required
                  placeholder="Password"
                />
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
              <span className="px-1 text-btn">Sign Up</span>
            </p>
          </section>
        </main>
      </div>
    </>
  );
}

export default Login;
