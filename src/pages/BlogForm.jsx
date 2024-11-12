import React, { useContext, useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../contexts/AuthContext";
// import { db, storage } from "../firebase"; // Ensure Firebase storage is configured
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const BlogForm = () => {
  let [activity, setActivity] = useState("");
  let [recommand, setRecommand] = useState("");
  let [rating, setRating] = useState(0);
  let [selectedCategory, setSelectedCategory] = useState("");
  let [date, setDate] = useState("");
  let [imageFile, setImageFile] = useState(null);
  let [error, setError] = useState("");
  let [loading, setLoading] = useState(false);
  let [isedit, setisEdit] = useState(false);
  let [category, setCategory] = useState("");
  let[preview,setPreview]=useState("");
  let { id } = useParams();
  // const {
  //   data: category,
  //   loading: categoryLoading,
  //   error: categoryError,
  // } = useFetch("http://localhost:3000/category");
  let navigate = useNavigate();

  // Handle image selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  let handlePreviewImage=(file)=>{
    let reader=new FileReader;
    reader.readAsDataURL(file);
    reader.onload=()=>{
      setPreview(reader.result);
    }
  }

  useEffect(()=>{
if(imageFile){
  handlePreviewImage(imageFile);
}
  },[imageFile]);


let {user}=useContext(AuthContext);
  let submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newBlogData = {
        title: activity,
        recommand,
        rating,
        date: date || new Date().toISOString(),
        category_name: selectedCategory,
        uid:user.uid
      };

      console.log("New Blog Data:", newBlogData);

      if (isedit) {
        let ref=doc(db,"blogs",id);
        await updateDoc(ref,newBlogData);
      } else {
        const ref = collection(db, "blogs");
        await addDoc(ref, newBlogData);
      }
      navigate("/");
    } catch (error) {
      console.error("Error adding blog:", error);
      setError("Failed to add blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const ref = collection(db, "category");
        const docs = await getDocs(ref);

        if (docs.empty) {
          setError("No category found.");
        } else {
          const categoryArray = docs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCategory(categoryArray);
          setError("");
        }
      } catch (err) {
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    const fetchBlogData = async () => {
      if (id) {
        try {
          setisEdit(true);
          const blogRef = doc(db, "blogs", id);
          const docOne = await getDoc(blogRef);

          if (docOne.exists()) {
            const { title, recommand, rating, category_name, date } =
              docOne.data();
            setActivity(title);
            setRecommand(recommand);
            setRating(rating);
            setSelectedCategory(category_name);
            setDate(date);
          } else {
            setError("Blog not found.");
          }
        } catch (error) {
          setError("Failed to load blog data.");
        }
      } else {
        setActivity("");
        setRecommand("");
        setRating(0);
        setSelectedCategory("");
        setDate("");
      }
    };
    fetchBlogData();
    fetchCategory();
  }, [id]);

  return (
    <>
      {/* {categoryError && <p>{categoryError} To Category</p>} */}
      {/* {loading && <p>Loading...</p>} */}
      <div className="h-screen overflow-y-auto">
        <form className="w-full  max-w-lg mx-auto mt-5" onSubmit={submitForm}>
          <div className="flex flex-wrap -mx-3 mb-6 ">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Activity Title
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                placeholder="Enter your activity name"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Recommendation for this activity
              </label>
              <textarea
                className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                placeholder="Leave a recommendation here"
                value={recommand}
                onChange={(e) => setRecommand(e.target.value)}
              />
              <p className="text-gray-600 text-xs italic">
                Share your experience and tips for others.
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
                  className="block appearance-none w-full bg-gray-200 border text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white"
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
              </div>
            </div>
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block text-sm font-medium text-gray-700">
                Select a date:
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="w-full md:w-2/3 px-3 mb-6 md:mb-0 ">
              <label className="block text-sm font-medium text-gray-700 mt-4">
                Upload an image:
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500"
              />
              {preview ? <img src={preview} alt="" className="h-32 p-1"/> : ""}
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            {isedit ? "Update Blog" : "Save Blog"}
          </button>
          {error && <p className="text-red-500 text-xs italic mt-3">{error}</p>}
        </form>
      </div>
    </>
  );
};
