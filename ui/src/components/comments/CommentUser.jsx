import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { baseUrl, makeRequest } from '../../axios'

  function CommentUser(props) {
  const[user,setUser]=useState('')

   useEffect(()=>{
    const getUser = async()=>{
      const res = await makeRequest.get(`/users/${props.id}`)
      setUser(res.data.username)
    }
    getUser()
   },[])
  return (
    <div>
      <span>{user}</span>
    </div>
  )
}


  function ProfileUser(props) {
  const[pic,setPic]=useState('')

   useEffect(()=>{
    const getUser = async()=>{
      const res = await makeRequest.get(`users/${props.id}`)
      setPic(res.data.profilePicture)
    }
    getUser()
   },[])
    return <img src={pic || altImg } alt="" />
}

 
export {ProfileUser,CommentUser}