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



function AudioFiles({ selectedProject, projects }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [audioFiles, setAudioFiles] = useState([]);
  const [newFileName, setNewFileName] = useState("");
  const [fileName, setFileName] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(false); // State to track visibility
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 }); // Position of popover
  const [editAudioVisible, setEditAudioVisible] = useState(false);
  const [deleteAudioVisible, setDeleteAudioVisible] = useState(false);
  const [newAudioVisible, setNewAudioVisible] = useState(false);
  const [audioID, setAudioID] = useState();
  const [dataChanged, setDataChanged] = useState(false);
  const [projectName, setProjectName] = useState("");

  const grid = useRef(null);

  useEffect(() => {
    // Getting Proj Title For Breadcrumbs
    const projName = projects.find(
      (item) => item.project_ID === selectedProject
    );
    setProjectName(projName.project_Name);
  }, []);

  useEffect(() => {
    getAudioFiles(token, selectedProject)
      .then((data) => {
        const tableData = data.map((file) => ({
          Name: file.file_Name,
          Type: "MP3",
          Audio: file.audio,
          Actions: file.audio_File_ID,
        }));
        setAudioFiles(tableData);
      })
      .catch((err) => {
        console.error("Error fetching audio files:", err);
      });
  }, [dataChanged]);

  const handleUploadFile = (e) => {
    e.preventDefault();
    createAudioFile(token, newFileName, selectedProject, newFile)
      .then(() => {
        setNewAudioVisible(false);
        setTimeout(() => {
          setDataChanged((prev) => !prev);
        }, 100);
        console.log("Successfully Uploaded Audio File", result);
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
      });
  };

  const handleDelete = () => {
    deleteAudioFile(token, audioID, selectedProject)
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

  const columnDefinitions = [
    { field: "Name", flex: 4 },
    {
      field: "Audio",
      flex: 7,
      cellRenderer: (params) => {
        const audioData = params.value.data;
        const arrayData = new Uint8Array(audioData);

        try {
          const audioBlob = new Blob([arrayData], { type: "audio/mp3" });

          const audio = URL.createObjectURL(audioBlob);

          return (
            <audio controls className="h-8 w-full">
              <source src={audio} type="audio/mp3" />
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
          className="icon-hover-bg rounded-md p-1"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            togglePopover(e); // Toggle the popover
            setAudioID(params.data.Actions);
            settingFileName(params.data.Actions);
          }}
        >
          <FaEllipsisH style={{ height: "14px", width: "14px" }} />
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
        setNewFileName("");
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

  const rowClass = "rowClass";

  return (
    <>
      <div className="px-4 pt-3">
        <p className="text-xs">{projectName} / Audio</p>
      </div>
      <div className="px-20 py-12 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl text-white">Audio Files</h1>
          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                setNewFileName("");
                setNewAudioVisible(true);
              }}
              className="btn-bg text-white px-3 py-1 rounded-lg  flex items-center"
            >
              <HiPlus
                style={{ height: "12px", width: "12px", marginRight: "4px" }}
              />
              New
            </button>
          </div>
        </div>
        <div className="ag-theme-quartz-dark">
          <AgGridReact
            ref={grid}
            rowData={audioFiles}
            columnDefs={columnDefinitions}
            gridOptions={gridOptions}
            rowClass={rowClass}
            domLayout="autoHeight"
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

      {/* Delete Audio Modal */}
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
                This action will permanently delete this file and can not be
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

      {/* New Audio Modal */}
      {newAudioVisible && (
        <>
          <div className="modal w-96">
            <div className="pb-1">
              <h3>Add a new file</h3>
            </div>
            <hr />
            <form
              onSubmit={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                handleUploadFile(e);
              }}
              className="py-4"
            >
              <div>
                <p className="pl-2">File name</p>
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
                <p className="pl-2">Upload File</p>
              </div>
              <div className="pt-1">
                <input
                  className="block w-full text-sm rounded-lg cursor-pointer
                  file:rounded-lg file:border-none file:px-2 file:mr-2 file:bg-[#f0ebd8]"
                  type="file"
                  id="fileInput"
                  accept=".mp3, audio/mp3" //Only MP3 files are allowed
                  onChange={(e) => setNewFile(e.target.files[0])}
                  required
                />
              </div>
              <div className="pt-5">
                <button
                  type="submit"
                  className="btn-bg text-white px-2 py-1 rounded-lg cursor-pointer text-xs float-right"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
          <div
            className="overlay-modal"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              setNewAudioVisible(false);
            }}
          ></div>
        </>
      )}
    </>
  );
}

export default AudioFiles;
