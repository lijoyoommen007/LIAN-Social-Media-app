import React, { useContext, useEffect, useState } from 'react'
import "./profile.scss"
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from '../posts/Posts';
import UserPost from '../userpost/UserPost';
import { baseUrl, makeRequest } from '../../axios';
import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
import {Link, useLocation, useParams } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AuthContext } from '../../context/AuthContext';
import Update from '../updates/Update';
import  Modal  from './Modal';



const  Profile = () => {
  const [followersModel,setFollowersModel] = useState(false)
  const [allUsers, setAllUsers] = useState(null)
  const [openUpdate, setOpenUpdate] = useState(false);
  const {currentUser ,updateCurrentUser} = useContext(AuthContext)
  const [showModal, setShowModal] = useState(false);

  


  useEffect(()=>{
    const getAllUsers = (async()=>{
      makeRequest.get(`users/`).then((users)=>{
        setAllUsers(users.data)
      },[])
    })
    getAllUsers()
  },[])
  
  const userId = useLocation().pathname.split("/")[2]
  const { isLoading, error, data } = useQuery(["user"], () =>
    makeRequest.get(`/users/`+userId).then((res) => {
      console.log(res.data);
      
      return res.data;
    })
  ); 
  const queryClient = useQueryClient();


  async function unfollow(){
    await makeRequest.put(`users/${userId}/unfollow`,{ userId :currentUser._id});
    queryClient.invalidateQueries(["user"]);
    updateCurrentUser()
  }
  async  function follow(){
    await makeRequest.put(`users/${userId}/follow`,{ userId :currentUser._id});
    queryClient.invalidateQueries(["user"]);
    updateCurrentUser()
  }



  return (
    <div className='profile'>
      <div className='images'>
        <img src={data?.coverPicture || "https://i.pinimg.com/originals/b8/97/b8/b897b8aed844660feab269d00ff35bf3.jpg"} className='cover' alt="" />
        <img src={data?.profilePicture || altImg } className='profilePic' alt="" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
          <div className='followers cursor-pointer' onClick={()=>{setFollowersModel(true)}}>
            <span>Followers</span>
            <h1>{data?.followers.length}</h1>
            
          </div>
          
          <div onClick={() => {setShowModal(true)}} className='followers cursor-pointer' >
            <span>Followings</span>
            <h1> {data?.following.length} </h1>
          </div>

          {showModal && <Modal followings allUsers={allUsers} users={data} setOpenModal={setShowModal}/>}
          {followersModel && <Modal allUsers={allUsers} users={data} setOpenModal = {setFollowersModel}/>}

        



          </div>
          <div className="center">
          <h1>{data?.username}</h1>
            <div className='info'>
              <div className="item">
                <span>{data?.desc}</span>
              </div>
            </div>
            {userId == currentUser?._id?<button className='font-bold' onClick={() => setOpenUpdate(true)}>Edit</button>:
            data?.followers.includes(currentUser._id)?<button onClick={unfollow}>following</button>:<button onClick={follow}>follow</button>}
              
          </div>
           
          <div className="right">
            <MailOutlineOutlinedIcon/>
            <MoreVertIcon/>
          </div>

        </div>
        <UserPost/>
        <Posts id={userId}/>
      </div>
      {openUpdate && <Update  setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  )
}

export default Profile 