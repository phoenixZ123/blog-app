import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Ensure `auth` is properly exported from firebase.js
import { useState } from "react";

export const useSignIn = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("Successfully signed in:", res.user);
      setLoading(false);
      return res.user;
    } catch (err) {
      console.error("Error signing in:", err.message);
      setError(err.message);
      setLoading(false);
    }
  };

  return { error, loading, signIn };
};
