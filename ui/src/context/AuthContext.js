import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, makeRequest } from '../axios';
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user"))||null);
  // if (JSON.parse(localStorage.getItem("user")) !== undefined) {
  //   setCurrentUser(JSON.parse(localStorage.getItem("user")))
  // }
  const login = async(details) => {
    //TO DO
    console.log(details);
    makeRequest.post(`/auth/login`,details,{withCredentials: true}).then((res)=>{
      setCurrentUser(res.data.user)
      console.log(res.data.user) 
    }) 
  };

  useEffect(() => {
    if(currentUser != undefined){
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const updateCurrentUser=()=>{
    makeRequest.get(`/users/${currentUser._id}`).then(({data})=>{
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