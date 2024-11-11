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
            setSelectedTab={setSelectedTab}
          />
        </aside>
        <main className="w-full overflow-auto">
          {selectedTab === "Notes" && <Notes projectId={selectedProject} />}
          {selectedTab === "Audio Files" && (
            <AudioFiles projectId={selectedProject} />
          )}
        </main>
      </div>
    </>
  );
}

export default Home;
