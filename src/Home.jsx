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

  useEffect(() => {
    getProjects(localStorage.getItem("token"))
      .then((result) => {
        setProjects(result);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <>
      <div className="flex h-screen">
        <aside className="h-screen z-0">
          <Nav
            projects={projects}
            expandedProject={expandedProject}
            setExpandedProject={setExpandedProject}
            setSelectedProject={setSelectedProject}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </aside>
        <main className="w-full overflow-auto">
          {selectedTab === `${selectedProject}Notes` && (
            <Notes
              key={`${selectedProject}`}
              selectedProject={selectedProject}
            />
          )}
          {selectedTab.split("-")[1] === "Audio Files" && (
            <AudioFiles
              key={`${selectedProject}-Audio Files`}
              selectedProject={selectedProject}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default Home;
