import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";

export const useSignUp = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const signUp = async (username, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(res.user, {
        displayName: username,
      });

      setLoading(false);
      setError("");
      return res.user;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { error, loading, signUp };
};
