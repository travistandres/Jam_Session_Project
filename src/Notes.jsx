import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

function Notes({ selectedProject }) {
  const [title, setTitle] = useState("");

  return (
    <>
      <div className="px-20 py-12 flex flex-col">
        <div className="mb-20">
          <h1 className="text-4xl">Lyrics/Notes</h1>
        </div>
        <div className="mb-3 px-6 flex justify-between items-end">
          <div>
            <input
              type="text"
              value={title}
              className="outline-none text-3xl bg-[#1a181b] placeholder:text-[#666] overflow-hidden w-[350px] text-ellipsis focus:w-[500px]"
              placeholder="Song Title"
              onChange={(e) => setTitle(e.target.value)}
              maxlength="27"
            />
          </div>
          <div>
            <p className="text-[#666] text-nowrap">Last Edited: 11/08/24</p>
          </div>
        </div>
        <hr className="bg-[#666]" />
      </div>
    </>
  );
}

export default Notes;
