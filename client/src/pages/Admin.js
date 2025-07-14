// Layout.jsx
import { Outlet, NavLink } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import {
  MdPerson,
  MdDashboard,
  MdCloudUpload,
  MdBarChart,
  MdMenu
} from "react-icons/md";

import { AuthContext } from "../AuthContext";
import logo from "../assets/excelsage-logo.png";
import TableHeader from "./components/TableHeader";
import moscot from "../assets/moscot2.png";
import apiClient from "../axiosClient";
import TableContainer from "./components/TableContainer";
import Pagination from "./components/Pagination";

export function Tile({ c, Ic, title, s }) {
  const extra = s ? "md:col-start-4" : "";
  return (

    <div className={"rounded-2xl border border-gray-200 bg-white p-5  md:p-6 col-span-3 " + s}>
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
        <Ic className="text-gray-800 size-6 " />
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-black ">
            {title}
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-3xl ">
            {c}
          </h4>
        </div>

      </div>
    </div>);
}

export default function Admin() {
  const { user } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const profileRef = useRef();
  const [loading, setLoading] = useState(false)
  const [uploads, setuploads] = useState(0);
  const [charts, setcharts] = useState(0);
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const limit = 10
  const [doRefresh, refresh] = useState(true)

  function loadData() {
    setLoading(true)
    apiClient.get("/admin/test",{ params: { page, limit } })
      .then(data => { console.log(data); 
        setUsers(data?.data?.data || []);
        setTotal(data.data.pagination?.totalItems || 0);
       })
      .catch(() => setUsers([]))

      .finally(() => { setLoading(false); refresh(false) })
  }

  useEffect(() => {
    if (doRefresh) { loadData(); }
  }, [doRefresh])
  useEffect(() => {
    loadData();
  }, [page])
  useEffect(() => {
    if ((page - 1) * limit >= total && page !== 1) {
      setPage(page - 1)
    }
  }, [total])

  useEffect (()=>{
    apiClient.get('/admin/stats').then(res=>{
      setuploads(res.data.uploads);
      setcharts(res.data.charts);

    })

  },[])
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



          <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileOpen(false)}>
            <MdDashboard className="text-lg" /> Admin Panel
          </NavLink>



        </nav>

        {/* Recent charts section */}

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

            <div>
              {/* // header */}
              <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-1"></div>
                <Tile title="Files Uploaded" Ic={MdCloudUpload} c={uploads} s={1} />
                <Tile title="Charts Generated" Ic={MdBarChart} c={charts} />
                <Tile title="Users" Ic={MdPerson} c={total} />
              </div>

              {/* users */}
              <div className="grid grid-cols-12 gap-4 md:gap-6 my-3">
                <div className="col-span-12 lg:col-span-9 lg:col-start-2">
                  {loading ? (
                    <div className="text-center py-6 text-gray-500">Loading...</div>
                  ) : (
                    <TableContainer>

                      <TableHeader text="Users" />

                      <div className="max-w-full overflow-x-auto">

                        <table className="min-w-full">
                          <thead className="border-gray-100  border-y">
                            <tr>
                              <th className="py-3 font-medium text-gray-500 text-start text-theme-xs">
                                User
                              </th>
                              <th className="py-3 font-medium text-gray-500 text-start text-theme-xs">
                                Uploads
                              </th>
                              <th className="py-3 font-medium text-gray-800 text-start text-theme-xs">
                                Role
                              </th>
                              <th className="py-3 font-medium text-gray-500 text-start text-theme-xs">
                                Action
                              </th>
                            </tr>
                          </thead>
                          {/* body */}
                          <tbody className="divide-y divide-gray-100 ">

                            {users.map((en) => {
                              let action = en.role=='user'?"promote":"demote"
                              return (
                                <tr key={en.id} className="cursor-pointer  rounded-2xl"  >
                                  <td className="py-3">
                                    <div className="flex items-center gap-3">
                                      <p className="font-medium text-gray-800 text-theme-sm ">
                                        {en.name}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-3">
                                      <p className="font-medium text-gray-800 text-theme-sm ">
                                        {en.excelCount}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-3">
                                      <p className="font-medium text-gray-800 text-theme-sm ">
                                        {en.role.charAt(0).toUpperCase() + en.role.slice(1)}
                                      </p>
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <div className="flex items-center gap-3">
                                      <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-theme-sm font-medium 
                    text-gray-700 shadow-theme-xs 
                    hover:bg-yellow-200 -50 hover:text-yellow-600 "
                                        onClick={(e) => {
                                          console.log('dle');
                                          
                                          apiClient.get(`/admin/${action}/${en._id}` , { data: { id: en.id } }).then(res => {
                                            console.log(res);
                                              refresh(true)
                                            
                                          }).catch(e => {
                                            console.log(e);
                                          })
                                          e.stopPropagation()
                                        }}
                                      >
                                        {action.charAt(0)+action.slice(1)}
                                      </button>
                                    </div>
                                  </td>
                                </tr>

                              )
                            })}
                          </tbody>

                        </table>
                      </div>
                    </TableContainer>
                  )}

                </div>
                <div className="col-span-12 lg:col-span-9 lg:col-start-2 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4  sm:px-6">
                  <Pagination page={page} setPage={setPage} total={total} limit={limit} />
                </div>
              </div>



            </div>

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
                +91 98765 43210
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
