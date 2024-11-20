import { useState } from "react";
import { useEffect } from "react";
import "./index.css";
import Nav from "./Nav";
import Notes from "./Notes";
import AudioFiles from "./AudioFiles";
import { useNavigate } from "react-router-dom";
import { getProjects } from "./api/endpointMethods/Projects.cjs";

function Home() {
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(0);
  const [selectedProject, setSelectedProject] = useState(0);
  const [selectedTab, setSelectedTab] = useState("");
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
