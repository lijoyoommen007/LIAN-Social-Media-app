import React, { useEffect } from 'react'
import "./rightBar.scss"
import pic from "../../assets/tp-best-mens-hairstyles.jpg"
import axios from 'axios'
import { baseUrl, makeRequest } from '../../axios'
import { useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import {io} from "socket.io-client"
import RightBarOnline from '../messenger/RightBarOnline'

function RightBar() {
  const queryClient = useQueryClient();
  const {currentUser, updateCurrentUser} = useContext(AuthContext)
  const [allUsers, setAllUsers] = useState([])
  const socket = useRef()
  const [onlineUsers,setOnlineUsers] = useState(null)

  useEffect(()=>{
    const getAllUsers = (async()=>{
      makeRequest.get(`users/`).then((users)=>{
        setAllUsers(users.data)
      },[])
    })
    getAllUsers()
  },[])

  const { isLoading, error, data } = useQuery(["rightpost"], () =>
    makeRequest.get(`users/`).then((res) => {
    setAllUsers(res.data)  
    return res.data;
  })
);

useEffect(()=>{
  socket.current = io('https://socket.liansocialmedia.ml');
  socket.current.emit("addUser",currentUser._id);
  socket.current.on("getUsers", (users)=>{
      console.log(users);
      setOnlineUsers(
          currentUser.following.filter((f) => users.some((u) => u.userId === f))
        );
  })
},[currentUser])



  const follow =(userId)=>{
    makeRequest.put(`users/${userId}/follow`,{ userId :currentUser._id})
    queryClient.invalidateQueries(["rightpost"]);
    queryClient.invalidateQueries(["user"]);
    updateCurrentUser()
  }


  


  return (
    <div className='rightBar'>    
      <div className="container">
        <div className="item">
          <span>Suggestion For you</span>
          {allUsers.map(user=>(
          currentUser.username!=user.username &&  !user.followers.includes(currentUser._id) && <div className="user">
            <div className="userInfo" key = {user._id} >
              <Link
              to={`/profile/${user._id}`}>
              <img src={user.profilePicture || pic} />
              </Link>
              <Link to={`/profile/${user._id}`}>
              <span>{user.username}</span>
              </Link>
            </div>
            <div className="buttons">
           { !user.followers.includes(currentUser._id)?
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded' onClick={()=>follow(user._id)} >follow</button>:
              <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-1 rounded' >dismiss</button>}
            </div>
          </div>
          ))}

        </div>
        
        <div className="item">
          <span>Online Friends</span>
          <RightBarOnline 
          onlinUsers={onlineUsers} 
          currentId={currentUser._id}
          />
          
        </div>
      </div>
    </div>
  )
}

export default RightBar