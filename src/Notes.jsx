import { useRef, useState, useEffect } from "react";
import "./index.css";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import { useNavigate } from "react-router-dom";

function Notes({ selectedProject }) {
  const [title, setTitle] = useState("");
  const editorInstance1 = useRef(null); // Ref for the first editor instance
  const editorInstance2 = useRef(null); // Ref for the second editor instance

  useEffect(() => {
    const editorContainer1 = document.getElementById("editorjs-container-1");
    const editorContainer2 = document.getElementById("editorjs-container-2");
    // Initialize Editor.js
    const timer = setTimeout(() => {
      if (editorContainer1 && editorContainer2) {
        editorInstance1.current = new EditorJS({
          holder: "editorjs-container-1",
          placeholder: "Start typing your lyrics here...",
          tools: {
            header: {
              class: Header,
              inlineToolbar: ["bold", "italic"],
              config: {
                placeholder: "Enter header",
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
          },
          onReady: () => {
            // When Editor.js is ready, attach focus/blur event listeners
            const editorContainer1 = document.querySelector(
              "#editorjs-container-1"
            );
            const editorContainer2 = document.querySelector(
              "#editorjs-container-2"
            );
            const toolbarplus = document.querySelector(".ce-toolbar__plus");
            const toolbarsettings = document.querySelector(
              ".ce-toolbar__settings-btn"
            );

            if (editorContainer1 && toolbarplus && toolbarsettings) {
              // Function to hide the plus buttons
              const hideToolbarButtons = () => {
                toolbarplus.style.display = "none"; // Hide the toolbar with plus buttons
                toolbarsettings.style.display = "none";
              };

              // Function to show the plus buttons
              const showToolbarButtons = () => {
                toolbarplus.style.display = "hidden"; // Hide the toolbar with plus buttons
                toolbarsettings.style.display = "hidden";
              };

              // Listen for focus and blur events on the editor container
              editorContainer1.addEventListener("focus", showToolbarButtons);
              editorContainer2.addEventListener("focus", showToolbarButtons);
              editorContainer1.addEventListener("blur", hideToolbarButtons);
              editorContainer2.addEventListener("blur", hideToolbarButtons);
            }
          },
          onChange: (api, event) => {
            console.log("Editor 1 Data changed", event);
          },
        });

        editorInstance2.current = new EditorJS({
          holder: "editorjs-container-2",
          placeholder: "Start typing your notes here...",
          tools: {
            header: {
              class: Header,
              inlineToolbar: ["bold", "italic"],
              config: {
                placeholder: "Enter header",
              },
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
          },
        });
      }
    }, 1); // Delay of 1 milliseconds

    return () => {
      clearTimeout(timer);
      if (editorInstance1.current) {
        editorInstance1.current.destroy();
        editorInstance1.current = null;
      }
      if (editorInstance2.current) {
        editorInstance2.current.destroy();
        editorInstance2.current = null;
      }
    };
  }, []);

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
              maxLength="24"
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
          <div className="flex w-8/12 ">
            <div id="editorjs-container-1" className="w-full"></div>
          </div>
          <div className="w-4/12 pl-6">
            <div id="editorjs-container-2" className="w-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notes;
