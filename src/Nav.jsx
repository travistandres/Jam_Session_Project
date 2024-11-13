import { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronRight, FaEllipsisH } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";

function Nav({
  projects,
  expandedProject,
  setExpandedProject,
  setSelectedProject,
  selectedTab,
  setSelectedTab,
}) {
  const [popoverVisible, setPopoverVisible] = useState(false); // State to track visibility
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 }); // Position of popover
  const [editProjectVisible, setEditProjectVisible] = useState(false);
  const [deleteProjectVisible, setDeleteProjectVisible] = useState(false);
  const [projectName, setProjectName] = useState("");
  const navigate = useNavigate();
  const handleProjectClick = (projectId) => {
    // Toggle expand/collapse
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const handleNotesTabClick = (projectId) => {
    setSelectedProject(projectId);
    setSelectedTab(`${projectId}Notes`);
  };

  const handleAudioTabClick = (projectId) => {
    setSelectedProject(projectId);
    setSelectedTab(`${projectId}Audio`);
  };

  const togglePopover = (event, projectName) => {
    // Get the button's position for positioning the popover
    const buttonRect = event.target.getBoundingClientRect();
    setPopoverPosition({
      top: buttonRect.bottom + window.scrollY, // Position below the button
      left: buttonRect.left + window.scrollX, // Align with the button horizontally
    });
    setPopoverVisible(!popoverVisible); // Toggle popover visibility
    setProjectName(projectName);
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
        <div className="overflow-y-auto flex-grow flex-col flex">
          <p className="text-xs pt-3 pb-1 px-2">Projects</p>

          {/* Dynamic Tabs for each project */}
          {projects.map((project) => (
            <div>
              <div
                className="px-2 h-8 group flex items-center hover-nav cursor-pointer justify-between"
                key={project.project_ID}
                onClick={() => handleProjectClick(project.project_ID)}
              >
                <div className="flex text-left w-full ">
                  <div className="flex-1 min-w-0 w-5">
                    <p className="truncate min-w-0">{project.project_Name}</p>
                  </div>
                </div>
                <div className="w-5 h-5 hidden group-hover:flex transition icon-hover-bg justify-center items-center rounded">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent event from bubbling up
                      togglePopover(e, project.project_Name); // Toggle the popover
                    }}
                  >
                    <FaEllipsisH style={{ height: "12px", width: "12px" }} />
                  </button>
                </div>
                <div className="w-5 h-5 icon-hover-bg flex justify-center items-center rounded float-right">
                  {expandedProject === project.project_ID ? (
                    <FaChevronRight style={{ height: "12px", width: "12px" }} />
                  ) : (
                    <FaChevronDown style={{ height: "12px", width: "12px" }} />
                  )}
                </div>
              </div>
              {expandedProject === project.project_ID && (
                <div>
                  <div className="h-8">
                    <button
                      className="py-1 pl-4 pr-2 hover-nav text-left size-full"
                      onClick={() => handleAudioTabClick(project.project_ID)}
                    >
                      Audio Files
                    </button>
                  </div>
                  <div className="h-8">
                    <button
                      className="py-1 pl-4 hover-nav text-left w-full"
                      onClick={() => handleNotesTabClick(project.project_ID)}
                    >
                      Notes
                    </button>
                  </div>
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
            <div className="ml-2 ">
              <p>Sign Out</p>
            </div>
          </div>
        </button>
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
                    setEditProjectVisible(!editProjectVisible); // Toggle the modal
                    setPopoverVisible(false);
                  }}
                >
                  Edit Project
                </button>
              </div>
              <div className="hover-nav">
                <button
                  className="py-2 px-4"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event from bubbling up
                    setDeleteProjectVisible(!deleteProjectVisible); // Toggle the modal
                    setPopoverVisible(false);
                  }}
                >
                  Delete Project
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

      {editProjectVisible && (
        <>
          <div className={`modal ${editProjectVisible ? "" : "hidden"} w-96`}>
            <div>
              <h3>{projectName}</h3>
            </div>
          </div>
          <div
            className="overlay-modal"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              setEditProjectVisible(false); // Toggle the popover
            }}
          ></div>
        </>
      )}

      {deleteProjectVisible && (
        <>
          <div className={`modal ${deleteProjectVisible ? "" : "hidden"} w-96`}>
            <div>
              <h3>{projectName}</h3>
            </div>
          </div>
          <div
            className="overlay-modal"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              setDeleteProjectVisible(false); // Toggle the popover
            }}
          ></div>
        </>
      )}
    </>
  );
}

export default Nav;
