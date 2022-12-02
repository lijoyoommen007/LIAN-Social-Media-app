import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from '../axios';
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user"))||null);
  // if (JSON.parse(localStorage.getItem("user")) !== undefined) {
  //   setCurrentUser(JSON.parse(localStorage.getItem("user")))
  // }
  const login = async(details) => {
    //TO DO
    const res = await axios.post(`/auth/login`,details,{withCredentials: true}) 
    setCurrentUser(res.data.user)
    console.log(res.data.user)
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  const updateCurrentUser=()=>{
    axios.get(`/users/${currentUser._id}`).then(({data})=>{
        localStorage.setItem('user', JSON.stringify(data))
        setCurrentUser(data)
    }).catch((error)=>console.log(error))
}

  return (
    <AuthContext.Provider value={{ currentUser,setCurrentUser, login, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};