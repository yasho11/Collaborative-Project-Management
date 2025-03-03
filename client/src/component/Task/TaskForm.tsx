import React, { useState, useEffect } from "react";
import api from "../../axios/api";

interface TaskFormProps {
  type: "add" | "edit";
  taskData?: {
    _id: string;
    title: string;
    description: string;
    status: string;
    dueDate: string;
  };
  onClose: () => void;
  onSubmit: (task: any) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ type, taskData, onClose, onSubmit }) => {
  const [title, setTitle] = useState(taskData?.title || "");
  const [description, setDescription] = useState(taskData?.description || "");
  const [status, setStatus] = useState(taskData?.status || "Not Started");
  const [dueDate, setDueDate] = useState(taskData?.dueDate || "");

  useEffect(() => {
    if (taskData) {
      setTitle(taskData.title);
      setDescription(taskData.description);
      setStatus(taskData.status);
      setDueDate(taskData.dueDate);
    }
  }, [taskData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (type === "add") {
        const response = await api.post("/tasks/", { title, description, dueDate, status });
        onSubmit(response.data.task);
      } else if (type === "edit" && taskData) {
        const response = await api.put(`/tasks/${taskData._id}`, { title, description, dueDate, status });
        onSubmit(response.data.task);
      }
      onClose();
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  return (
    <div className="modal-bg">
      <div className="modal-content">
        <h2 className="text-xl font-bold">{type === "add" ? "Add Task" : "Edit Task"}</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="input-field"
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-primary">{type === "add" ? "Add Task" : "Update"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
