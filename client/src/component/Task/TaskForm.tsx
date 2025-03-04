import React, { useState } from "react";
import api from "../../axios/api";
import { useParams } from "react-router-dom";

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (task: any) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const { projectId } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/tasks/", {
        title,
        description,
        dueDate,
        status: "Not Started", // Default status when adding
        priority,
        projectId,
      });

      onSubmit(response.data.task);
      onClose();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2 className="text-xl font-bold">Add Task</h2>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border-1 mt-5 p-3 bg-[#F5EFEB]"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-1 mt-5 p-3 bg-[#F5EFEB]"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="border-1 mt-5 p-3 bg-[#F5EFEB]"
          />

          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="border-1 mt-5 p-3 bg-[#F5EFEB]">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <div className="flex justify-center space-x-2 mt-4">
            <button type="button" onClick={onClose} className="bg-red-400 p-2 mx-3 hover:bg-red-500">
              Cancel
            </button>
            <button type="submit" className="bg-green-400 p-2 mx-3 hover:bg-green-500">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
