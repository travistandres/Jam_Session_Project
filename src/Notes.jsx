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

function Notes({ selectedProject, projects }) {
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [notes, setNotes] = useState("");
  const [lastEdited, setLastEdited] = useState("");
  const [textID, setTextID] = useState(0);
  const [text, setText] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [saving, setSaving] = useState(false);
  const editorInstance1 = useRef(null); // Ref for the first editor instance
  const editorInstance2 = useRef(null); // Ref for the second editor instance

  useEffect(() => {
    getTextFiles(token, selectedProject)
      .then((result) => {
        setText(result);

        setTitle(result.map((item) => item.file_Name));
        setLyrics(result.map((item) => item.lyrics));
        setNotes(result.map((item) => item.notes));
        setTextID(result.map((item) => item.text_File_ID));

        // Getting Proj Title For Breadcrumbs
        const projName = projects.find(
          (item) => item.project_ID === selectedProject
        );
        setProjectName(projName.project_Name);
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
          onReady: () => {
            if (lyrics != "") {
              editorInstance1.current.render(JSON.parse(lyrics));
            }
          },
          onChange: (api, event) => {
            setSaving(true);
            editorInstance1.current
              .save()
              .then((outputData) => {
                console.log("Saving content:", outputData);
                setTimeout(() => {
                  updateTextFile(
                    token,
                    textID,
                    selectedProject,
                    null,
                    outputData,
                    null
                  );
                  setSaving(false);
                }, 500);
              })
              .catch((error) => {
                console.error("Autosave failed: ", error);
              });
          },
        });

        editorInstance2.current = new EditorJS({
          holder: "editorjs-container-2",
          placeholder: "Notes",
          onReady: () => {
            const toolbar = document.querySelector(
              "#editorjs-container-2 .ce-toolbar"
            );
            toolbar.style.display = "none";
            if (notes != "") {
              editorInstance2.current.render(JSON.parse(notes));
            }
          },
          onChange: (api, event) => {
            setSaving(true);
            editorInstance2.current
              .save()
              .then((outputData) => {
                console.log("Saving content:", outputData);
                setTimeout(() => {
                  updateTextFile(
                    token,
                    textID,
                    selectedProject,
                    null,
                    null,
                    outputData
                  );
                  setSaving(false);
                }, 500);
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
        setTimeout(() => {
          editorInstance1.current.destroy();
          editorInstance1.current = null;
        }, 50);
      }
      if (editorInstance2.current) {
        setTimeout(() => {
          editorInstance2.current.destroy();
          editorInstance2.current = null;
        }, 50);
      }
    };
  }, [notes, lyrics]);

  const updateTitle = () => {
    updateTextFile(token, textID, selectedProject, title, null, null)
      .then((result) => {
        console.log("Successfully saved title", result);
      })
      .catch((err) => {
        console.error("Error saving title:", err);
      });
  };

  const getDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const year = today.getFullYear();

    console.log(`${month}/${date}/${year}`); // "MM/DD/YYYY"
  };

  return (
    <>
      <div className="px-4 pt-3">
        <p className="text-xs">{projectName} / Lyrics</p>
      </div>
      <div className="px-20 py-12 flex flex-col">
        <div className="mb-14">
          <h1 className="text-4xl">Lyrics/Notes</h1>
        </div>
        <div className="mb-3 px-6 flex justify-between items-end">
          <div className="w-full">
            <input
              type="text"
              value={title}
              className="outline-none text-3xl bg-[#1a181b] placeholder:text-[#666] overflow-hidden w-full text-ellipsis "
              placeholder="Song Title"
              onChange={(e) => setTitle(e.target.value)}
              onBlur={updateTitle}
              maxLength="30"
            />
          </div>
          <div className="flex flex-row">
            {saving && (
              <>
                <p className="text-[#666] text-nowrap text-xs mr-2">Saving:</p>
                <div className="loader flex"></div>
              </>
            )}
          </div>
        </div>
        <hr className="bg-[#666]" />
        {/* below the underline */}
        <div className="flex flex-row mt-3">
          <div className="flex w-8/12 ">
            <div id="editorjs-container-1" className=" pl-6 w-full"></div>
          </div>
          <div className="flex w-4/12  p-4 flex-col">
            <p className="font-semibold pl-4 pb-1">Notes</p>
            <div className="bg-[#312F32] rounded-lg p-4">
              <div id="editorjs-container-2" className="w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Notes;
