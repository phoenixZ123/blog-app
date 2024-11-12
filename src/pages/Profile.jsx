import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { motion } from "framer-motion";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import bagan from "../assets/bagan.jpg";

export const Profile = () => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  let [loading, setLoading] = useState(false);
  let [blogs, setBlogs] = useState([]);
  let [error, setError] = useState("");
  let location = useLocation();
  // let [date, setDate] = useState("");
  let[month,setMonth]=useState("");
  const params = new URLSearchParams(location.search);
  const searchData = params.get("search") || "";
  let [ratingFilter, setRatingFilter] = useState("");

  const handleSearch = () => {
    navigate(`/profile/?search=${search}`);
    setSearch("");
  };

  const goHome = () => {
    navigate("/");
  };
  const filteredData = blogs.filter(
    (item) =>
      item.title.toLowerCase().includes(searchData.toLowerCase()) ||
      item.category_name.toLowerCase().includes(searchData.toLowerCase()) ||
      item.recommand.toLowerCase().includes(searchData.toLowerCase())
  );
  // const handleDateChange = async (e) => {
  //   e.preventDefault(); // Prevent default behavior of the form/input

  //   setLoading(true); // Set loading state to true

  //   try {
  //     const currentUser = auth.currentUser;
  //     if (!currentUser) {
  //       setError("User not authenticated.");
  //       setLoading(false);
  //       return;
  //     }

  //     const selectedDate = e.target.value;
  //     setDate(selectedDate); // Update the date state with selected value

  //     const ref = collection(db, "blogs");
  //     let q;

  //     if (selectedDate) {
  //       q = query(
  //         ref,
  //         where("uid", "==", currentUser.uid),
  //         where("date", "==", selectedDate),
  //         orderBy("rating", "desc")
  //       );
  //     } else {
  //       q = query(
  //         ref,
  //         where("uid", "==", currentUser.uid),
  //         orderBy("date", "desc")
  //       );
  //     }

  //     await onSnapshot(q, (docs) => {
  //       if (docs.empty) {
  //         setError("No blogs found.");
  //       } else {
  //         const blogsArray = docs.docs.map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }));
  //         setBlogs(blogsArray);
  //         setError("");
  //       }
  //       setLoading(false);
  //     });
  //   } catch (e) {
  //     setError("Failed to load blogs.");
  //     setLoading(false);
  //   }

  //   navigate("/profile");
  // };

  useEffect(() => {
    try {
      let user = auth.currentUser;

      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const ref = collection(db, "blogs");
      let q = query(
        ref,
        where("uid", "==", user.uid),
        orderBy("rating", "desc"),
        orderBy("date", "desc")
      );

      onSnapshot(q, (docs) => {
        if (docs.empty) {
          setError("No blogs found.");
        } else {
          const blogsArray = docs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBlogs(blogsArray);
          setError("");
        }
        setLoading(false);
      });
    } catch (e) {
      setError("Failed to load blogs.");
      setLoading(false);
    }
  }, []);
  const mostRatingBlogs = () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const ref = collection(db, "blogs");
      let q = query(
        ref,
        where("uid", "==", currentUser.uid),
        orderBy("rating", "desc"),
        orderBy("date", "desc")
      );

      if (ratingFilter) {
        q = query(
          ref,
          where("uid", "==", currentUser.uid),
          where("rating", "==", parseInt(ratingFilter)),
          orderBy("date", "desc")
        );
      }

      onSnapshot(q, (docs) => {
        if (docs.empty) {
          setError("No blogs found.");
        } else {
          const blogsArray = docs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBlogs(blogsArray);
          setError("");
        }
        setLoading(false);
      });
    } catch (e) {
      setError("Failed to load blogs.");
      setLoading(false);
    }
    navigate("/profile");
  };
const handleMonthChange=()=>{
  setLoading(true);
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const ref = collection(db, "blogs");
    let q = query(
      ref,
      where("uid", "==", currentUser.uid),
      orderBy("rating", "desc"),
      orderBy("date", "desc")
    );
    const selectedMonth = month;
    if (month) {
      q = query(
        ref,
        where("uid", "==", currentUser.uid),
        where("month", "==", selectedMonth),
        orderBy("rating", "desc")
      );
    }

    onSnapshot(q, (docs) => {
      if (docs.empty) {
        setError("No blogs found.");
      } else {
        const blogsArray = docs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsArray);
        setError("");
      }
      setLoading(false);
    });
  } catch (e) {
    setError("Failed to load blogs.");
    setLoading(false);
  }
  navigate("/profile");
}
  const AllBlogs = () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const ref = collection(db, "blogs");
      let q = query(
        ref,
        where("uid", "==", currentUser.uid),
        orderBy("rating", "desc"),
        orderBy("date", "desc")
      );

      onSnapshot(q, (docs) => {
        if (docs.empty) {
          setError("No blogs found.");
        } else {
          const blogsArray = docs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBlogs(blogsArray);
          setError("");
        }
        setLoading(false);
      });
    } catch (e) {
      setError("Failed to load blogs.");
      setLoading(false);
    }
    navigate("/profile");
  };

  const deleteBlog = async (e, id) => {
    e.preventDefault();
    const ref = doc(db, "blogs", id);
    await deleteDoc(ref);
  };

  return (
    <div className="h-screen  bg-fixed bg-cover ">
      <div className="overflow-y-auto">
        {/* User Profile Information */}
        <div className="text-center flex flex-col items-center mt-3 space-y-2">
          <span className="text-lg font-semibold">{user.displayName}</span>
          <li className="flex items-center gap-3 mt-2">
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
              className="outline-none p-2"
              placeholder="Search your blog activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </li>
        </div>

        {/* Blog Interaction Buttons */}
        <div className="w-full flex justify-center space-x-5 p-3">
          <button className="bg-blue-500 text-white py-1 px-4 rounded">
            Like
          </button>
          <button className="bg-blue-500 text-white py-1 px-4 rounded">
            Comment
          </button>
          <button className="bg-blue-500 text-white py-1 px-4 rounded">
            Follower
          </button>
        </div>

        {/* Blog Display Options */}

        <div className="text-center space-x-2">
          <button
            className="bg-blue-500 text-white py-1 px-4 rounded"
            onClick={AllBlogs}
          >
            All Blogs
          </button>
          <button
            className="bg-gray-200 py-1 px-4 border-r-2 border"
            onClick={mostRatingBlogs}
          >
            {/* Rating Filter Dropdown */}

            <div className="my-4">
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">By Rating</option>
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
            </div>
          </button>
          {/* <button className="bg-gray-200 py-1 px-4 border-r-2 border" onClick={()=> navigate("/profile")}>
          Show All Blogs
        </button> */}
          <label htmlFor="month">Select Month:</label>
          <button onClick={handleMonthChange}>
          <select
        id="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        required
      >
        <option value="">--Select Month--</option>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
          </button>
      
        </div>

        {/* Your Blogs */}
        <div className="w-full flex justify-center">
          {!!filteredData.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className=" grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-3 mx-auto max-w-4xl"
            >
              {filteredData.map((item) => (
                <Link to={`/blogs/${item.id}`} key={item.id}>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                    }}
                    className="w-full"
                  >
                    <div className="p-2 rounded-lg shadow-md border border-1 m-1">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <span className="text-gray-500 text-sm">
                          {item.date
                            ? new Date(item.date).toLocaleDateString()
                            : "No date"}
                        </span>
                      </div>
                      {/* <img
                        src={bagan}
                        alt="Blog"
                        className="w-full rounded-md"
                      /> */}
                      <p className="text-gray-700 text-sm mt-2 truncate">
                        {item.recommand}
                      </p>
                      <div className="flex flex-col md:flex-row md:justify-between items-center mt-3 w-full space-y-2 md:space-y-0 md:space-x-5">
                        <div className="rating flex">
                          {[...Array(5)].map((_, index) => (
                            <input
                              key={index}
                              type="radio"
                              name={`rating-${item.id}`}
                              className="mask mask-star-2 bg-orange-400"
                              defaultChecked={index === item.rating - 1}
                            />
                          ))}
                        </div>
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                          {item.category_name}
                        </span>
                      </div>

                      <div className="flex justify-end space-x-2 mt-2  w-full items-center">
                        <Link to={`/edit/${item.id}`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-8 border border-1 shadow-md p-1 rounded-md"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </Link>

                        <div onClick={(e) => deleteBlog(e, item.id)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-8 text-red-600 border border-1 border-red-300 p-1 rounded-md"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.078L5.48 5.83A9.01 9.01 0 0 1 12 3a9 9 0 0 1 7.73 3.632"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                </Link>
              ))}
            </motion.div>
          ) : (
            <div className="mt-5 text-center text-gray-500">
              No blogs to display.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
