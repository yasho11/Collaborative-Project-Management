import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
declare global {
  interface Window {
    userId: string;
  }
}
import api from "../../axios/api"; // Axios instance
import SideBar from "../componentSM/Sidebar";
import { PenLineIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState({ Name: "", Email: "", Password: "" });
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  const jwtToken = localStorage.getItem("token");
  if (!jwtToken) {
    console.error("No token found");
    return;
  }
  
  const decodedToken: any = jwtDecode(jwtToken);
  const userId = decodedToken.id; // Ensure this matches your backend token structure
  useEffect(() => {
    api.get("/auth/me")
      .then((res) => {
        const { Name, Email, Password } = res.data;
        setUser({ Name, Email, Password });
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const handleVerifyPassword = async () => {
    if(password == "   "){
      alert("Please enter the password first!");
    }else{
      try {
        const res = await api.post("/auth/verify-password", { password });
        if (res.data.success) {
          setIsPasswordCorrect(true);
          setShowChangePassword(true);
        } else {
          alert("Incorrect Password!");
        }
      } catch (error) {
        console.error("Password verification failed", error);
      }
    }
   
  };

  const handleUpdateProfile = async () => {
    try {
      await api.put(`/auth/update-profile`, {
        UpUserName: user.Name,
        Email: user.Email, // Email is disabled but kept for reference
        UpUserPassword: newPassword || user.Password,
      });

      alert("Profile updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
     if(isPasswordCorrect){
      await api.delete(`/users/${userId}`);
      alert("Account deleted successfully!");
      navigate("/register")
     }else{
      console.log("Please enter the correct password");
     }
    } catch (error) {
      console.error("Error deleting profile", error);
    }
  };

  return (
    <div className="bg-[#304258] flex flex-row min-h-screen overflow-hidden">
      <SideBar />

      <div className="flex-1 flex justify-center items-center bg-white p-10 rounded-lg">
        <div className="bg-[#C7D9E5] w-[750px] p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>

          <form className="space-y-6">
            {/* Name Input */}
            <div className="flex flex-col">
              <label className="text-lg font-medium">Your Name:</label>
              <input
                type="text"
                value={user.Name}
                onChange={(e) => setUser({ ...user, Name: e.target.value })}
                className="w-full px-4 py-2 mt-2 border rounded-md"
              />
            </div>

            {/* Email Input (Disabled) */}
            <div className="flex flex-col">
              <label className="text-lg font-medium">Your Email:</label>
              <input
                type="text"
                value={user.Email}
                disabled
                className="w-full px-4 py-2 mt-2 border rounded-md bg-gray-200"
              />
            </div>

            {/* Password Verification */}
            <div className="flex flex-col">
              <label className="text-lg font-medium">Your Password:</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mt-2 border rounded-md"
                />
                <button
                  type="button"
                  className="font-normal p-[20px] rounded-md"
                  onClick={handleVerifyPassword}
                >
                  <PenLineIcon size={20} color="black" />
                </button>
              </div>
            </div>

            {/* Change Password Section */}
            {showChangePassword && (
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-lg font-medium">New Password:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 mt-2 border rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-lg font-medium">Confirm Password:</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 mt-2 border rounded-md"
                  />
                </div>
              </div>
            )}
          </form>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button 
              className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
              onClick={handleDeleteProfile}
            >
              Delete Account
            </button>
            <button 
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
              onClick={handleUpdateProfile}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
