import React from "react";
import { FaEdit } from "react-icons/fa";

interface ProjectCardProps {
  name: string;
  dueDate: string;
  progress: number;
  onEdit: () => void;
  onDelete: (e:React.FormEvent) => Promise<void>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ name, dueDate, progress, onEdit }) => {
  return (
    <div className="bg-[#C7D9E5] rounded-xl p-4 flex justify-between items-center shadow-md">
      <div>
        <h2 className="text-lg font-bold text-gray-800 underline">{name}</h2>
        <p className="text-sm text-gray-600">{dueDate}</p>
      </div>

      <div className="flex flex-col items-end">
        <FaEdit className="text-gray-600 cursor-pointer" onClick={onEdit} />
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
