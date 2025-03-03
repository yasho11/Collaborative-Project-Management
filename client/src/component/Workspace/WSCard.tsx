import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaFileAlt, FaCalendarAlt } from "react-icons/fa";

interface WorkspaceProps {
  workspaceId: string; // Add workspaceId
  name: string;
  description: string;
  projectsCount: number;
  date?: string;
  onDelete?: (e: React.FormEvent) => void;
  onEdit?: () => void;
}

const WSCard: React.FC<WorkspaceProps> = ({
  workspaceId,
  name,
  description,
  projectsCount,
  date,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="bg-[#577C8E] text-white p-4 rounded-2xl shadow-md w-80 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">{name}</h2>
        <FaTrash className="cursor-pointer text-gray-300 hover:text-red-500" onClick={onDelete} />
      </div>

      <p className="text-sm text-gray-200 mt-2">
        <span className="font-semibold">Description:</span> {description}
      </p>

      <div className="flex items-center mt-3">
        <FaFileAlt className="mr-2 text-gray-300" />
        <span className="text-gray-300">Projects: {projectsCount}</span>
      </div>

      {date && (
        <div className="flex items-center mt-2">
          <FaCalendarAlt className="mr-2 text-gray-300" />
          <span className="text-gray-300">Date: {date}</span>
        </div>
      )}

      <FaEdit className="absolute bottom-4 right-4 text-gray-300 hover:text-green-400 cursor-pointer" onClick={onEdit} />

      {/* Link to Projects Page */}
      <Link to={`workspace/${workspaceId}/projects`} className="text-blue-300 mt-4 block text-sm underline">
        View Projects
      </Link>
    </div>
  );
};

export default WSCard;
