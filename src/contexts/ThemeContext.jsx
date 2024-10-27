import React, { createContext } from 'react'

export const Themecontext=createContext();


export default function ThemeContextProvider({children}) {
  return (
    <Themecontext.Provider value={{theme:"dark"}}>
        {children}
    </Themecontext.Provider>
  )
}
