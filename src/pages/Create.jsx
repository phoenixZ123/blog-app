import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
// import { Alert } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export const Create = () => {
  const [activity, setActivity] = useState("");
  const [recommand, setRecommand] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState("");
  let { data:category,loading,error } = useFetch("http://localhost:3000/category");

  let {setPostData,data:blog}=useFetch("http://localhost:3000/blog","POST");
  let navigate=useNavigate();
  const addBlog=(e)=>{
e.preventDefault();
let newBlogData={
  id:"a"+Math.floor(Math.random()* 99999),
  title:activity,
  recommand,
  rating,
  category_name:selectedCategory,
  date,
};
setPostData(newBlogData);

  }

useEffect(()=>{
  if(blog){
navigate("/");
  }
},[blog]);
  return (
    <>
      {error && <p>{error}</p>}
      {loading && <p>Loading ...</p>}
      <div className="h-screen">

        <form className="w-full max-w-lg mx-auto mt-5" onSubmit={addBlog}>
    {/* <Alert color="green">A success alert for showing message.</Alert> */}

          <div className="flex flex-wrap -mx-3 mb-6 ">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Activity Title            
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Enter your activity name"
                value={activity}
                onChange={e=> setActivity(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Recommand for this activity
              </label>
              <textarea
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-password"
                type="text"
                placeholder="Leave a recommand here"
                value={recommand}
                onChange={e=> setRecommand(e.target.value)}
              />
              <p className="text-gray-600 text-xs italic">
                Share your experience and explain how to gain experience like
                yours.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Rating
              </label>
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(index + 1)}
                    className={`text-3xl ${
                      rating > index ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Activity Type
              </label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {category &&
                    category.map((item) => (
                      <option key={item.id} value={item.category_name}>
                        {item.category_name}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>  
              </div>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block text-sm font-medium text-gray-700">
                Select a date:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e)=> setDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Upload an image:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};
