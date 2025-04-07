import { createContext, useState } from "react";

export const AppContext  = createContext()

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(false);

  const value = {
    backendUrl,
    isLoggedIn, setIsLoggedIn,
    userInfo, setUserInfo
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
      </AppContext.Provider>
  )
}