import { useState } from "react";
import LogoSide from "../../assets/LogoSide.png";
import { useNavigate } from "react-router-dom";
import api from "../../axios/api";

function Login() {
  const [Email, SetEmail] = useState<string>("");
  const [Password, SetPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/Auth/Login", {
        Email,
        Password,
      });
      console.log(response.data);
      console.log(`Message: ${response.data.message}`);

      localStorage.setItem("token", response.data.token);

      navigate("/profile");
    } catch (error: any) {
      console.error(error.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Logo */}
      <div className="w-1/2 bg-[#304258] flex items-center justify-center">
        <img src={LogoSide} alt="Logo" className="w-full " />
      </div>

      {/* Right Side - Form */}
      <div className="w-1/2 flex flex-col items-center justify-center p-6 bg-[#F4EFEB] text-[#304258]">
        <h2 className="text-2xl font-bold mb-4 text-[#304258]">Glad to see you back!!</h2>

        <form className="w-full max-w-sm flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            className="border border-gray-300 p-2 rounded-md w-full"
            value={Email}
            onChange={(e) => SetEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            className="border border-gray-300 p-2 rounded-md w-full"
            value={Password}
            onChange={(e) => SetPassword(e.target.value)}
            placeholder="Password"
          />
          <button
            type="submit"
            className="bg-[#304258] text-white py-2 rounded-md w-full transition"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
