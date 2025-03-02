import { useNavigate, Link } from "react-router-dom";
import { LogOut, LayoutDashboard, UserCircle, FolderKanban } from "lucide-react";

function SideBar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="bg-[#304258] h-screen w-[295px] flex flex-col py-8 px-4">
      <div className="flex flex-col justify-between h-full">
        {/* Logo / Title */}
        <div className="flex justify-center">
          <span className="text-white text-4xl font-extrabold">TaskHive</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col justify-center">
          <ul className="space-y-4">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 py-3 px-6 text-white text-xl font-medium hover:bg-[#3b4a63] rounded-md transition"
              >
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/workspace"
                className="flex items-center gap-3 py-3 px-6 text-white text-xl font-medium hover:bg-[#3b4a63] rounded-md transition"
              >
                <FolderKanban size={20} />
                Workspace
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-3 py-3 px-6 text-white text-xl font-medium hover:bg-[#3b4a63] rounded-md transition"
              >
                <UserCircle size={20} />
                Profile
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={logout}
            className="flex items-center gap-3 text-white text-xl font-semibold px-6 py-3 hover:bg-[#3b4a63] hover:text-black transition rounded-md"
          >
            <LogOut size={24} />
            Log Out
          </button>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
