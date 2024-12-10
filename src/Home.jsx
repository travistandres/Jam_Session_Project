import { useState } from "react";
import { useEffect } from "react";
import "./index.css";
import Nav from "./Nav";
import Notes from "./Notes";
import AudioFiles from "./AudioFiles";
import { useNavigate } from "react-router-dom";
import { getProjects } from "./api/endpointMethods/Projects.cjs";
import React from "react";


function Home() {
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(0);
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedTab, setSelectedTab] = useState("default");
  const [projectsEdited, setProjectsEdited] = useState(false);

  useEffect(() => {
    getProjects(localStorage.getItem("token"))
      .then((result) => {
        setProjects(result);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [projectsEdited]);

  const handleAudioTabClick = (projectId) => {
    setSelectedProject(projectId);
    setSelectedTab(`${projectId}Audio`);
    setExpandedProject(projectId);
  };

  const handleLyricsTabClick = (projectId) => {
    setSelectedProject(projectId);
    setSelectedTab(`${projectId}Notes`);
    setExpandedProject(projectId);
  };

  return (
    <>
      <div className="flex h-screen">
        <aside className="h-screen z-1">
          <Nav
            projects={projects}
            expandedProject={expandedProject}
            setExpandedProject={setExpandedProject}
            setSelectedProject={setSelectedProject}
            projectsEdited={projectsEdited}
            setProjectsEdited={setProjectsEdited}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </aside>
        <main className="w-full overflow-auto">
          {selectedTab === `default` && (
            <>
              <div className="px-4 pt-3">
                <p className="text-xs">Home</p>
              </div>
              <div className="px-20 py-12 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-4xl text-white">Projects</h1>
                </div>
                <div className="container-grid w-full">
                  {projects.map((project) => (
                    <div
                      key={project.project_ID}
                      className="relative rounded-lg bg-[#333] h-44 py-4 cursor-pointer group"
                    >
                      <div className="rounded-lg absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-opacity flex justify-center items-center w-full">
                        <div className="flex flex-col">
                          <button
                            className="btn-bg text-white py-1 my-1 px-4 rounded-lg text-xs"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event from bubbling up
                              handleAudioTabClick(project.project_ID);
                            }}
                          >
                            Audio
                          </button>
                          <button
                            className="btn-bg text-white py-1 my-1 px-4 rounded-lg text-xs"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event from bubbling up
                              handleLyricsTabClick(project.project_ID);
                            }}
                          >
                            Lyrics
                          </button>
                        </div>
                      </div>

                      <div className="rounded-lg h-4/6 "></div>
                      <div className=" h-1/6 py-1 px-6 rounded-lg w-[282px]">
                        <p className="truncate min-w-0">
                          {project.project_Name}
                        </p>
                      </div>
                      <p className="text-xs h-1/6 py-2 px-6 text-[#666]">
                        Audio / Lyrics
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          {selectedTab === `${selectedProject}Notes` && (
            <Notes
              key={`${selectedProject}`}
              projects={projects}
              selectedProject={selectedProject}
            />
          )}
          {selectedTab === `${selectedProject}Audio` && (
            <AudioFiles
              key={`${selectedProject}`}
              projects={projects}
              selectedProject={selectedProject}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default Home;
