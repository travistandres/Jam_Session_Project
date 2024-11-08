import { useState } from "react";
import { useEffect } from "react";
import "./index.css";
import Nav from "./Nav";
import Notes from "./Notes";
import AudioFiles from "./AudioFiles";
import { useNavigate } from "react-router-dom";

function Home() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Notes");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [projectsResponse, usersResponse] = await Promise.all([
  //         fetch("https://localhost:3000"),
  //         fetch("https://localhost:3000"),
  //       ]);
  //       const projectsData = await projectsResponse.json();
  //       const userData = await usersResponse.json();

  //       setProjects(projectsData);
  //       setUser(userData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <>
      <div className="flex h-screen">
        <aside className="p-2 w-48 h-screen">
          <Nav
            projects={projects}
            user={user}
            expandedProject={expandedProject}
            setExpandedProject={setExpandedProject}
            setSelectedProject={setSelectedProject}
            setSelectedTab={setSelectedTab}
          />
        </aside>
        <main>
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
