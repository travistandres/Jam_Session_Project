import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here
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
              <h1 className="text-5xl text-center">You are logged in</h1>
            </div>
            <div className="mt-8 max-w-xs mx-auto">
              <div className="text-left text-s">
                <p className="mb-20">
                  If you see this then the login API is working.
                </p>
              </div>

              <button
                onClick={goToLogin}
                className="btn-bg text-white p-4 rounded-lg w-full cursor-pointer "
              >
                Log Out
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Home;
