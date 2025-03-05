import React, { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import SideBar from "../componentSM/Sidebar";
import { FaPlus } from "react-icons/fa";
import api from "../../axios/api";
import AddItemModal from "../componentSM/AddModalComponent";
import { useNavigate, useParams } from "react-router-dom";
import MemberListPopup from "../Member/ViewMember";
import AddMember from "../Member/InviteMember"; // Import AddMember component

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
  const [showInviteMember, setShowInviteMember] = useState(false); // State for Invite Member popup

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [workspaceId]);
  
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

  const handleFetchMembers = async () => {
    if (!workspaceId) {
      setError("Workspace ID is missing.");
      return;
    }

    try {
      const response = await api.get(`/workspaces/member/${workspaceId}`);
      setMembers(response.data.members);
      setIsMemberPopupOpen(true);
    } catch (err) {
      setError("Failed to load workspace members.");
    }
  };

  const handleDeleteProject = async (ProjectId: string) => {
    if (!workspaceId) {
      setError("Workspace ID is missing.");
      return;
    }

    try {
      await api.delete(`/projects/${ProjectId}`);

      fetchProjects();

    } catch (err) {
      console.error("Failed to delete project:", err);
      setError("Failed to delete project.");
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

        {/* Buttons for Viewing and Adding Members */}
        <div className="flex gap-4 mb-4">
          <button onClick={handleFetchMembers} className="text-black underline">
            View Workspace Members
          </button>
          <button onClick={() => setShowInviteMember(true)} className="text-black underline">
            Invite Member
          </button>
        </div>

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
                onEdit={() => {
                  setEditMode(true);
                  setSelectedProject(project);
                  setShowModal(true);
                }}
                onDelete={async (e: React.FormEvent) => {
                  e.preventDefault();
                  await handleDeleteProject(project._id);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      {showModal && (
        <AddItemModal
        type="project"
        parentId={workspaceId}
        onClose={() => setShowModal(false)}
        onAdd={(newProject) => {
          if (editMode) {
            // Update the project list instead of adding a new one
            setProjects((prevProjects) =>
              prevProjects.map((proj) => (proj._id === newProject._id ? newProject : proj))
            );
          } else {
            setProjects([...projects, newProject]);
          }
        }}
        existingItem={selectedProject} // <-- Make sure this is passed when editing
      />
      
      )}

      {/* Member List Popup */}
      {isMemberPopupOpen && (
        <MemberListPopup
          members={members}
          onClose={() => setIsMemberPopupOpen(false)}
          onDeleteMember={async (memberId: string) => {
            try {
              await api.delete(`/workspaces/member/${workspaceId}/${memberId}`);
              setMembers(members.filter(member => member._id !== memberId));
            } catch (err) {
              setError("Failed to delete member.");
            }
          }}
        />
      )}

      {/* Invite Member Popup */}
      {showInviteMember && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Invite Member</h2>
            <AddMember parentId={workspaceId || ""} type="workspaces" />
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => setShowInviteMember(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
