import React from "react";
import bagan from "../assets/bagan.jpg";
import { useFetch } from "../hooks/useFetch";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const BlogList = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const search = params.get("search") || "";

  const { data, loading, error } = useFetch(
    `http://localhost:3000/blog`
  );

  if (error) {
    return <p>{error}</p>;
  }

  // Client-side filtering based on the search term
  const filteredData = data?.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category_name.toLowerCase().includes(search.toLowerCase()) ||
    item.recommand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {loading && <p>Loading ...</p>}
      {!!filteredData && (
        <motion.div
         
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.5 }}
        >
          <div className="grid md:grid-cols-4 grid-cols-2 gap-2 my-3">
            {filteredData.map(item => (
              <Link to={`/blog/${item.id}`} key={item.id}>
                <motion.button 
                  whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgb(255,255,255)" }}
                >
                  <div className="p-2 rounded-lg shadow-md m-1">
                    <div className="flex justify-between items-center">
                      <div className="text-sm p-1">{item.title}</div>
                      <div className="text-gray-500 text-[14px]">{item.date}</div>
                    </div>
                    <img src={bagan} alt="Blog" />
                    <div className="text-wrap text-[12px] truncate indent-8 my-1">
                      {item.recommand}
                    </div>
                    <div className="flex justify-between items-center">
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
                      <div className="bg-blue-400 rounded-lg p-1 text-sm ">
                        {item.category_name}
                      </div>
                    </div>
                  </div>
                </motion.button>
              </Link>
            ))}
          </div>
          {!filteredData.length && <p className="text-center text-gray-500 text-xl">Search Results Not Found</p>}
        </motion.div>
      )}
    </>
  );
};
