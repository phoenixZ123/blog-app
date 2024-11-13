import React, { useState } from "react";
import "../pages/index.css";
import { useSignUp } from "../hooks/useSignUp";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Import Firestore methods
import { auth } from "../firebase";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { error, loading, signUp } = useSignUp(); // Destructure properly from the hook
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Navigate hook for redirection
  const db = getFirestore(); // Initialize Firestore

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
// let {user}=auth();
  // Handle form submission
  const signupForm = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      const { email, password, username } = formData;

      try {
        // Sign up the user using the signUp hook (this assumes the hook handles Firebase Auth)
         signUp(username, email, password);

        // Create a new user object to save to Firestore
        const newUser = {
          username,
          email,
          password,
          // uid:user.uid
        };

        const ref = collection(db, "users");
        await addDoc(ref, newUser); // This adds the user data to Firestore

        navigate("/login");
      } catch (error) {
        console.error("Error signing up or saving user data:", error);
      }
    }
    

  };

  return (
    <div className="h-screen">
      <div className="register-container">
        <h2 className="register-title">Create Account</h2>
        <form onSubmit={signupForm} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "input-error" : ""}
              placeholder="Enter Your Username"
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
              placeholder="Enter Your Email"
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
              placeholder="Enter Your Password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="hover:bg-primary register-button flex justify-center items-center gap-3"
          >
            <div>Sign Up</div>
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4" 
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
