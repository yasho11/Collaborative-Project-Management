import React, { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import SideBar from "../componentSM/Sidebar";
import { FaPlus } from "react-icons/fa";
import api from "../../axios/api";
import { useNavigate, useParams } from "react-router-dom";
import TaskForm from "./TaskForm";
import { Link } from "react-router-dom";

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<"add" | "edit">("add");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!projectId) {
        setError("Porject ID is missing.");
        console.log("Porject ID is missing.");
        return;
      }

      try {
        const response = await api.get(`/tasks/`);
        if(response.status == 404){
            setLoading(false);
            console.log("No data to show")
        }else{
            setTasks(response.data.tasks);
            console.log(tasks)
        }

      } catch (err) {
        console.error("Error fetching tasks:", err);
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

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((p) => (p._id === updatedTask._id ? updatedTask : p)));
  };

  const handleDeleteTask = async (taskId: string, e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((p) => p._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task.");
    }
  };
  const HandleComment = async (taskId: string, e: React.FormEvent) => {
    
      {/* Link to Projects Page */}
      <Link to={`/workspace/${taskId}/projects`} className="text-blue-300 mt-4 block text-sm underline">
        💬
      </Link>
  };

  return (
    <div className="bg-[#304258] flex flex-row min-h-screen overflow-hidden">
      <SideBar />

      <div className="flex-1 flex flex-col p-10 bg-white rounded-lg">
        <h1 className="text-3xl font-bold text-gray-700">Your tasks</h1>
        <p className="text-gray-500 mb-4">Keep track of your progress and stay productive.</p>

        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            <div
              className="bg-[#C7D9E5] flex flex-col justify-center items-center p-4 rounded-lg cursor-pointer hover:bg-gray-300 transition"
              onClick={() => {
                setEditMode("add");
                setSelectedTask(null);
                setModalOpen(true);
              }}
            >
              <FaPlus className="text-4xl text-gray-600" />
              <p className="mt-2 text-gray-600 font-semibold">Add a new task</p>
            </div>

            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                taskId={task._id}
                name= {task.title}
                dueDate={task.dueDate}
                progress={task.status}
                onCommentClick={(e) => HandleComment(task._id,e)}
            onProgressChange={() => {
                  setEditMode("edit");
                  setSelectedTask(task);
                  setModalOpen(true);
                }}
                onDeleteClick={(e)=> handleDeleteTask(task._id,  e)}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <TaskForm
          type={editMode}
          taskData={selectedTask || undefined}
          onClose={() => setModalOpen(false)}
          onSubmit={editMode === "add" ? handleAddTask : handleUpdateTask}
        />
      )}
    </div>
  );
};

export default TaskList;
