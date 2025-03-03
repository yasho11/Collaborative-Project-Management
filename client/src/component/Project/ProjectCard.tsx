import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";


interface ProjectCardProps {
  projectId: string;
  name: string;
  dueDate: string;
  progress: number;
  onEdit: () => void;
  onDelete: (e:React.FormEvent) => Promise<void>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ name, dueDate, progress, onEdit, onDelete, projectId }) => {
  return (
    <div className="bg-[#C7D9E5] rounded-xl p-4 flex justify-between items-center shadow-md">
      <div>
        <h2 className="text-lg font-bold text-gray-800 underline">{name}</h2>
        <p className="text-sm text-gray-600">{dueDate}</p>
        {/* Link to Projects Page */}
      <Link to={`/project/${projectId}/tasks/`} className="text-blue-300 mt-4 block text-sm underline">
        View Task
      </Link>
      </div>

      <div className="flex flex-col items-end">
        <div className="flex flex-row">
        <FaEdit className="text-gray-600 cursor-pointer mr-2" onClick={onEdit} />
        <FaTrash className="text-gray-600 cursor-pointer mr-2" onClick={onDelete} />
        </div>
        <p className="text-xl font-bold text-gray-800 mt-2">{progress}%</p>
        <div className="w-24 h-2 bg-gray-300 rounded-full mt-2 relative">
          <div
            className="absolute left-0 h-2 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: progress < 80 ? "#90EE90" : "#FF6666",
            }}
          ></div>
          
      
        </div>
      </div>
      
    </div>
  );
};

export default ProjectCard;
