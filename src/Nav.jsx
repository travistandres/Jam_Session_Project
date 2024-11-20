import { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronRight, FaEllipsisH } from "react-icons/fa";
import { PiSignOutBold } from "react-icons/pi";
import { HiPlus } from "react-icons/hi";
import {
  updateProject,
  deleteProject,
  createProject,
} from "./api/endpointMethods/Projects.cjs";

function Nav({
  projects,
  expandedProject,
  setExpandedProject,
  setSelectedProject,
  projectsEdited,
  setProjectsEdited,
  selectedTab,
  setSelectedTab,
}) {
  const [popoverVisible, setPopoverVisible] = useState(false); // State to track visibility
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 }); // Position of popover
  const [editProjectVisible, setEditProjectVisible] = useState(false);
  const [deleteProjectVisible, setDeleteProjectVisible] = useState(false);
  const [newProjectVisible, setNewProjectVisible] = useState(false);
  const [curProj, setCurProj] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [createProjectName, setCreateProjectName] = useState("");
  const [newProjectName, setNewProjectName] = useState(""); //For editing project name
  const [confirmText, setConfirmText] = useState("");
  const navigate = useNavigate();
  const handleProjectClick = (projectId) => {
    // Toggle expand/collapse
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const newProject = (e) => {
    e.preventDefault();
    if (createProjectName !== "") {
      try {
        setNewProjectVisible(false);
        createProject(localStorage.getItem("token"), createProjectName, null);
        setTimeout(() => {
          setProjectsEdited((prev) => !prev);
        }, 100);
        setCreateProjectName("");
      } catch (error) {
        console.error("Error creating project:", err);
      }
    }
  };

  const handleNotesTabClick = (projectId) => {
    setSelectedProject(projectId);
    setSelectedTab(`${projectId}Notes`);
  };

  const handleAudioTabClick = (projectId) => {
    setSelectedProject(projectId);
    setSelectedTab(`${projectId}Audio`);
  };

  const handleUpdateClick = () => {
    updateProject(localStorage.getItem("token"), curProj, newProjectName, null)
      .then((result) => {
        setEditProjectVisible(false);
        setTimeout(() => {
          setProjectsEdited((prev) => !prev);
        }, 100);
        console.log("Successfully saved title", result);
      })
      .catch((err) => {
        console.error("Error saving title:", err);
      });
  };

  const delProject = () => {
    if (confirmText === "yes") {
      deleteProject(localStorage.getItem("token"), curProj)
        .then((result) => {
          setDeleteProjectVisible(false);
          setConfirmText("");
          setSelectedTab("default");
          setTimeout(() => {
            setProjectsEdited((prev) => !prev);
          }, 100);
          console.log("Successfully deleted project", result);
        })
        .catch((err) => {
          console.error("Error deleting project:", err);
        });
    }
  };

  const togglePopover = (event, projectName, projectID) => {
    // Get the button's position for positioning the popover
    const buttonRect = event.target.getBoundingClientRect();
    setPopoverPosition({
      top: buttonRect.bottom + window.scrollY, // Position below the button
      left: buttonRect.left + window.scrollX, // Align with the button horizontally
    });
    setPopoverVisible(!popoverVisible); // Toggle popover visibility
    setProjectName(projectName);
    setNewProjectName(projectName);
    setCurProj(projectID);
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
      <div className="p-2 flex flex-col justify-between h-full w-full prevent-select">
        <div
          className="px-2 py-1 text-lg flex-grow-0 flex-shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            setSelectedTab("default");
            setExpandedProject(null);
          }}
        >
          {getName()}
        </div>
        <div className="h-8 text-xs pt-3 pb-1 px-2 flex items-center justify-between transition-[0.2s]">
          <div>
            <p>Projects</p>
          </div>
          <div className="w-5 h-5 icon-hover-bg flex justify-center items-center rounded cursor-pointer">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                setNewProjectVisible(!editProjectVisible); // Toggle the modal
              }}
            >
              <HiPlus style={{ height: "12px", width: "12px" }} />
            </button>
          </div>
        </div>
        <hr className="bg-[#666]" />
        <div className="overflow-y-auto flex-grow flex-col flex">
          {/* Dynamic Tabs for each project */}
          {projects.map((project) => (
            <div key={project.project_ID}>
              <div
                className="px-2 h-8 group flex items-center hover-nav cursor-pointer justify-between mt-1"
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
                      togglePopover(
                        e,
                        project.project_Name,
                        project.project_ID
                      ); // Toggle the popover
                    }}
                  >
                    <FaEllipsisH style={{ height: "12px", width: "12px" }} />
                  </button>
                </div>
                <div className="w-5 h-5 icon-hover-bg flex justify-center items-center rounded float-right">
                  {expandedProject === project.project_ID ? (
                    <FaChevronRight
                      className="transition-transform"
                      style={{
                        height: "12px",
                        width: "12px",
                      }}
                    />
                  ) : (
                    <FaChevronRight
                      className="transition-transform"
                      style={{
                        height: "12px",
                        width: "12px",
                        transform: "rotate(90deg)",
                      }}
                    />
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
                      Lyrics
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <hr className="bg-[#666]" />
        <button
          onClick={logout}
          className="my-1 py-1 flex-grow-0 flex-shrink-0 hover-nav"
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
                  className="py-2 px-4 password-unmet"
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

      {/* Edit Project Modal */}
      {editProjectVisible && (
        <>
          <div className={`modal ${editProjectVisible ? "" : "hidden"} w-96`}>
            <div className="pb-1">
              <h3>{projectName}</h3>
            </div>
            <hr />
            <div className="py-4">
              <div>
                <p className="pl-2">Project Name</p>
              </div>
              <div className="pt-1">
                <input
                  type="text"
                  id="newProjectName"
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="border px-2 w-full rounded-lg text-black textfield-bg"
                  required
                  value={newProjectName}
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
              setEditProjectVisible(false); // Toggle the edit modal
            }}
          ></div>
        </>
      )}

      {/* Delete Project Modal */}
      {deleteProjectVisible && (
        <>
          <div
            className={`modal ${
              deleteProjectVisible ? "" : "hidden"
            } w-[23rem] text-xs text-center`}
          >
            <div className="py-1">
              <p className="text-sm">Do you want to delete this project?</p>
            </div>
            <div>
              <p className="text-[#666] py-1">
                This action will permanently delete the project and can not be
                undone. Type "yes" to delete.
              </p>
            </div>
            <form className="py-1">
              <input
                type="text"
                id="confirmation"
                value={confirmText}
                placeholder="yes"
                onChange={(e) => setConfirmText(e.target.value)}
                className="border px-2 py-1 w-full rounded-lg text-black textfield-bg my-1"
              />
              <button
                type="button"
                className="bg-[#cd5c5c] text-white rounded-lg w-full py-1 cursor-pointer my-1"
                onClick={delProject}
              >
                Delete
              </button>
            </form>
          </div>
          <div
            className="overlay-modal"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              setDeleteProjectVisible(false); // Toggle the delete modal
            }}
          ></div>
        </>
      )}

      {/* New Project Modal */}
      {newProjectVisible && (
        <>
          <div className="modal w-96">
            <div className="pb-1">
              <h3>Create a new project</h3>
            </div>
            <hr />
            <form
              onSubmit={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                newProject(e);
              }}
              className="py-4"
            >
              <div>
                <p className="pl-2">Project name</p>
              </div>
              <div className="pt-1">
                <input
                  type="text"
                  id="createProjectName"
                  onChange={(e) => setCreateProjectName(e.target.value)}
                  className="border px-2 w-full rounded-lg text-black textfield-bg"
                  required
                  value={createProjectName}
                />
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="btn-bg text-white px-2 py-1 rounded-lg cursor-pointer text-xs float-right"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
          <div
            className="overlay-modal"
            onClick={(e) => {
              e.stopPropagation(); // Prevent event from bubbling up
              setNewProjectVisible(false); // Toggle the delete modal
            }}
          ></div>
        </>
      )}
    </>
  );
}

export default Nav;
