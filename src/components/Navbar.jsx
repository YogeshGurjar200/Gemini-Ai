import ThemeToggle from "./ThemeToggle";
import { HiMenu, HiX } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { setLoadingLogout } from "../features/auth/authSlice";
function Navbar({ setSidebarOpen, sidebarOpen }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(setLoadingLogout(true));

    setTimeout(() => {
      dispatch(logout());
      dispatch(setLoadingLogout(false));
    }, 2000);
  };
  return (
    <div className="navbar flex justify-between bg-base-100">
      <div className=" sm:hidden flex-1">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn btn-ghost btn-sm"
        >
          {!sidebarOpen && <HiMenu size={20} />}
        </button>
      </div>

      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Gemini </a>
      </div>

      <div className="flex-none flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={handleLogout}
          className="btn btn-error btn-sm flex items-center gap-2"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
