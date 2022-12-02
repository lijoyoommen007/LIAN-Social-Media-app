import "./conversation.css"
import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
import { useEffect, useState } from "react"
import { makeRequest } from "../../axios";

export default function Conversation({conversation,currentUser,bg}) {
  const [user,setUser] = useState(null)

  useEffect(()=>{
    const friendId = conversation.members.find((m)=> m !== currentUser._id);

    const getUser = async () =>{
      try{
        const res = await makeRequest.get("/users/"+friendId)
        setUser(res.data)
      }catch(err){
        console.log(err);
      }
    };
    getUser()
  },[currentUser, conversation]);




  return (
    <div className={bg?`bg-gray-300 rounded-2xl conversation`:`conversation`}>
        <img className="conversationImg " src={user?.profilePicture ||altImg} alt="" />
        <span className="conversationName">{user?.username}</span>
    </div>
  )
}
