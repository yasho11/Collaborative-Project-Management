import React from "react";
import { FaTrash } from "react-icons/fa";

interface Member {
  _id: string;
  name: string;
  role: string;
}

interface MemberListPopupProps {
  members: Member[];
  onClose: () => void;
  onDeleteMember: (memberId: string) => void; // Function to handle member deletion
}

const MemberListPopup: React.FC<MemberListPopupProps> = ({ members, onClose, onDeleteMember }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[350px]">
        <h2 className="text-xl font-bold mb-4">Members</h2>

        {members.length > 0 ? (
          <ul className="space-y-3">
            {members.map((member) => (
              <li key={member._id} className="p-2 bg-gray-100 rounded-md flex justify-between items-center">
                <div>
                  <span className="font-semibold">{member.name}</span> - <span className="text-gray-600">{member.role}</span>
                </div>
                <button
                  onClick={() => onDeleteMember(member._id)} // Pass the member's _id to parent
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No members found.</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MemberListPopup;
