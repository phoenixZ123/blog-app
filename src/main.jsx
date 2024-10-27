import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router/index.jsx';
import ThemeContextProvider from './contexts/ThemeContext.jsx';


createRoot(document.getElementById("root")).render(
  <ThemeContextProvider>
  <RouterProvider router={router} />
  </ThemeContextProvider>
);
