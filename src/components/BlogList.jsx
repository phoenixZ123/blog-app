import React, { useEffect, useState } from "react";
import bagan from "../assets/bagan.jpg";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
export const BlogList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";
  const [error, setError] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const ref = collection(db, "blogs");
        let q = query(ref, orderBy("date", "desc"));
        const docs = await getDocs(q);

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
        });
      } catch (err) {
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // Filter blogs based on search query
  const filteredData = blogs.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category_name.toLowerCase().includes(search.toLowerCase()) ||
      item.recommand.toLowerCase().includes(search.toLowerCase())
  );

  let deleteBlog = async (e, id) => {
    e.preventDefault();
    let ref = doc(db, "blogs", id);
    await deleteDoc(ref);
    //no need when use onSnapShot realtime method
    // setBlogs((prev) => prev.filter((b) => b.id !== id));
  };
  return (
    <div className="p-4 ">
      {loading && <p>Loading ...</p>}
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
                    // textShadow: "0px 0px 5px rgb(255,255,255)",
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
                    <img src={bagan} alt="Blog" className="w-full rounded-md" />
                    <p className="text-gray-700 text-sm mt-2 ">
                      {item.recommand}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="rating">
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
                    <div className="flex justify-end space-x-2 mt-2  w-full items-center ">
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
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
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
        <p className="text-center text-gray-500 text-xl">
          No blogs match your search criteria.
        </p>
      )}
    </div>
  );
};
