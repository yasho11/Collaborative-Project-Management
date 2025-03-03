import React from "react";

interface TaskItemProps {
  taskId: string;
  name: string;
  dueDate?: string;
  progress: string;
  onProgressChange: (newProgress: string) => void;
  onCommentClick: (e:React.FormEvent) => Promise<void>;
  onDeleteClick: (e: React.FormEvent) => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({
  name,
  dueDate,
  progress,
  onProgressChange,
  onCommentClick,
  onDeleteClick,
}) => {
  return (
    <div className="flex items-center justify-between bg-blue-100 px-4 py-2 rounded-md">
      {/* Left: Task Info */}
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{name}</span>
        {dueDate && <span className="text-sm text-gray-600">{dueDate}</span>}
      </div>

      {/* Right: Progress, Comments, Delete */}
      <div className="flex items-center space-x-4">
        {/* Progress Dropdown */}
        <select
          className="bg-gray-700 text-white px-3 py-1 rounded-md"
          value={progress}
          onChange={(e) => onProgressChange(e.target.value)}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Comment Button */}
        <button onClick={onCommentClick} className="text-gray-600 hover:text-gray-800">
          💬
        </button>

        {/* Delete Button */}
        <button onClick={(e) => onDeleteClick(e)} className="text-gray-600 hover:text-red-600">
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
