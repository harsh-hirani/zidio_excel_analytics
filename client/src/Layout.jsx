// Layout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import {
  MdUpload,
  MdDashboard,
  MdCloudUpload,
  MdBarChart,
  MdMenu
} from "react-icons/md";
import { AuthContext } from "./AuthContext";
import logo from "./assets/excelsage-logo.png";
import moscot from "./assets/moscot2.png";
import apiClient from "./axiosClient";
export default function Layout() {
  const { user } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [recentCharts, setRecentCharts] = useState([]);
  const profileRef = useRef();

  // useEffect(() => {
  //   function handleClickOutside(e) {
  //     if (profileRef.current && !profileRef.current.contains(e.target)) {
  //       setShowProfile(false);
  //     }
  //   }
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  useEffect(() => {
    apiClient.get("/app/recent-charts")
      .then(data => { console.log(data); return setRecentCharts(data?.data?.data || []) })
      .catch(() => setRecentCharts([]));
  }, []);

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full">
      {/* Brand */}
      <div>
        <div className="flex items-center gap-2 px-2 mb-6">
          <img src={logo} alt="Excel Sage" className="w-10 h-10 rounded" />
          <div className="leading-tight font-bold">
            <div>Excel</div>
            <div>Sage</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/uploads/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:text-primary hover:bg-accent/80 transition"
            onClick={() => setMobileOpen(false)}
          >
            <MdUpload className="text-lg" /> Upload
          </NavLink>

          <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>
            <MdDashboard className="text-lg" /> Dashboard
          </NavLink>

          <NavLink to="/uploads" className={navLinkClass} onClick={() => setMobileOpen(false)}>
            <MdCloudUpload className="text-lg" /> Uploads
          </NavLink>

          <NavLink to="/charts" className={navLinkClass} onClick={() => setMobileOpen(false)}>
            <MdBarChart className="text-lg" /> Charts
          </NavLink>
        </nav>

        {/* Recent charts section */}
        <div className="mt-10  max-h-72 overflow-y-auto pr-1">
          <h3 className="text-sm font-semibold px-2 mb-3 text-sidebar-text">Recent Charts</h3>
          {recentCharts.length === 0 ? (
            <div className="px-3 text-sm text-gray-400">No recent charts</div>
          ) : (
            <div className="flex flex-col gap-1">
              {recentCharts.map((item) => (
                <NavLink
                  to={`/chart/${item.id}`}
                  key={item.id}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${isActive
                      ? "bg-accent text-primary font-semibold"
                      : "text-sidebar-text hover:bg-sidebar-hover hover:text-primary"
                    }`
                  }
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {item.fname[0]}
                  </div>
                  {item.fname}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile */}
      <div className="relative px-1 mt-8" ref={profileRef}>
        <NavLink
          to="/profile"

          className="block  text-sm border-t-2 text-text-main  hover:text-primary"
        >

          <button

            className="flex items-center w-full gap-2 px-1 py-1 rounded-lg text-sm hover:bg-sidebar-hover"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}`}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-medium">{user?.name}</span>
          </button>
        </NavLink>


      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-text-main">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-normal px-4 py-3 border-b">
        <button onClick={() => setMobileOpen(true)}>
          <MdMenu className="text-2xl text-primary" />
        </button>
        <div className="flex items-center ml-5">
          <img src={logo} alt="Excel Sage" className="w-8 h-8 rounded" />
          <div className="text-sm font-bold leading-tight ml-2">
            <div>Excel</div>
            <div>Sage</div>
          </div>
        </div>
      </div>


      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-64 bg-sidebar-bg bg-white p-4 overflow-y-auto border-r shadow-lg relative z-50">
            {SidebarContent}
          </div>
          <div
            className="flex-1 bg-black bg-opacity-40"
            onClick={() => setMobileOpen(false)}
          ></div>
        </div>
      )}

      {/* Main layout */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex bg-white flex-col fixed top-0 bottom-0 left-0 w-64 px-4 py-6 bg-sidebar-bg border-r border-gray-200 overflow-y-auto z-40">
          {SidebarContent}
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col md:ml-64">
          <main className="flex-1 overflow-y-auto px-4 py-6">
            <Outlet />
          </main>

          {/* Global Footer */}
          <footer className="border-t mt-auto px-4 py-4 text-xs text-center text-gray-400">
            <div className="grid md:grid-cols-3 gap-4 items-center">
              <div className="flex justify-center md:justify-start">
                <img src={moscot} alt="Moscot" className="w-10 h-14" />
              </div>
              <div className="text-center">
                © {new Date().getFullYear()} Excel Sage. All rights reserved.
              </div>
              <div className="flex flex-col text-[11px] md:items-end">
                <strong>Contact</strong>
                support@excelsage.com<br />
                +91 00000 43210
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${isActive
    ? "bg-accent text-primary font-semibold"
    : "text-sidebar-text hover:bg-sidebar-hover hover:text-primary "
  }`;
