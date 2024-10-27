import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";

export const BlogDetail = () => {
  let { id } = useParams();
  const [rating, setRating] = useState(0); // Initialize rating state

  const { data: blog, loading, error } = useFetch(`http://localhost:3000/blog/${id}`);

  useEffect(() => {
    if (blog) setRating(blog.rating);
  }, [blog]);

  return (
    <div className="h-screen">
      {error && <p>{error}</p>}
      {loading && <p>Loading ...</p>}
      {blog && (
        <div className="grid md:grid-cols-2 grid-cols-1 md:mt-10" key={blog.id}>
          <div className="md:mt-3 text-wrap text-lg p-2">
            <p>{blog.category_name}</p>
            <p className="p-2 m-2 text-2xl text-center font-semibold">
              {blog.title}
            </p>
            <p className="indent-8 mt-3">{blog.recommend}</p>
            <div className="flex justify-between">
              <div className="rating mt-5 space-x-2 w-full flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <label htmlFor={`rating-${blog.id}`} className="mr-2">
                    Rating:
                  </label>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <input
                        key={index}
                        type="radio"
                        name={`rating-${blog.id}`}
                        className="mask mask-star-2 bg-orange-400"
                        checked={index === rating - 1}
                        onChange={() => setRating(index + 1)}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-gray-500 text-sm">{blog.date}</div>
              </div>
            </div>
          </div>
          <div>
            <img src={blog.image} className="md:h-full" alt={`${blog.title} image`} />
          </div>
        </div>
      )}
    </div>
  );
};
