import { createRoot } from "react-dom/client";
// import { RouterProvider } from 'react-router-dom';
// import router from './router/index.jsx';
import { ThemeContextProvider } from "./contexts/ThemeContext.jsx";
import AuthContextProvider from "./contexts/AuthContext.jsx";
import Router from "./router";

createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <ThemeContextProvider>
      {/* <RouterProvider router={router} /> */}
      <Router />
    </ThemeContextProvider>
  </AuthContextProvider>
);
