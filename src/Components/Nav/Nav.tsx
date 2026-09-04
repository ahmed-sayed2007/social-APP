import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { tokenContext } from "../../context/tokenContwxtProvider.tsx";
import { userContext } from "../../context/UserContext.tsx";
import { FiHome, FiLogOut, FiUser } from "react-icons/fi";

export default function Nav() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const auth = useContext(tokenContext);
  if (!auth) throw new Error("Nav must be used inside TokenContextProvider");

  const userData = useContext(userContext);
  const navigate = useNavigate();
  const { setToken } = auth;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function logOut() {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/LogIn");
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/Home" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
            LinkedPost
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <NavLink to="/Home" className={navLinkClass}>
            <FiHome size={18} />
            <span className="hidden sm:inline">Home</span>
          </NavLink>
        </div>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsUserMenuOpen((v) => !v)}
            type="button"
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
            aria-expanded={isUserMenuOpen}>
            <img
              className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
              src={userData?.photo}
              alt={userData?.name ?? "User"}
            />
            <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[120px] truncate">
              {userData?.name}
            </span>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800 truncate">{userData?.name}</p>
                <p className="text-xs text-slate-500 truncate">{userData?.email}</p>
              </div>
              <ul className="p-1.5">
                <li>
                  <Link
                    to="/Profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                    <FiUser size={16} className="text-slate-400" />
                    My Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                    <FiLogOut size={16} />
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
