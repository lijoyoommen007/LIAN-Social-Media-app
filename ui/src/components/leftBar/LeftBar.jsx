import React, { useContext, useEffect, useState } from 'react'
import "./leftBar.scss"
import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { baseUrl, makeRequest } from '../../axios'
import  Modal  from '../profile/Modal';

function LeftBar() {
  const [followersModel, setFollowersModel] = useState(false)
  const [modal, setModal]=useState(false)
  const [allUsers,setAllUsers]=useState(null)
  const {currentUser} = useContext(AuthContext)
  const[user,setUser]=useState('')

  useEffect(()=>{
    const fetchuser = async()=>{
      const user = await makeRequest.get(`users/${currentUser._id}`)
      setUser(user.data)
    }
     fetchuser()
  },[])


  useEffect(()=>{
    const getAllUsers = (async()=>{
      makeRequest.get(`users/`).then((users)=>{
        setAllUsers(users.data)
      },[])
    })
    getAllUsers()
  },[])



  return (
    <div className='leftTopBar '>
      <div className='container'>
        <Link to={`/profile/${user._id}`}>
        <div className="user">
            <img src={user.profilePicture||altImg} alt="" /> 
            <h1>{user?.username}</h1>
        </div>
        </Link>
        <div className="about">
        <div className='followers cursor-pointer' onClick={()=>{setFollowersModel(true)}} >
            <span>Followers</span>
            <h1> {user?.followers?.length} </h1>
          </div>

          
         
          <div className='followings cursor-pointer' onClick={()=>{setModal(true)}}>
            <span>Followings</span>
            <h1>{user?.following?.length}</h1>
          </div>
        </div>
      </div>
      {modal && <Modal followings allUsers={allUsers} users={user} setOpenModal = {setModal} />}
      {followersModel && <Modal allUsers={allUsers} users={user} setOpenModal = {setFollowersModel}/>}
    </div>
    
  )
}

export default LeftBar