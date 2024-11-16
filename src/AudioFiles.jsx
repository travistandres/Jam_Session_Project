
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

function AudioFiles({ selectedProject }) {
  const navigate = useNavigate();
  const [audioFiles, setAudioFiles] = useState([]);
  const [newFileName, setNewFileName] = useState("");
  const [newFile, setNewFile] = useState(null);
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    getAudioFiles(token, selectedProject)
    .then((data) => {
      const tableData = data.map((file) => ({
        Name: file.file_Name,
        Type: "MP3",
        Audio: 'data:audio/mp3;base64,${file.audio}',
        Actions: file.text_File_ID,
      }))
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

  const columnDefinitions = [
    { field: "Name", flex: 1 },
    { field: "Type", flex: 1 },
    { field: "Audio", flex: 1, cellRenderer: (params) => (
      <audio controls>
        <source src = {params.value} type = "audio/mpeg" />
        Browser does not support audio playback.
      </audio>
    ),
  },
  {
    field: "Actions", flex:1, cellRenderer: (params) => (
      <button onClick = {() => handleDelete(params.value)} className = "bg-red-500 text-white px-2 py-1 rounded">
        Delete
      </button>
    ),
  },
  ];

  return (
    <div
      className="px-20 py-12 flex flex-col"
      style={{ backgroundColor: "#1a181b" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl text-white">Audio Files</h1>
        <div className="flex items-center">
          <button
            onClick={() => document.getElementById("fileInput").click()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            + New
          </button>
          </div>
          </div>
              <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
          <AgGridReact rowData={audioFiles} columnDefs={columnDefinitions} />
      </div>
      </div>
  );
}

export default AudioFiles;
