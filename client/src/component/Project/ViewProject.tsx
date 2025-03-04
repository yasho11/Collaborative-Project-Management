import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import SideBar from "../componentSM/Sidebar";
import { FaPlus } from "react-icons/fa";
import api from "../../axios/api";
import AddItemModal from "../componentSM/AddModalComponent";
import { useNavigate, useParams } from "react-router-dom";
import MemberListPopup from "../Member/ViewMember";

interface Project {
  _id: string;
  Name: string;
  description: string;
  dueDate: string;
  progress?: any;
}

interface Member {
  _id: string;
  name: string;
  role: string;
}

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { workspaceId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!workspaceId) {
        setError("Workspace ID is missing.");
        return;
      }

      try {
        console.log("Fetching projects for workspace ID:", workspaceId);
        const response = await api.get(`projects/ws/${workspaceId}`);
        console.log("API Response:", response.data);

        setProjects(Array.isArray(response.data.projects) ? response.data.projects : []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [workspaceId]);

  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [...prev, newProject]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects((prev) =>
      prev.map((p) => (p._id === updatedProject._id ? updatedProject : p))
    );
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setEditMode(true);
    setShowModal(true);
  };

  const deleteProject = async (projectId: string, e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project.");
    }
  };

  const handleFetchMembers = async () => {
    if (!workspaceId) {
      setError("Workspace ID is missing.");
      return;
    }

    try {
      const response = await api.get(`/workspaces/member/${workspaceId}`);
      setMembers(response.data.members);
      console.log(response.data.members);
      setIsMemberPopupOpen(true);
    } catch (err) {
      setError("Failed to load workspace members.");
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!workspaceId) {
      setError("Workspace ID is missing.");
      return;
    }

    try {
      await api.delete(`/workspaces/member/${workspaceId}/${memberId}`);
      setMembers((prev) => prev.filter((member) => member._id !== memberId));
      console.log(`Deleted member with ID: ${memberId}`);
    } catch (err) {
      console.error("Failed to delete member:", err);
      setError("Failed to delete member.");
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

        {/* Button to Show Project Members */}
        <button
          onClick={handleFetchMembers}
          className="mb-4 text-black underline"
        >
          View Workspace Members
        </button>

        {loading ? (
          <p className="text-center text-gray-500">Loading projects...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
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
                projectId={project._id}
                name={project.Name}
                dueDate={new Date(project.dueDate).toLocaleDateString()}
                progress={project.progress?.completionPercentage || 0}
                onEdit={() => handleEditProject(project)}
                onDelete={(e) => deleteProject(project._id, e)}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AddItemModal
          type="project"
          parentId={workspaceId}
          onClose={() => setShowModal(false)}
          onAdd={editMode ? handleUpdateProject : handleAddProject}
          existingItem={selectedProject}
        />
      )}

      {/* Member List Popup */}
      {isMemberPopupOpen && (
        <MemberListPopup
          members={members}
          onClose={() => setIsMemberPopupOpen(false)}
          onDeleteMember={handleDeleteMember}
        />
      )}
    </div>
  );
};

export default ProjectList;
