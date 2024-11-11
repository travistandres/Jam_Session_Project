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
  const [expandedProject, setExpandedProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Notes");

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
        <aside className="h-screen">
          <Nav
            projects={projects}
            expandedProject={expandedProject}
            setExpandedProject={setExpandedProject}
            setSelectedProject={setSelectedProject}
            setSelectedTab={setSelectedTab}
          />
        </aside>
        <main className="w-full">
          <Notes projectId={selectedProject} />
          {selectedTab === "Notes" && selectedProject && (
            <Notes projectId={selectedProject} />
          )}
          {selectedTab === "Audio Files" && selectedProject && (
            <AudioFiles projectId={selectedProject} />
          )}
        </main>
      </div>
    </>
  );
}

export default Home;
