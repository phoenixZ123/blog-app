import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home.jsx";
import { Layout } from "../layouts/Layout.jsx";
import { Search } from "../pages/Search.jsx";
import { BlogDetail } from "../components/BlogDetail.jsx";
import { BlogForm } from "../pages/BlogForm.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/blogs/:id",
        element: <BlogDetail />,
      },
      {
        path: "/create",
        element: <BlogForm />,
      },
      {
        path:"/edit/:id",
        element:<BlogForm/>
      },
      {
        path: "/search",
        element: <Search />,
      },
    ],
  },
]);

export default router;
