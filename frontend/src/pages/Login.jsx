import React, { useState } from "react";
import { User, Lock, LogIn, Twitter, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ usersname: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(formData);
      localStorage.setItem("user", JSON.stringify(user));
      onLoginSuccess(user);
      navigate("/");
    } catch (err) {
      setError("Invalid username or password", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-lg">
      <div className="flex justify-center mb-6">
        <Twitter size={48} className="text-blue-500" />
      </div>
      <h2 className="text-center text-3xl font-bold mb-2">Welcome Back</h2>
      <p className="text-center text-gray-600 mb-6">Sign in to your account</p>
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="flex items-center border border-gray-300 rounded p-2">
          <User className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Username"
            value={formData.usersname}
            onChange={(e) =>
              setFormData({ ...formData, usersname: e.target.value })
            }
            className="w-full outline-none"
            required
          />
        </div>

        <div className="flex items-center border border-gray-300 rounded p-2 relative">
          <Lock className="text-gray-400 mr-2" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full outline-none"
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 cursor-pointer text-gray-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          <div className="flex justify-center items-center gap-2">
            <LogIn size={20} />
            Sign In
          </div>
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/register")}
          className="text-blue-600 underline font-semibold hover:text-blue-800"
        >
          Create Account
        </button>
      </p>
    </div>
  );
};

export default Login;
