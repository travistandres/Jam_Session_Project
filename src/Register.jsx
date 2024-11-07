import { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordIsMatch, setPasswordIsMatch] = useState(true);
  const [loading, setLoading] = useState(false);

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
      const payload = {
        name: username,
        email: email,
        password: password,
      };

      try {
        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Sign Up Failed.");
        }

        const data = await response.json();
        console.log("Response data", data);
        console.log("Successfully signed up");
        navigate("/signup/verified");
      } catch (error) {
        console.log("Error during API call: ", error);
      } finally {
        setLoading(false);
      }
      // Put logic here
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
              <div className="mb-4">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-2 w-full rounded-lg text-black textfield-bg"
                  required
                  placeholder="Password"
                />
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
              <div className="mb-5">
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border p-2 w-full rounded-lg text-black textfield-bg"
                  required
                  placeholder="Confirm password"
                />
                {!passwordIsMatch && (
                  <p className="text-left mt-2 password-unmet">
                    Passwords don't match
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="btn-bg text-white p-4 rounded-lg w-full cursor-pointer "
              >
                {loading ? <div className="loading-icon"></div> : "Login"}
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
