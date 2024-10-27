import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home.jsx";
import { Create } from "../pages/Create.jsx";
import { Layout } from "../layouts/Layout.jsx";
import { Search } from "../pages/Search.jsx";
import { BlogDetail } from "../components/BlogDetail.jsx";

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
        path: "/blog/:id",
        element: <BlogDetail />,
      },
      {
        path: "/create",
        element: <Create />,
      },
      {
        path: "/search",
        element: <Search />,
      },
    ],
  },
]);

export default router;
