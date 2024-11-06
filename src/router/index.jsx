import { createBrowserRouter, Navigate } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
// import router from './router/index.jsx';
import { Home } from "../pages/Home.jsx";
import { Layout } from "../layouts/Layout.jsx";
import { Search } from "../pages/Search.jsx";
import { BlogDetail } from "../components/BlogDetail.jsx";
import { BlogForm } from "../pages/BlogForm.jsx";
import { RegisterForm } from "../pages/register.jsx";
import { LoginForm } from "../pages/Login.jsx";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

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
          path: "/search",
          element: <Search />,
        },
        {
          path: "/register",
          element: !authenticated ? <RegisterForm /> : <Navigate to="/" />,
        },
        {
          path: "/login",
        element:!authenticated ? <LoginForm /> : <Navigate to="/" />,
        },
      ],
    },
  ]);
  return authReady && <RouterProvider router={router} />;
}
