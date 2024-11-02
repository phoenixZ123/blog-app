import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Themecontext } from "../contexts/ThemeContext";
import useTheme from "../hooks/useTheme";
export const Navbar = () => {
  let [search, setSearch] = useState("");
  let { theme, changeTheme } = useTheme();
  // let [blogTheme, setBlogTheme] = useState("");
  let navigate = useNavigate();
  let handleSearch = () => {
    navigate(`/?search=${search}`);
    setSearch("");
  };

  const handleChangeTheme = (e) => {
    changeTheme(e.target.value); 
  };
  return (
    <nav className="border border-b-1 shadow-sm">
      <ul className="flex justify-between items-center p-2 max-w-5xl mx-auto">
        <li className="flex justify-center items-center gap-3">
          {/* search btn */}
          <button
            onClick={handleSearch}
            className="flex py-1 justify-center items-center rounded-full gap-3 p-1 bg-gradient-to-r from-teal-400 to-blue-500  text-white"
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
            {/* <span className="md:block hidden">Search</span> */}
          </button>

          <input
            type="text"
            className="outline-none p-1 rounded-lg "
            placeholder="search blog activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </li>
        {/* search */}
        {/*  */}
        <Link
          to="/"
          className="flex justif y-center items-center gap-3 md:-ml-32 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-indigo-500 mr-5 md:mr-0"
          >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>

          <span className="font-bold text-xl text-primary md:block hidden">
            My Blog Channel
          </span>
        </Link>
        <li className="flex justify-center items-center gap-3 -ml-8 text-sm">
          <Link
            to="/create"
            className="flex justify-center items-center rounded-xl gap-3 p-1 bg-gradient-to-r from-teal-400 to-blue-500  text-white"
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
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <span className="md:block hidden">Create Blog</span>
          </Link>
         
            <div className="w-10 flex ">
            <img className="w-full rounded-full " src="/aa.jpg" alt="" />
            <div className=" p-1">
              <select
                onChange={handleChangeTheme}
                className="border p-1 rounded-md"
              >
                <option value="light" className="light">Light </option>
                <option value="dark" className="dark">Dark </option>
                <option value="coffee">Coffee</option>
              </select>
            </div>
          </div> 
        </li>
      </ul>
    </nav>
  );
};
