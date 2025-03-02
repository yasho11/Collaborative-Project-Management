import React, { useState, useEffect } from "react";
import api from "../../axios/api";

interface AddItemModalProps {
  type: "workspace" | "project" | "task";
  parentId?: string;
  onClose: () => void;
  onAdd: (item: any) => void;
  existingItem?: { _id: string; name: string; description: string } | null;
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  type,
  parentId,
  onClose,
  onAdd,
  existingItem,
}) => {
  const [name, setName] = useState(existingItem?.name || "");
  const [description, setDescription] = useState(existingItem?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingItem) {
      setName(existingItem.name);
      setDescription(existingItem.description);
    }
  }, [existingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let payload: any = { name, description };
      let response;

      if (existingItem) {
        // If editing, send PUT request
        response = await api.put(`/workspaces/${existingItem._id}`, payload);
      } else {
        let endpoint = "/workspaces/";
        if (type === "project") {
          endpoint = `/projects`;
          payload.workspaceId = parentId;
        } else if (type === "task") {
          endpoint = `/tasks`;
          payload.projectId = parentId;
        }
        response = await api.post(endpoint, payload);
      }

      onAdd(response.data.workspace || response.data.project || response.data.task);
      onClose();
    } catch (err) {
      console.error("Error adding/updating item:", err);
      setError("Failed to process. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {existingItem ? `Edit ${type}` : `Add ${type}`}
        </h2>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter name"
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Enter description"
            className="border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

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
