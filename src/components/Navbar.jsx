import React, { useContext, useEffect, useState,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import useTheme from "../hooks/useTheme";
import "../pages/index.css";
import { useSignOut } from "../hooks/useSignOut";
import { AuthContext } from "../contexts/AuthContext";

export const Navbar = () => {
  let sidebarRef=useRef(null);
  let [search, setSearch] = useState("");
  let [isSidebarOpen, setSidebarOpen] = useState(false);
  let { theme, changeTheme } = useTheme();
  let { logOut } = useSignOut();
  let navigate = useNavigate();
let {user}=useContext(AuthContext);

  const handleSearch = () => {
    navigate(`/?search=${search}`);
    setSearch("");
  };

  const handleChangeTheme = (e) => {
    changeTheme(e.target.value);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  let signOutUser = async () => {
    await logOut();
    navigate("/login");
    setSidebarOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);
  return (
    <div className="relative">
      <nav className="border-b shadow-sm">
        <ul className="flex justify-between items-center p-2 max-w-6xl mx-auto">
          {/* Search and Logo */}
          <li className="flex items-center gap-3">
            <button
              onClick={handleSearch}
              className="flex py-1 items-center rounded-full gap-3 p-1 bg-gradient-to-r from-teal-400 to-blue-500 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>

            <input
              type="text"
              className="outline-none p-1 rounded-lg "
              placeholder="Search blog activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </li>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 cursor-pointer mr-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6 text-indigo-500"
            >
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
            <span className="font-bold text-xl text-primary hidden md:block">
              My Blog Channel
            </span>
          </Link>

          {/* Create Blog, Logout, Profile and Settings */}
          <li className="flex items-center space-x-3 text-sm">
            <Link
              to="/create"
              className="flex items-center rounded-xl gap-2 p-1 bg-gradient-to-r from-teal-400 to-blue-500 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="hidden md:block">Create Blog</span>
            </Link>
            <img className="w-10 rounded-full" src="/aa.jpg" alt="Profile" />
            <button onClick={toggleSidebar} className="text-gray-600">
              <FiSettings size={24} />
            </button>
          </li>
        </ul>
      </nav>

      {/* Sidebar for Theme Selection */}
      {isSidebarOpen && (
        <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg p-4 z-50">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-gray-500"
          >
            ✕
          </button>
          <div>
            <div className="">
              
              {!user && <>
                <Link
                to={"/login"}
                onClick={signOutUser}
                className="border-primary border-2 flex justify-center items-center text-primary mt-2 hover:bg-zinc-300 w-full  rounded-lg px-2 py-1"
              >
                Log In
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5 m-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 7a5 5 0 1 1 3.61 4.804l-1.903 1.903A1 1 0 0 1 9 14H8v1a1 1 0 0 1-1 1H6v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 .293-.707L8.196 8.39A5.002 5.002 0 0 1 8 7Zm5-3a.75.75 0 0 0 0 1.5A1.5 1.5 0 0 1 14.5 7 .75.75 0 0 0 16 7a3 3 0 0 0-3-3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
                <Link
                to={"/register"}
                // onClick={signOutUser}
                className="bg-primary   mt-2 flex justify-center items-center hover:bg-zinc-500 w-full text-white rounded-lg px-2 py-1"
              >
                Register
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5 m-1"
                >
                  <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                </svg>
              </Link>
              </>}
              
            </div>
            {user && 
            <>  <span className="text-primary font-medium">
            Welcome, {user.displayName}
          </span> <button
              onClick={signOutUser}
              className="bg-red-400 flex justify-center items-center mt-2 hover:bg-red-500 w-full text-white rounded-lg px-2 py-1"
            >
              Logout
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5 m-1"
              >
                <path
                  fillRule="evenodd"
                  d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H6.75A.75.75 0 0 1 6 10Z"
                  clipRule="evenodd"
                />
              </svg>
            </button> </>
            
           }
           
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Theme
            </label>
            <select
              value={theme}
              onChange={handleChangeTheme}
              className="w-full p-2 border rounded-lg"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="cupcake">Cupcake</option>
              <option value="coffee">Coffee</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
