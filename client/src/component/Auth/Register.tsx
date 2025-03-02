import React, { useState } from "react";
import LogoSide from "../../assets/LogoSide.png";
import api from "../../axios/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      console.log(response.data);
      console.log(`Message: ${response.data.message}`);
      navigate("/login");
    } catch (error: any) {
      console.error(error.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden text-[#304258]">
      {/* Left Side - Logo */}
      <div className="w-1/2 bg-[#304258] flex items-center justify-center">
        <img src={LogoSide} alt="Logo" className="w-full " />
      </div>

      {/* Right Side - Form */}
      <div className="w-1/2 flex flex-col items-center justify-center p-6 bg-[#F4EFEB] text-[#304258]">
        <h2 className="text-2xl font-bold mb-4 text-[#304258]">Glad to see you!!</h2>

        <form className="w-full max-w-sm flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className="border border-gray-300 p-2 rounded-md w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="email"
            className="border border-gray-300 p-2 rounded-md w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            className="border border-gray-300 p-2 rounded-md w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button
          
            type="submit"
            className="bg-[#304258] text-white py-2 rounded-md w-full transition"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log In
          </a>
        </div>
      </div>
    </div>
  );
}

export default Register;
