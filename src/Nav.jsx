import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import logoutIcon from "./assets/log_out_icon.png";
import { FaChevronDown, FaChevronRight, FaEllipsisH } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";

function Nav({
  projects,
  expandedProject,
  setExpandedProject,
  setSelectedProject,
  setSelectedTab,
}) {
  const navigate = useNavigate();
  const handleProjectClick = (projectId) => {
    // Toggle expand/collapse
    setExpandedProject(expandedProject === projectId ? null : projectId);
    setSelectedProject(projectId);
  };

  const getName = () => {
    const data = localStorage.getItem("userData");
    const parsedData = data ? JSON.parse(data) : null;

    return parsedData ? parsedData.username : "John Doe";
  };

  const goToLogin = () => {
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    goToLogin();
  };

  return (
    <>
      <div className="p-2 flex flex-col justify-between h-full w-full">
        <div className="px-2 py-1 text-lg flex-grow-0 flex-shrink-0">
          {getName()}
        </div>
        {/* Dynamic Tabs for each project */}
        <div className="overflow-y-auto flex-grow flex-col flex">
          <p className="text-xs pt-3 pb-1 px-2">Projects</p>

          <div className="h-8">
            <button className="px-2 hover-nav text-left size-full group">
              <div className="flex items-center ">
                <div className="flex-1 min-w-0 w-5">
                  <p className="truncate min-w-0">Music Project</p>
                </div>
                <div className="w-5 h-5 hidden group-hover:flex transition icon-hover-bg justify-center items-center rounded">
                  <FaEllipsisH style={{ height: "14px", width: "14px" }} />
                </div>
                <div className="w-5 h-5 icon-hover-bg flex justify-center items-center rounded">
                  {expandedProject === null ? (
                    <FaChevronDown style={{ height: "14px", width: "14px" }} />
                  ) : (
                    <FaChevronRight style={{ height: "14px", width: "14px" }} />
                  )}
                </div>
              </div>
            </button>
          </div>

          <div>
            <div className="h-8">
              <button className="py-1 pl-4 pr-2 hover-nav text-left size-full">
                Audio Files
              </button>
            </div>
            <div className="h-8">
              <button className="py-1 pl-4 hover-nav text-left w-full">
                Notes
              </button>
            </div>
          </div>
          {projects.map((project) => (
            <div key={project.id} className="project">
              <button onClick={() => handleProjectClick(project.id)}>
                {project.name}
              </button>
              {expandedProject === project.id && (
                <div className="project-tabs">
                  <button onClick={() => setSelectedTab("Notes")}>Notes</button>
                  <button onClick={() => setSelectedTab("Audio Files")}>
                    Audio Files
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={logout}
          className="mb-1 py-1 flex-grow-0 flex-shrink-0 hover-nav"
        >
          <div className="flex flex-row items-center h-7 px-2">
            <div>
              <PiSignOutBold style={{ height: "20px", width: "20px" }} />
            </div>
            <div className="ml-2">Sign Out</div>
          </div>
        </button>
      </div>
    </>
  );
}

export default Nav;