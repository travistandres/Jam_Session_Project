import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";

function Notes({ selectedProject }) {
  const [title, setTitle] = useState("");

  return (
    <>
      <div className="px-20 py-12 flex flex-col">
        <div className="mb-16">
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
            <p className="text-[#666] text-nowrap text-xs">
              Last Edited: 11/08/24
            </p>
          </div>
        </div>
        <hr className="bg-[#666]" />
        {/* below the underline */}
        <div className="flex flex-row px-6 mt-3">
          <div className="flex">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corporis
            commodi laudantium placeat ducimus debitis! Nisi, accusamus impedit
            omnis illo doloribus suscipit sint labore explicabo enim deleniti
            ipsa tempora iusto exercitationem?
          </div>
          <div className="flex-shrink-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo quam
            quidem quia at, facilis consequatur, nemo animi nulla ad, sit eos
            dignissimos quasi temporibus asperiores nobis voluptate veritatis
            autem praesentium!
          </div>
        </div>
      </div>
    </>
  );
}

export default Notes;
