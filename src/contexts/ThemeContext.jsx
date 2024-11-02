import React, { createContext, useReducer } from 'react';

export const Themecontext = createContext();

// Reducer to handle theme changes
const ThemeReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

export const ThemeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ThemeReducer, {
    theme: "light",
  });

  const changeTheme = (newTheme) => {
    dispatch({ type: "CHANGE_THEME", payload: newTheme });
  };

  return (
    <Themecontext.Provider value={{ ...state, changeTheme }}>
      {children}
    </Themecontext.Provider>
  );
};
