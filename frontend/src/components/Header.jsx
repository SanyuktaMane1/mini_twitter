import React, { useState, useRef, useEffect } from "react";
import { User, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
const Header = ({ actualUser, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileClick = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  const handleDashboardClick = () => {
    setMenuOpen(false);
    navigate("/");
  };

  const handleLogoutClick = () => {
    setMenuOpen(false);
    onLogout();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-sky-200 px-6 py-3 flex justify-between items-center w-full fixed top-0 left-0 z-50">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src={logo}
          alt="Logo"
          className="w-15 h-10 object-contain   p-1 bg-white shadow-sm"
        />
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-full hover:bg-sky-100 transition-colors border border-sky-200"
        >
          <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-medium">
            {actualUser?.username?.slice(0, 1).toUpperCase() || "U"}
          </div>
          <span className="font-medium text-sky-700">
            {actualUser?.username || "User"}
          </span>
          <ChevronDown
            size={16}
            className={`text-sky-500 transition-transform ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-sky-200 rounded-lg shadow-md z-50 overflow-hidden">
            {location.pathname === "/profile" ? (
              <button
                onClick={handleDashboardClick}
                className="w-full text-left px-4 py-3 text-sm text-sky-700 hover:bg-sky-50 transition-colors flex items-center gap-2"
              >
                <LayoutDashboard size={16} className="text-sky-600" />
                Dashboard
              </button>
            ) : (
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-3 text-sm text-sky-700 hover:bg-sky-50 transition-colors flex items-center gap-2"
              >
                <User size={16} className="text-sky-600" />
                My Profile
              </button>
            )}
            <button
              onClick={handleLogoutClick}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-sky-100"
            >
              <LogOut size={16} className="text-red-600" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;