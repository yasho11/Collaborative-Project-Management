import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import SideBar from "../componentSM/Sidebar";
import { FaPlus } from "react-icons/fa";
import api from "../../axios/api";
import AddItemModal from "../componentSM/AddModalComponent";
import { useNavigate } from "react-router-dom";

interface Project {
  _id: string;
  name: string;
  description: string;
  dueDate: string;
  progress: number;
}

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(response.data.projects);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handle adding a new project
  const handleAddProject = (newProject: Project) => {
    setProjects([...projects, newProject]);
  };

  // Handle updating an existing project
  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(
      projects.map((p) => (p._id === updatedProject._id ? updatedProject : p))
    );
  };

  // Handle opening the modal for editing
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setEditMode(true);
    setShowModal(true);
  };

  // Handle deleting a project
  const DeleteProject = async (project_id: string, e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.delete(`/projects/${project_id}`);
      setProjects(response.data.projects || []);
      navigate("/projects");
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete projects.");
    }
  };

  return (
    <div className="bg-[#304258] flex flex-row min-h-screen overflow-hidden">
      <SideBar />

      <div className="flex-1 flex flex-col p-10 bg-white rounded-lg">
        <h1 className="text-3xl font-bold text-gray-700">Your Projects</h1>
        <p className="text-gray-500 mb-4">
          Keep track of your progress and stay productive.
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading projects...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {/* Add New Project Card */}
            <div
              className="bg-[#C7D9E5] flex flex-col justify-center items-center p-4 rounded-lg cursor-pointer hover:bg-gray-300 transition"
              onClick={() => {
                setEditMode(false);
                setSelectedProject(null);
                setShowModal(true);
              }}
            >
              <FaPlus className="text-4xl text-gray-600" />
              <p className="mt-2 text-gray-600 font-semibold">Add a new project</p>
            </div>

            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                name={project.name}
                dueDate={new Date(project.dueDate).toLocaleDateString()}
                progress={project.progress}
                onEdit={() => handleEditProject(project)}
                onDelete = {(e)=> DeleteProject(project._id,e)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Show modal when needed */}
      {showModal && (
        <AddItemModal
          type="project"
          parentId=""
          onClose={() => setShowModal(false)}
          onAdd={editMode ? handleUpdateProject : handleAddProject}
          existingItem={selectedProject}
        />
      )}
    </div>
  );
};

export default ProjectList;
