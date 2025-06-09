import React, { useState, useRef, useEffect } from "react";
import { Twitter, User, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

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
    <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center w-full fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2">
        <Twitter className="text-blue-500" />
        <h1 className="text-xl font-bold text-blue-600">Mini Twitter</h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 transition"
        >
          <User size={18} />
          <span className="font-medium">{actualUser?.username || "User"}</span>
          <ChevronDown size={16} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-50">
            {location.pathname === "/profile" ? (
              <button
                onClick={handleDashboardClick}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                My Profile
              </button>
            )}
            <button
              onClick={handleLogoutClick}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
