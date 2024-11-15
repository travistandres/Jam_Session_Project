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
  const token = "your_jwt_token"; // Need to replace with users actual token

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
      setNewFileName(file.name); // Shows audio file name
    }
  };

  // Define Column Names
  const [colDefs, setColDefs] = useState([
    { field: "Name", flex: 1 },
    { field: "Type", flex: 1 },
    { field: "Audio", flex: 1 },
    { field: "Actions", flex: 1 },
  ]);

  //Test rows to be deleted
  const [rowData, setRowData] = useState([
    { Name: "Song 1", Type: "MP4", Audio: "Audio File", Actions: ":" },
    { Name: "Song 2", Type: "MP4", Audio: "Audio File", Actions: ":" },
    { Name: "Song 3", Type: "MP4", Audio: "Audio File", Actions: ":" },
    { Name: "Song 4", Type: "MP4", Audio: "Audio File", Actions: ":" },
    { Name: "Song 5", Type: "MP4", Audio: "Audio File", Actions: ":" },
  ]);

  return (
    <div
      className="px-20 py-12 flex flex-col"
      style={{ backgroundColor: "#1a181b" }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl text-white">Audio Files</h1>

        <div className="flex items-center">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="mr-4"
            style={{ display: "none" }}
            id="fileInput"
          />
          <button
            onClick={() => document.getElementById("fileInput").click()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            + New
          </button>
        </div>
      </div>

      <div className="bg-[#1a181b] text-white rounded-lg overflow-hidden">
        <div className="ag-theme-quartz-dark" style={{ height: 500 }}>
          <AgGridReact rowData={rowData} columnDefs={colDefs} />
        </div>
      </div>

      {audioFiles.map((file, index) => (
        <div
          key={index}
          className="flex justify-between px-6 py-4 border-b border-gray-700 hover:bg-gray-800"
        >
          <div className="w-1/4">{file.name}</div>

          <div className="w-1/4">MP4</div>

          <div className="w-1/4 text-center">
            <audio controls>
              <source
                src={`data:audio/mp3;base64,${file.audio}`}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
          </div>
          <div className="w-1/4 text-right relative">
            <button className="text-white hover:text-gray-400">
              <i className="fas fa-ellipsis-h"></i>
            </button>
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-32">
              <button
                onClick={() => handleDelete(file.id)}
                className="block w-full px-4 py-2 text-sm hover:bg-gray-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AudioFiles;
