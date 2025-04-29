import { Menu, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Navbar({ username, firstName, lastName }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const displayName = firstName && lastName ? `${firstName} ${lastName}` : username;

  return (
    <nav className="w-full bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <h1 className="text-xl md:text-2xl font-bold tracking-wide">
        <Link to="/" className="cursor-pointer">
          Warehouse Management System
        </Link>
      </h1>

      {/* Desktop view */}
      <div className="hidden md:flex items-center gap-6">
        {/* Hello greeting first */}
        <div className="relative group cursor-pointer">
          <div className="text-sm font-medium flex items-center gap-1 whitespace-nowrap">
            Hello, {displayName}
            <ChevronDown size={18} />
          </div>
          <div className="absolute right-0 mt-2 w-36 bg-white text-blue-900 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-blue-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden"
      >
        <Menu />
      </button>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 right-6 bg-blue-800 text-white p-4 rounded shadow-md flex flex-col gap-3 md:hidden z-10">
          <div className="bg-white text-blue-900 font-medium rounded-full px-4 py-1">
            {username}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:underline cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
