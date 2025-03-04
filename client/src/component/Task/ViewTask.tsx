import React, { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import SideBar from "../componentSM/Sidebar";
import { FaPlus } from "react-icons/fa";
import api from "../../axios/api";
import { useParams } from "react-router-dom";
import TaskForm from "./TaskForm";
import MemberListPopup from "../Member/ViewMember";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
}

interface Member {
  _id: string;
  name: string;
  role: string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [isMemberPopupOpen, setIsMemberPopupOpen] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) {
        setError("Project ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/tasks/${projectId}`);
        setTasks(response.data);
      } catch (err) {
        setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleDeleteTask = async (taskId: string, e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      setError("Failed to delete task.");
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });

      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleFetchMembers = async () => {
    if (!projectId) {
      setError("Project ID is missing.");
      return;
    }

    try {
      const response = await api.get(`/projects/member/${projectId}`);
      setMembers(response.data.members);
      setIsMemberPopupOpen(true);
    } catch (err) {
      setError("Failed to load project members.");
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!projectId) {
      setError("Project ID is missing.");
      return;
    }

    try {
      await api.delete(`/projects/member/${projectId}/${memberId}`);
      setMembers((prev) => prev.filter((member) => member._id !== memberId));
    } catch (err) {
      setError("Failed to delete member.");
    }
  };

  return (
    <div className="bg-[#304258] flex flex-row min-h-screen overflow-hidden">
      <SideBar />

      <div className="flex-1 flex flex-col p-10 bg-white rounded-lg">
        <h1 className="text-3xl font-bold text-gray-700">Your Tasks</h1>
        <p className="text-gray-500 mb-4">Keep track of your progress and stay productive.</p>

        {/* Button to Show Project Members */}
        <button
          onClick={handleFetchMembers}
          className="mb-4 text-underline text-black"
        >
          View Project Members
        </button>

        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div
              className="bg-[#C7D9E5] flex flex-col justify-center items-center p-4 rounded-lg cursor-pointer hover:bg-gray-300 transition"
              onClick={() => setModalOpen(true)}
            >
              <FaPlus className="text-4xl text-gray-600" />
              <p className="mt-2 text-gray-600 font-semibold">Add a new task</p>
            </div>

            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  taskId={task._id}
                  name={task.title}
                  dueDate={task.dueDate}
                  progress={task.status}
                  onProgressChange={(newStatus) =>
                    handleStatusChange(task._id, newStatus)
                  }
                  onDeleteClick={(e) => handleDeleteTask(task._id, e)}
                  onCommentClick={() => console.log("Comment clicked")}
                />
              ))
            ) : (
              <p className="text-center text-gray-500">No tasks found.</p>
            )}
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <TaskForm onClose={() => setModalOpen(false)} onSubmit={handleAddTask} />
          </div>
        </div>
      )}

      {/* Member List Popup */}
      {isMemberPopupOpen && (
        <MemberListPopup
          members={members}
          onClose={() => setIsMemberPopupOpen(false)}
          onDeleteMember={handleDeleteMember}
        />
      )}
    </div>
  );
};

export default TaskList;
