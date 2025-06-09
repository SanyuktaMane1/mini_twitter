import React, { useState } from "react";
import { UserPlus, User, Lock, Twitter, Eye, EyeOff } from "lucide-react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ usersname: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      setMessage("Registration successful. Please sign in.");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError("Registration failed. Try a different username.", err);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-8 border rounded-lg shadow-lg">
      <div className="flex justify-center mb-6">
        <Twitter size={48} className="text-blue-500" />
      </div>
      <h2 className="text-center text-3xl font-bold mb-2">Create Account</h2>
      <p className="text-center text-gray-600 mb-6">Sign up to get started</p>

      <form onSubmit={handleRegister} className="space-y-5">
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
        {message && <p className="text-green-600 text-sm">{message}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
        >
          <div className="flex justify-center items-center gap-2">
            <UserPlus size={20} />
            Sign Up
          </div>
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-blue-600 underline font-semibold hover:text-blue-800"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

export default Register;
