import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAudioFiles,
  createAudioFile,
  updateAudioFile,
  deleteAudioFile,
} from "./api/endpointMethods/AudioFiles.cjs"; //Import CRUD functions
import "./index.css";
import { AgGridReact } from "ag-grid-react"; // Import for ag-grid
import "ag-grid-community/styles/ag-grid.css"; // Import for CSS file
import "ag-grid-community/styles/ag-theme-quartz.css"; //Import for dark theme
import { FaEllipsisH } from "react-icons/fa";
import { HiPlus } from "react-icons/hi";

function AudioFiles({ selectedProject }) {
  const navigate = useNavigate();
  const [audioFiles, setAudioFiles] = useState([]);
  const [newFileName, setNewFileName] = useState("");
  const [fileName, setFileName] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [audioContext] = useState(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const [popoverVisible, setPopoverVisible] = useState(false); // State to track visibility
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 }); // Position of popover
  const [editAudioVisible, setEditAudioVisible] = useState(false);
  const [deleteAudioVisible, setDeleteAudioVisible] = useState(false);
  const [audioID, setAudioID] = useState();
  const [dataChanged, setDataChanged] = useState(false);
  const token = localStorage.getItem("token");

  const grid = useRef(null);

  useEffect(() => {
    getAudioFiles(token, selectedProject)
      .then((data) => {
        const tableData = data.map((file) => ({
          Name: file.file_Name,
          Type: "M4A",
          Audio: file.audio,
          Actions: file.audio_File_ID,
        }));
        setAudioFiles(tableData);
      })
      .catch((err) => {
        console.error("Error fetching audio files:", err);
      });
  }, [dataChanged]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
    }
  };

  const handleDelete = () => {
    deleteAudioFile(token, id, selectedProject)
      .then(() => {
        setDeleteAudioVisible(false);
        setTimeout(() => {
          setDataChanged((prev) => !prev);
        }, 100);
        console.log("Successfully Deleted Audio File", result);
      })
      .catch((err) => {
        console.error("Error deleting file:", err);
      });
  };

  const playAudio = (audioBuffer) => {
    // Decode the audio data directly
    audioContext
      .decodeAudioData(audioBuffer)
      .then((decodedBuffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = decodedBuffer;
        source.connect(audioContext.destination);
        source.start(0);
      })
      .catch((error) => {
        console.error("Error decoding audio data", error);
      });
  };

  const columnDefinitions = [
    { field: "Name", flex: 4 },
    {
      field: "Audio",
      flex: 7,
      cellRenderer: (params) => {
        const audioData = params.value.data;

        try {
          const audioBlob = new Blob([audioData], { type: "video/aac" });
          const audioUrl = URL.createObjectURL(audioBlob);

          return (
            <audio controls autoPlay className="h-8 ">
              <source src={audioUrl} type="video/aac" />
              Browser does not support audio playback.
            </audio>
          );
        } catch (error) {
          console.error("Error creating Blob or playing audio:", error);
          return <span>Error loading audio</span>;
        }
      },
    },
    { field: "Type", flex: 2 },
    {
      field: "",
      flex: 1,
      cellRenderer: (params) => (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            togglePopover(e); // Toggle the popover
            setAudioID(params.data.Actions);
            settingFileName(params.data.Actions);
          }}
        >
          <FaEllipsisH style={{ height: "12px", width: "12px" }} />
        </button>
      ),
    },
  ];

  const togglePopover = (event) => {
    // Get the button's position for positioning the popover
    const buttonRect = event.target.getBoundingClientRect();
    setPopoverPosition({
      top: buttonRect.bottom + window.scrollY, // Position below the button
      left: buttonRect.left + window.scrollX, // Align with the button horizontally
    });
    setPopoverVisible(!popoverVisible); // Toggle popover visibility
  };

  // For Edit Modal
  const settingFileName = (id) => {
    const name = audioFiles.find((item) => item.Actions === id);

    if (name) {
      setNewFileName(name.Name);
      setFileName(name.Name);
    } else {
      setNewFileName("File Name");
      setFileName("File Name");
    }
  };

  const handleUpdateClick = () => {
    updateAudioFile(token, audioID, selectedProject, newFileName, null)
      .then((result) => {
        setEditAudioVisible(false);
        setTimeout(() => {
          setDataChanged((prev) => !prev);
        }, 100);
        console.log("Successfully saved Audio File", result);
      })
      .catch((err) => {
        console.error("Error saving Audio File:", err);
      });
  };

  const gridOptions = {
    defaultColDef: {
      resizable: false,
    },
    suppressColumnMoveAnimation: true, // optional: disable move animation
    suppressMovableColumns: true, // Disable column dragging
    suppressCellFocus: true,
  };

  const rowHeight = 60;
  const rowClass = "rowClass";

  return (
    <>
      <div className="px-20 py-12 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl text-white">Audio Files</h1>
          <div className="flex items-center">
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 flex items-center"
            >
              <HiPlus
                style={{ height: "12px", width: "12px", marginRight: "4px" }}
              />
              New
            </button>
          </div>
        </div>
        <div className="ag-theme-quartz-dark h-[500px]">
          <AgGridReact
            ref={grid}
            rowData={audioFiles}
            columnDefs={columnDefinitions}
            gridOptions={gridOptions}
            rowClass={rowClass}
          />
        </div>
      </div>

      {/* Popover */}
      {popoverVisible && (
        <>
          <div
            className={`popover ${
              popoverVisible ? "show" : ""
            } text-xs bg-[#333] rounded-md p-1`}
            style={{
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`,
              zIndex: 1000,
            }}
          >
            <div className="text-left">
              <div className="hover-nav">
                <button
                  className="py-2 px-4"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event from bubbling up
                    setEditAudioVisible(!editAudioVisible); // Toggle the modal
                    setPopoverVisible(false);
                  }}
                >
                  Edit
                </button>
              </div>
              <div className="hover-nav">
                <button
                  className="py-2 px-4 password-unmet"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event from bubbling up
                    setDeleteAudioVisible(!deleteAudioVisible); // Toggle the modal
                    setPopoverVisible(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div
            className="overlay"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              setPopoverVisible(false); // Toggle the popover
            }}
          ></div>
        </>
      )}

      {/* Edit Audio Modal */}
      {editAudioVisible && (
        <>
          <div className={`modal ${editAudioVisible ? "" : "hidden"} w-96`}>
            <div className="pb-1">
              <h3>{fileName}</h3>
            </div>
            <hr />
            <div className="py-4">
              <div>
                <p className="pl-2">File Name</p>
              </div>
              <div className="pt-1">
                <input
                  type="text"
                  id="newFileName"
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="border px-2 w-full rounded-lg text-black textfield-bg"
                  required
                  value={newFileName}
                />
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  className="btn-bg text-white px-2 py-1 rounded-lg cursor-pointer text-xs float-right"
                  onClick={handleUpdateClick}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
          <div
            className="overlay-modal"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              setEditAudioVisible(false); // Toggle the edit modal
            }}
          ></div>
        </>
      )}

      {/* Delete Project Modal */}
      {deleteAudioVisible && (
        <>
          <div
            className={`modal ${
              deleteAudioVisible ? "" : "hidden"
            } w-[23rem] text-xs text-center`}
          >
            <div className="py-1">
              <p className="text-sm">Do you want to delete this file?</p>
            </div>
            <div>
              <p className="text-[#666] py-1">
                This action will permanently delete the project and can not be
                undone.
              </p>
            </div>
            <div className="py-1">
              <button
                type="button"
                className="bg-[#cd5c5c] text-white rounded-lg w-full py-1 cursor-pointer my-1"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent event from bubbling up
                  handleDelete();
                }}
              >
                Delete
              </button>
            </div>
          </div>
          <div
            className="overlay-modal"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              setDeleteAudioVisible(false); // Toggle the delete modal
            }}
          ></div>
        </>
      )}
    </>
  );
}

export default AudioFiles;
