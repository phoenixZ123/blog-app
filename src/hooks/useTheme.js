import { useContext } from 'react';
import { Themecontext } from '../contexts/ThemeContext';

export default function useTheme() {
  const context = useContext(Themecontext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }

  return context;
}
