import { createBrowserRouter, Navigate } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
// import router from './router/index.jsx';
import { Home } from "../pages/Home.jsx";
import { Layout } from "../layouts/Layout.jsx";
import { Search } from "../pages/Search.jsx";
import { BlogDetail } from "../components/BlogDetail.jsx";
import{ProfileDetail} from "../components/ProfileDetail.jsx";
import { BlogForm } from "../pages/BlogForm.jsx";
import { RegisterForm } from "../pages/Register.jsx";
import { LoginForm } from "../pages/Login.jsx";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { Profile } from "../pages/Profile.jsx";

export default function index() {
  let { authReady, user } = useContext(AuthContext);

  const authenticated = Boolean(user);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: authenticated ? <Home /> : <Navigate to="/login" />,
        },
        {
          path: "/blogs/:id",
          element: authenticated ? <BlogDetail /> : <Navigate to="/login" />,
        },
        {
          path: "/create",
          element: authenticated ? <BlogForm /> : <Navigate to="/login" />,
        },
        {
          path: "/edit/:id",
          element: authenticated ? <BlogForm /> : <Navigate to="/login" />,
        },
        
        {
          path: "/profile",
          element: authenticated ? <Profile /> : <Navigate to="/login" />,
        },
        {
          path: "/register",
          element: !authenticated ? <RegisterForm /> : <Navigate to="/" />,
        },
        {
          path: "/login",
        element:<LoginForm /> ,
        },
        {
          path:"/profile/:id",
          element:<ProfileDetail/>
        }
      ],
    },
  ]);
  return authReady && <RouterProvider router={router} />;
}
