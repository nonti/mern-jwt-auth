import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Flip, toast } from "react-toastify";

export const AppContext  = createContext()

export const AppContextProvider = (props) => {

  axios.defaults.withCredentials = true;
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const getAuthState = async () => {
    try {
      const {data} = await axios.post(backendUrl + 'api/auth/is-auth')
      if(data.success){
        setIsLoggedIn(true);
        getUserInfo()
      }
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Flip
      })
    }
  }

  useEffect(() => {
    getAuthState();
  },[])

  const getUserInfo = async () => {
    try {
      const {data} = await axios.get(backendUrl + 'api/user/info');
      data.success ? setUserInfo(data.userInfo) : toast.error(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: {Flip}
      })
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: {Flip}
      })
    }
  }

  const value = {
    backendUrl,
    isLoggedIn, setIsLoggedIn,
    userInfo, setUserInfo,
    getUserInfo
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
      </AppContext.Provider>
  )
}