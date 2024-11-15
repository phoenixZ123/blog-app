import React, { useState } from 'react';
import { FiLock } from "react-icons/fi"; 
import "../pages/index.css"; 
import { useSignIn } from '../hooks/useSignIn';
import { useNavigate } from 'react-router-dom';

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { error, loading, signIn } = useSignIn(); // Ensure correct destructuring
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await signIn(email, password); // Use email and password
    if (user) {
      console.log(user.uid);
      navigate("/");
      console.log("Email:", email, "Password:", password);
    }
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="login-container">
        <h2 className="login-title">Sign In</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button flex items-center gap-2">
            <FiLock className={`icon ${loading ? 'animate-spin' : ''}`} /> {/* Animated lock icon */}
            {loading ? "Signing In..." : "Sign In"}
          </button>
          {error && <p className="error-message text-red-600">{error}</p>}
        </form>
      </div>
    </div>
  );
};
