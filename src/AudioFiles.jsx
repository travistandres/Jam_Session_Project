import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

function AudioFiles() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col w-52"></div>
    </>
  );
}

export default AudioFiles;
