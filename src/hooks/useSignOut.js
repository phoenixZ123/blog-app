import {  signOut } from "firebase/auth";
import { auth } from "../firebase"; // Ensure `auth` is properly exported from firebase.js
import { useState } from "react";

export const useSignOut = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const logOut = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await signOut(auth);
      setLoading(false);
      setError("");
      return res.user;
    } catch (err) {
      console.error("Error signing in:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  return { error, loading, logOut };
};
