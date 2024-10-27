import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

function Verify() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/");
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
          <section className="mb-4 ">
            <div>
              <h1 className="text-5xl text-center">Verify your email</h1>
            </div>
            <div className="mt-8 max-w-xs mx-auto">
              <div className="text-left text-s">
                <p className="mb-2">
                  Your email is not verified. Check your inbox to verify your
                  email
                </p>

                <p className="mb-20">
                  We don't really send you an email lol. We just have this page
                  to be formal.
                </p>
              </div>

              <button
                onClick={goToHome}
                className="btn-bg text-white p-4 rounded-lg w-full cursor-pointer "
              >
                Login
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Verify;
