import React, { useContext, useEffect, useState } from "react";
import bagan from "../assets/bagan.jpg";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { db, auth } from "../firebase"; // Ensure auth is imported from Firebase
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { AuthContext } from "../contexts/AuthContext";
import { Alert, Button } from "@material-tailwind/react";

export const BlogList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";
  const userName = params.get("username") || "";
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  let [find, setFind] = useState([]);

  const fetchUser = () => {
    const ref = collection(db, "users");
    const q = query(ref, where("username", "==", userName));
    onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setError("No users found.");
        setUsers([]);
      } else {
        const userArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userArray);
        setError("");
        //
        const userEmail = userArray[0].email;
        fetchBlogsByUserEmail(userEmail);
        //
      }
    });
  };
  //
  const fetchBlogsByUserEmail = async (email) => {
    try {
      const blogsRef = collection(db, "blogs");
      const blogsQuery = query(blogsRef, where("email", "==", email));

      const blogsSnapshot = await getDocs(blogsQuery);
      const blogsArray = blogsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFind(blogsArray);
    } catch (err) {
      setError("Error fetching blogs by user email.");
    }
  };
  //

  const fetchBlogs = () => {
    const ref = collection(db, "blogs");
    const q = query(ref, orderBy("date", "desc"));

    onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        setError("No blogs found.");
        setBlogs([]);
      } else {
        const blogsArray = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const blogData = doc.data();
            const blogEmail = blogData.email;

            // Fetch username from the users collection based on the blog's email
            const userRef = collection(db, "users");
            const userQuery = query(userRef, where("email", "==", blogEmail));
            const userSnapshot = await getDocs(userQuery);

            let username = "Unknown User";
            if (!userSnapshot.empty) {
              // username from users
              const userDoc = userSnapshot.docs[0].data();
              username = userDoc.username;
            }

            return {
              id: doc.id,
              ...blogData,
              username, // Add username to the blog object
            };
          })
        );
        setBlogs(blogsArray);
        setError("");
      }
      setLoading(false);
    });
  };
  //     const blogsRef = collection(db, "blogs");
  //     let blogsQuery;

  //     if (userName) {
  //       // Fetch blogs by the specified username
  //       const userRef = collection(db, "users");
  //       const userQuery = query(userRef, where("username", "==", userName));
  //       const userSnapshot = getDocs(userQuery);

  //       if (userSnapshot.empty) {
  //         setError(`No blogs found for user: ${userName}`);
  //         setBlogs([]);
  //       } else {
  //         const userEmail = userSnapshot.docs[0].data().email;
  //         blogsQuery = query(
  //           blogsRef,
  //           where("email", "==", userEmail),
  //           orderBy("date", "desc")
  //         );
  //       }
  //     } else {
  //       // Fetch all blogs
  //       blogsQuery = query(blogsRef, orderBy("date", "desc"));
  //     }

  //     if (blogsQuery) {
  //       const snapshot = await getDocs(blogsQuery);
  //       if (snapshot.empty) {
  //         setError("No blogs found.");
  //         setBlogs([]);
  //       } else {
  //         const blogsArray = snapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }));
  //         setBlogs(blogsArray);
  //         setError("");
  //       }
  //     }
  //   } catch (err) {
  //     setError("Error fetching blogs.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const user = auth.currentUser;
  const filterUser = users.filter((item) =>
    item.username.toLowerCase().includes(userName.toLowerCase())
  );
  const email = filterUser[0]?.email;
  useEffect(() => {
    if (userName) {
      fetchUser();
    }
    const ref = collection(db, "follower");
    // Check if the follower relationship already exists
    onSnapshot(query(ref), (snapshot) => {
      if (snapshot.empty) {
        setError("No users found.");
        setUsers([]);
        setFollowed(false);
      } else {
        // Use `some` to check if there is a match, then set `setFollowed`
        const isFollowed = snapshot.docs.some(
          (doc) =>
            doc.data().user_email === email &&
            doc.data().follower_email === user.email
        );
        setFollowed(isFollowed);
      }
    });
    fetchBlogs();

    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }
    setError("");
  }, [userName,user,email]);

  
  let [followed, setFollowed] = useState(false);
  const handleFollow = async (e) => {
    e.preventDefault();
  
    // Extract the first email from filterUser, assuming it's an array of objects
    const email = filterUser[0]?.email;
  
    const newFollower = {
      user_email: email,
      follower_email: user.email,
    };
  
    const ref = collection(db, "follower");
  
    // Check if the follower relationship already exists
    onSnapshot(query(ref), (snapshot) => {
      if (snapshot.empty) {
        setError("No users found.");
        setUsers([]);
        setFollowed(false);
      } else {
        // Use `some` to check if there is a match, then set `setFollowed`
        const isFollowed = snapshot.docs.some(
          (doc) =>
            doc.data().user_email === email &&
            doc.data().follower_email === user.email
        );
        setFollowed(isFollowed);
      }
    });
  
    // Add the new follower if not already followed
    if (!isFollowed) {
      await addDoc(ref, newFollower);
    }
  };
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const filteredData = blogs.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category_name.toLowerCase().includes(search.toLowerCase()) ||
      item.recommand.toLowerCase().includes(search.toLowerCase())
  );
  
  const deleteBlog = async (e, id) => {
    e.preventDefault();
    try {
      await deleteDoc(doc(db, "blogs", id));
    } catch (err) {
      setError("Failed to delete blog.");
    }
  };
  
  
  return (
    <div className="p-4 overflow-y-auto">
      {loading && <p>Loading ...</p>}
      <ul className="flex justify-center mt-3">
        {userName &&
          filterUser.map((user) => (
            <li
              key={user.id}
              className="md:max-w-3xl p-3  rounded-lg shadow-lg border border-gray-200 m-2"
            >
              <button
                onClick={handleFollow}
                className="hover:text-primary active:text-white flex justify-center items-center p-1 hover:bg-indigo-400 rounded-md text-white bg-indigo-500"
              >{followed ? <div>Followed</div> : <><div>Follow</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 mt-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg></>}
                
              </button>
              <div className="text-center mb-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-blue-200 flex items-center justify-center text-4xl text-blue-700 font-bold uppercase">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <div className=" text-xl font-semibold text-gray-800">
                  <div>{user.username} </div>
                </div>
                <p className="text-gray-500 mt-2 mb-4">Contact: {user.email}</p>
                <p className="text-gray-600">
                  Welcome to {user.username}'s profile! Explore blogs by this
                  user below.
                </p>
              </div>
              <div className="flex justify-center items-center">
                {" "}
                {find &&
                  find.map((data) => (
                    <ul key={data.id}>
                      <li className="flex justify-center items-center bg-primary text-white opacity-[0.8] p-2 w-32 text-wrap m-2 rounded-lg">
                        {data.category_name}
                      </li>
                    </ul>
                  ))}{" "}
              </div>
            </li>
          ))}
      </ul>
      {!!filteredData.length ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="grid md:grid-cols-4 grid-cols-2 gap-4 my-3">
            {filteredData.map((item) => (
              <Link to={`/blogs/${item.id}`} key={item.id}>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  className="w-full"
                >
                  <div className="p-2 rounded-lg shadow-md border border-1 m-1">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-lg font-semibold">{item.title} </div>

                      <span className="text-gray-500 text-sm">
                        {item.date
                          ? new Date(item.date).toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>
                    <div>Author: {item.username}</div>
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
                    <div className="flex justify-end space-x-2 mt-2 w-full items-center">
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
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.021-2.09 2.201v.916m7.5 0a48.268 48.268 0 0 0-7.5 0"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </Link>
            ))}
          </div>
        </motion.div>
      ) : (
        <p>No blogs found.</p>
      )}
    </div>
  );
};
