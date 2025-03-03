import React, { useEffect, useState } from "react";
import WorkspaceCard from "./WSCard";
import SideBar from "../componentSM/Sidebar";
import { FaPlus } from "react-icons/fa";
import api from "../../axios/api";
import { Link } from "react-router-dom";
import AddItemModal from "../componentSM/AddModalComponent"; // Import modal
import { useNavigate } from "react-router-dom";

const WorkspaceList = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const navigate  = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api.get("/workspaces");
        setWorkspaces(response.data.workspaces);
      } catch (err) {
        console.error("Error fetching workspaces:", err);
        setError("Failed to load workspaces.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

interface Workspace {
    _id: string;
    Name: string;
    description: string;
    projects?: any[];
    createdAt: string;
}

interface NewWorkspace {
    _id: string;
    Name: string;
    description: string;
    projects?: any[];
    createdAt: string;
}

// Handle adding a new workspace
const handleAddWorkspace = (newWorkspace: NewWorkspace) => {
    setWorkspaces([...workspaces, newWorkspace]); // Update UI instantly
};

// Handle updating an existing workspace
const handleUpdateWorkspace = (updatedWorkspace: NewWorkspace) => {
    setWorkspaces(
        workspaces.map((ws) => (ws._id === updatedWorkspace._id ? updatedWorkspace : ws))
    );
};

// Handle opening the modal for editing
const handleEditWorkspace = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setEditMode(true);
    setShowModal(true);
};

// Handle deleting a workspace
const DeleteWS = async (ws_id: string, e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.delete(`/workspaces/${ws_id}`);
  
      // Ensure we always set an array, even if response.data.workspaces is undefined
      setWorkspaces(response.data.workspaces || []);

    } catch (err) {
      console.error("Error deleting workspace:", err);
      setError("Failed to delete workspaces.");
    }
  };
  
  return (
    <div className="bg-[#304258] flex flex-row min-h-screen overflow-hidden">
      <SideBar />

      <div className="flex-1 flex flex-col p-10 bg-white rounded-lg">
        <h1 className="text-3xl font-bold text-gray-700">Hello, User</h1>
        <p className="text-gray-500 mb-4">
          Don't rush the process, good things take time.
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading workspaces...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-3 gap-6">
              {/* Add New Workspace Card */}
              <div
                className="bg-[#C7D9E5] flex flex-col justify-center items-center p-4 rounded-lg cursor-pointer hover:bg-gray-300 transition"
                onClick={() => {
                  setEditMode(false);
                  setSelectedWorkspace(null);
                  setShowModal(true);
                }}
              >
                <FaPlus className="text-4xl text-gray-600" />
                <p className="mt-2 text-gray-600 font-semibold">
                  Add a new workspace
                </p>
              </div>

              {workspaces.map((ws) => (
                
                <WorkspaceCard
                  key={ws._id}
                  workspaceId={ws._id}
                  name={ws.Name} 
                  description={ws.description}
                  projectsCount={ws.projects?.length || 0}
                  date={new Date(ws.createdAt).toLocaleDateString()}
                  onDelete={(e) => DeleteWS(ws._id, e)}
                  onEdit={() => handleEditWorkspace(ws)}
                />
             
              ))}

            </div>
          </div>
        )}
      </div>

      {/* Show modal when needed */}
      {showModal && (
        <AddItemModal
          type="workspace"
          parentId=""
          onClose={() => setShowModal(false)}
          onAdd={editMode ? handleUpdateWorkspace : handleAddWorkspace}
          existingItem={selectedWorkspace} // Pass existing workspace for editing
        />
      )}
    </div>
  );
};

export default WorkspaceList;
