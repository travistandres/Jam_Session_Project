import { useRef, useState, useEffect } from "react";
import "./index.css";
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import { useNavigate } from "react-router-dom";
import {
  getTextFiles,
  updateTextFile,
} from "./api/endpointMethods/TextFiles.cjs";

function Notes({ selectedProject }) {
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [notes, setNotes] = useState("");
  const [textID, setTextID] = useState(0);
  const [text, setText] = useState([]);
  const editorInstance1 = useRef(null); // Ref for the first editor instance
  const editorInstance2 = useRef(null); // Ref for the second editor instance

  useEffect(() => {
    getTextFiles(localStorage.getItem("token"), selectedProject)
      .then((result) => {
        setText(result);

        setTitle(result.map((item) => item.file_Name));
        setLyrics(result.map((item) => item.lyrics));
        setNotes(result.map((item) => item.notes));
        setTextID(result.map((item) => item.text_File_ID));
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  useEffect(() => {
    // Initialize Editor.js
    const editorContainer1 = document.getElementById("editorjs-container-1");
    const editorContainer2 = document.getElementById("editorjs-container-2");
    const timer = setTimeout(() => {
      if (editorContainer1 && editorContainer2) {
        editorInstance1.current = new EditorJS({
          holder: "editorjs-container-1",
          placeholder: "Start typing your lyrics here...",
          data: {
            blocks: [
              {
                type: "paragraph",
                data: {
                  text: `${lyrics}`,
                },
              },
            ],
          },
          tools: {
            header: {
              class: Header,
              inlineToolbar: ["bold", "italic"],
              config: {
                placeholder: "Enter header",
              },
            },
          },
          onReady: () => {},
          onChange: (api, event) => {
            console.log("Editor content has changed");
            editorInstance1.current
              .save()
              .then((outputData) => {
                console.log("Saving content:", outputData);
                updateTextFile(
                  localStorage.getItem("token"),
                  textID,
                  selectedProject,
                  null,
                  outputData,
                  null
                );
              })
              .catch((error) => {
                console.error("Autosave failed: ", error);
              });
          },
        });

        editorInstance2.current = new EditorJS({
          holder: "editorjs-container-2",
          placeholder: "Notes",
          data: {
            blocks: [
              {
                type: "paragraph",
                data: {
                  text: `${notes}`,
                },
              },
            ],
          },
          tools: {
            paragraph: {
              class: Paragraph,
              inlineToolbar: false,
              config: {
                toolbar: false,
              },
            },
          },
          onReady: () => {
            const toolbar = document.querySelector(
              "#editorjs-container-2 .ce-toolbar"
            );
            toolbar.style.display = "none";
          },
          onChange: (api, event) => {
            editorInstance2.current
              .save()
              .then((outputData) => {
                console.log("Saving content:", outputData);
                // You can replace the console log with an API call to save content
                // Example API call (you can use Fetch, Axios, or other methods):
                // fetch('/save-endpoint', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify({ content: outputData }),
                // });
              })
              .catch((error) => {
                console.error("Autosave failed: ", error);
              });
          },
        });
      }
    }, 50); // Delay of 50 milliseconds

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
  }, [notes, lyrics]);

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
        <div className="flex flex-row mt-3">
          <div className="flex w-8/12 ">
            <div id="editorjs-container-1" className=" pl-6 w-full"></div>
          </div>
          <div className="flex w-4/12">
            <div id="editorjs-container-2" className="w-full"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notes;
