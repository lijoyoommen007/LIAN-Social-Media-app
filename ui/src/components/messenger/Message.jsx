import "./message.css"
import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
import moment from "moment"
import { useEffect } from "react";
import { useState } from "react";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "@mui/material";

export default function Message({messages,own}) {
  const [user,setUser]=useState(null)
  const {currentUser} = useContext(AuthContext)
  useEffect(()=>{

    const getUser = async () =>{
      try{
        const res = await makeRequest.get("/users/"+messages.sender)
        setUser(res.data)
      }catch(err){
        console.log(err);
      }
    };
    getUser()
  },[currentUser]);


  return (
    <div className={own?"message own":"message"}>
        <div className="messageTop">
            <img className="messageImg" src={own?currentUser?.profilePicture || altImg : user?.profilePicture || altImg} alt="" />
            <p className="messageText"> {messages?.text} </p>
        </div>
        <div className="messageBottom"> {moment(messages?.createdAt).fromNow()} </div>
    </div>
  )
}
