import React, { useState, useEffect } from "react";
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
  const [newFile, setNewFile] = useState(null);
  const [audioContext] = useState(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    getAudioFiles(token, selectedProject)
      .then((data) => {
        const tableData = data.map((file) => ({
          Name: file.file_Name,
          Type: "M4A",
          Audio: file.audio,
          Actions: file.text_File_ID,
        }));
        setAudioFiles(tableData);
      })
      .catch((err) => {
        console.error("Error fetching audio files:", err);
      });
  }, [selectedProject, token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
    }
  };

  const handleDelete = (id) => {
    deleteAudioFile(token, id)
      .then(() => {
        setAudioFiles(audioFiles.filter((file) => file.Actions !== id));
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
    { field: "Name", flex: 2 },
    { field: "Type", flex: 1 },
    {
      field: "Audio",
      flex: 3,
      cellRenderer: (params) => {
        const audioData = params.value.data;

        try {
          const audioBlob = new Blob([audioData], { type: "video/aac" });
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log(audioUrl);

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
    {
      field: "Actions",
      flex: 1,
      cellRenderer: (params) => (
        <button onClick={() => handleDelete(params.value)}>
          <FaEllipsisH style={{ height: "12px", width: "12px" }} />
        </button>
      ),
    },
  ];

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
          rowData={audioFiles}
          columnDefs={columnDefinitions}
          gridOptions={gridOptions}
          rowClass={rowClass}
        />
      </div>
    </div>
  );
}

export default AudioFiles;
