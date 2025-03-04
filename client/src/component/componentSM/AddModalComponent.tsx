import React, { useState, useEffect } from "react";
import api from "../../axios/api";

interface AddItemModalProps {
  type: "workspace" | "project" ;
  parentId?: string; // workspaceId for projects, projectId for tasks
  onClose: () => void;
  onAdd: (item: any) => void;
  existingItem?: {
    _id: string;
    Name: string;
    description: string;
    dueDate?: string;
    progress?: string;
  } | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  type,
  parentId,
  onClose,
  onAdd,
  existingItem,
}) => {
  const [Name, setName] = useState(existingItem?.Name || "");
  const [description, setDescription] = useState(existingItem?.description || "");
  const [dueDate, setDueDate] = useState(existingItem?.dueDate || "");
  const [progress, setProgress] = useState(existingItem?.progress || "Not Started");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.Name);
      setDescription(existingItem.description);
      if (existingItem.dueDate) setDueDate(existingItem.dueDate);
      if (existingItem.progress) setProgress(existingItem.progress);
    }
  }, [existingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let payload: any = { Name, description };

      if (type === "project") {
        payload.dueDate = dueDate;
      }
      let response;
      if (existingItem) {
        // Update existing item
        response = await api.put(`/${type}s/${existingItem._id}`, payload);
      } else {
        // Ensure correct parent ID
        if (type === "project" && !parentId) throw new Error("Workspace ID is required for projects.");

        // Assign correct parent ID
        if (type === "project") payload.workspaceId = parentId;

        response = await api.post(`/${type}s/${parentId}`, payload);
      }

      onAdd(response.data.workspace || response.data.project || response.data.task);
      onClose();
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{existingItem ? `Edit ${type}` : `Add ${type}`}</h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={`Enter ${type} Name`}
            className="border p-2 rounded"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder={`Enter ${type} description`}
            className="border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          {(type === "project" ) && (
            <input
              type="date"
              className="border p-2 rounded"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          )}

          { (
            <select
              className="border p-2 rounded"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          )}

          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            {loading ? "Saving..." : existingItem ? "Update" : "Add"}
          </button>

          <button type="button" className="text-gray-500 mt-2" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
