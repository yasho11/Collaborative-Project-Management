import React from "react";

interface TaskItemProps {
  taskId: string;
  name: string;
  dueDate?: string;
  progress: string;
  onProgressChange: (newProgress: string) => void;
  onDeleteClick: (e: React.FormEvent) => Promise<void>;
  onCommentClick:() => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  name,
  dueDate,
  progress,
  onProgressChange,
  onDeleteClick,
}) => {
  const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString("en-GB") : "No due date";
  return (
    <div className="flex items-center justify-between bg-blue-100 px-4 py-2 rounded-md">
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{name}</span>
        <span className="text-sm text-gray-600">{formattedDate}</span>
      </div>

      <select value={progress} onChange={(e) => onProgressChange(e.target.value)} className="bg-gray-700 text-white px-3 py-1 rounded-md">
        <option value="Not Started">Not Started</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <button onClick={onDeleteClick} className="text-gray-600 hover:text-red-600">🗑️</button>
    </div>
  );
};

export default TaskItem;
