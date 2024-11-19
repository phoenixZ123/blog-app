import React, { useContext, useEffect, useState } from "react";
import bagan from "../assets/bagan.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const user = auth.currentUser;
  let navigate = useNavigate();
  let [followed, setFollowed] = useState(false);
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
        if (user.displayName === userName) {
          fetchFollowerData();
        }
        // fetchFollowerData();
        // fetchBlogsByUserEmail(userEmail);
        //
      }
    });
    //
    // followed
    const reff = collection(db, "follower");
    // Check if the follower relationship already exists
    onSnapshot(query(reff), (snapshot) => {
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
  };

  const filterUser = users.filter((item) =>
    item.username.toLowerCase().includes(userName.toLowerCase())
  );

  //   const fetchBlogs = () => {
  //     const ref = collection(db, "blogs");
  //     const q = query(ref, orderBy("date", "desc"));
  // // All Blogs
  //     onSnapshot(q, async (snapshot) => {
  //       if (snapshot.empty) {
  //         setError("No blogs found.");
  //         setBlogs([]);
  //       } else {
  //         const blogsArray = await Promise.all(
  //           snapshot.docs.map(async (doc) => {
  //             const blogData = doc.data();
  //             const blogEmail = blogData.email;

  //             // Fetch username from the users collection based on the blog's email
  //             const userRef = collection(db, "users");
  //             const userQuery = query(userRef, where("email", "==", blogEmail));
  //             const userSnapshot = await getDocs(userQuery);

  //             let username = "Unknown User";
  //             if (!userSnapshot.empty) {
  //               // username from users
  //               const userDoc = userSnapshot.docs[0].data();
  //               username = userDoc.username;
  //             }

  //             return {
  //               id: doc.id,
  //               ...blogData,
  //               username, // Add username to the blog object
  //             };
  //           })
  //         );
  //         setBlogs(blogsArray);
  //         setError("");
  //       }
  //       setLoading(false);
  //     });
  //   //  follower blog
  //   // const FollowerRef = collection(db, "follower");
  //   // const queryF = query(
  //   //   FollowerRef,
  //   //   where("follower_email", "==", user.email),
  //   //   orderBy("date", "desc")
  //   // );

  //   //   onSnapshot(queryF, async (userSnapshot) => {
  //   //     if (userSnapshot.empty) {
  //   //       setError("No blogs found.");
  //   //       setBlogs([]);
  //   //       return;
  //   //     }
  //   //     try {
  //   //       const blogsPromises = userSnapshot.docs.map(async (userDoc) => {
  //   //         const user_email = userDoc.data().user_email;

  //   //         const BlogRef = collection(db, "blogs");
  //   //         const BlogQuery = query(
  //   //           BlogRef,
  //   //           where("email", "==", user_email),
  //   //           orderBy("date", "desc")
  //   //         );

  //   //         const blogSnapshot = await getDocs(BlogQuery); // Use `getDocs` instead of `onSnapshot` for a one-time fetch
  //   //         if (blogSnapshot.empty) return [];

  //   //         return blogSnapshot.docs.map((blogDoc) => ({
  //   //           id: blogDoc.id,
  //   //           ...blogDoc.data(),
  //   //         }));
  //   //       });
  //   //       const allBlogs = (await Promise.all(blogsPromises)).flat(); // Flatten the results
  //   //       if (allBlogs.length === 0) {
  //   //         setError("No blogs found.");
  //   //         setBlogs([]);
  //   //       } else {
  //   //         setError(null);
  //   //         setBlogs(allBlogs);
  //   //       }
  //   //     } catch (error) {
  //   //       setError("Error fetching blogs.");
  //   //       console.error(error);
  //   //     }
  //   //   });

  //   };
  // test

  const fetchUserBlogs = () => {
    const blogsRef = collection(db, "blogs");
    const allBlogsQuery = query(blogsRef, orderBy("date", "desc"));

    onSnapshot(allBlogsQuery, async (snapshot) => {
      if (snapshot.empty) {
        setError("No blogs found.");
        setBlogs([]);
        return;
      }
      try {
        const blogsArray = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const blogData = doc.data();
            const blogEmail = blogData.email;

            // Fetch username for each blog
            const userRef = collection(db, "users");
            const userQuery = query(userRef, where("email", "==", blogEmail));
            const userSnapshot = await getDocs(userQuery);

            let username = "Unknown User";
            if (!userSnapshot.empty) {
              const userDoc = userSnapshot.docs[0].data();
              username = userDoc.username;
            }

            return {
              id: doc.id,
              ...blogData,
              username,
            };
          })
        );

        // If a specific username is searched, filter results by username
        if (userName) {
          const filteredBlogs = blogsArray.filter((blog) =>
            blog.username.toLowerCase().includes(userName.toLowerCase())
          );
          setBlogs(filteredBlogs.length > 0 ? filteredBlogs : []);
          // setError(filteredBlogs.length > 0 ? "" : "No blogs found for this user.");
          fetchUser();
        } else {
          setBlogs(blogsArray);
          setError("");
        }
      } catch (error) {
        setError("Error fetching blogs.");
        console.error(error);
      }
    });

    // Fetch follower blogs if user is logged in
    if (user && user.email) {
      const followerRef = collection(db, "follower");
      const followerQuery = query(
        followerRef,
        where("follower_email", "==", user.email)
      );

      onSnapshot(followerQuery, async (followerSnapshot) => {
        if (followerSnapshot.empty) return;

        try {
          const followerBlogsPromises = followerSnapshot.docs.map(
            async (followerDoc) => {
              const user_email = followerDoc.data().user_email;

              const userBlogsQuery = query(
                blogsRef,
                where("email", "==", user_email),
                orderBy("date", "desc")
              );

              const blogSnapshot = await getDocs(userBlogsQuery);
              return blogSnapshot.docs.map((blogDoc) => ({
                id: blogDoc.id,
                ...blogDoc.data(),
              }));
            }
          );

          const followerBlogs = (
            await Promise.all(followerBlogsPromises)
          ).flat();
          setBlogs((prevBlogs) => [...prevBlogs, ...followerBlogs]);
        } catch (error) {
          console.error("Error fetching follower blogs:", error);
        }
      });
    }
    setLoading(false);
  };
  const fetAllBlogs = () => {
    //  fetch All Blogs
    const ref = collection(db, "blogs");
    const q = query(ref, orderBy("date", "desc"));
    onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setBlogs([]);
      } else {
        const BlogsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(BlogsData);
        setError("");
        navigate("/");
        setLoading(false);
      }
    });
  };
  const fetchFollowerData = () => {
    const ref = collection(db, "follower");
    const fquery = query(ref, where("follower_email", "==", user.email));

    onSnapshot(fquery, async (snapshot) => {
      if (snapshot.empty) {
        setError("Blogs not found because you haven't followed anyone.");
        setBlogs([]);
        setLoading(false);
        return;
      }

      // Get all followed users' emails
      const followData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const followedEmails = followData.map((data) => data.user_email);

      if (followedEmails.length === 0) {
        setError("No blogs found.");
        setBlogs([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch blogs for all followed emails
        const blogRef = collection(db, "blogs");
        const emailChunks = [];
        while (followedEmails.length) {
          emailChunks.push(followedEmails.splice(0, 10)); // Firestore 'in' supports max 10 items
        }

        const blogsArray = [];
        for (const chunk of emailChunks) {
          const q = query(
            blogRef,
            where("email", "in", chunk),
            orderBy("date", "desc")
          );
          const blogSnapshot = await getDocs(q);

          // Process each blog
          const blogPromises = blogSnapshot.docs.map(async (doc) => {
            const blogData = doc.data();
            const blogEmail = blogData.email;

            // Fetch username for the blog's email
            const userRef = collection(db, "users");
            const userQuery = query(userRef, where("email", "==", blogEmail));
            const userSnapshot = await getDocs(userQuery);

            let username = "Unknown User";
            if (!userSnapshot.empty) {
              const userDoc = userSnapshot.docs[0].data();
              username = userDoc.username;
            }

            return {
              id: doc.id,
              ...blogData,
              username, // Attach the username
            };
          });

          // Wait for all blogPromises to resolve
          const chunkBlogs = await Promise.all(blogPromises);
          blogsArray.push(...chunkBlogs);
        }

        setBlogs(blogsArray);
        setError(blogsArray.length > 0 ? "" : "No blogs found.");
        setLoading(false);
      } catch (error) {
        setError("Error fetching blogs.");
        console.error(error);
        setLoading(false);
      }
    });
  };

  const email = filterUser[0]?.email;
  useEffect(() => {
    // fetch Follower blogs
    if (userName) {
      fetchUser();
    } else {
      fetchFollowerData();
      // setBlogs([]);
    }
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    setError("");
  }, [userName, user, email,followed]);

  
  const handleFollow = (e) => {
    e.preventDefault();
    //
    const ref = collection(db, "follower");
    if (followed) {
      // Unfollow logic
      const followerQuery = query(ref, where("user_email", "==", email), where("follower_email", "==", user.email));
    
      getDocs(followerQuery)
        .then((snapshot) => {
          if (!snapshot.empty) {
            snapshot.docs.forEach((doc) => {
              // Delete each matching document
              deleteDoc(doc.ref)
                .then(() => {
                  setFollowed(false); // Update state to reflect unfollowed status
                })
                .catch((error) => {
                  console.error("Error while unfollowing:", error);
                });
            });
          } else {
            console.log("No matching follower documents found.");
          }
        })
        .catch((error) => {
          console.error("Error fetching follower documents:", error);
        });
    } else {
      // Follow logic
      const email = filterUser[0]?.email; // Extract email from filterUser
      if (!email) {
        console.error("No email found to follow.");
        return;
      }
      // Check if already following
      const checkQuery = query(ref, where("user_email", "==", email), where("follower_email", "==", user.email));
    
      getDocs(checkQuery)
        .then((snapshot) => {
          if (snapshot.empty) {
            // Not following, add a new follower document
            const newFollower = {
              user_email: email,
              follower_email: user.email,
            };
    
            addDoc(ref, newFollower)
              .then(() => {
                setFollowed(true); // Update state to reflect followed status
              })
              .catch((error) => {
                console.error("Error adding follower:", error);
              });
          } else {
            console.log("Already following this user.");
          }
        })
        .catch((error) => {
          console.error("Error checking follower status:", error);
        });
    }
    // 
  };
  // console.log(followed);

  if (error) return <p className="text-center text-red-500">{error}</p>;

  const filteredData = blogs.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category_name.toLowerCase().includes(search.toLowerCase()) ||
      item.recommand.toLowerCase().includes(search.toLowerCase())
  );

  // const deleteBlog = async (e, id) => {
  //   e.preventDefault();
  //   try {
  //     await deleteDoc(doc(db, "blogs", id));
  //   } catch (err) {
  //     setError("Failed to delete blog.");
  //   }
  // };
  console.log(filteredData);
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
              >
                {followed ? (
                  <div>Followed</div>
                ) : (
                  <>
                    <div>Follow</div>
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
                    </svg>
                  </>
                )}
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