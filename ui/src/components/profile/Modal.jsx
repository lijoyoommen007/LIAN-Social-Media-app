import { useQueryClient } from "@tanstack/react-query";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Modal.css";
import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"


function Modal({ setOpenModal , allUsers , users, followings }) {
    const queryClient = useQueryClient();
    const {currentUser} = useContext(AuthContext)

    const modalHandler = ()=>{
        setOpenModal(false)
        queryClient.invalidateQueries(["user"])
        window.location.reload(false);

    }

  return (
    <div className="modalBackground" onClick={() => {
        setOpenModal(false);
      }}>
      <div className="modalContainer animate-slideleft">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
            {followings?
          <h1>People {users.username} Follows</h1>
            : <h1>People Following {users.username} </h1> }
        </div>
        <div className="body overflow-x-auto">
          

        {followings?allUsers.map(user=>(
            user.followers.includes(users._id) && <div className="user">
            <div className="userInfo flex items-center mt-5 hover:bg-gray-300 rounded-full" key = {user._id}  onClick={()=>modalHandler()} >
              <Link
              to={`/profile/${user._id}`}>
              <img className="rounded-full w-20 h-20 object-cover" src={user.profilePicture || altImg } />
              </Link>
              <Link to={`/profile/${user._id}`}>
              <span className="font-bold ml-10 text-xl hover:from-stone-300">{user.username}</span>
              </Link>
            </div>
            
          </div>
          )):
          allUsers.map(user=>(
            user.following.includes(users._id) && <div className="user">
            <div className="userInfo flex items-center mt-5 hover:bg-gray-300 rounded-full" key = {user._id}  onClick={()=>modalHandler()} >
              <Link
              to={`/profile/${user._id}`}>
              <img className="rounded-full w-20 h-20 object-cover" src={user.profilePicture || altImg } />
              </Link>
              <Link to={`/profile/${user._id}`}>
              <span className="font-bold ml-10 text-xl hover:from-stone-300">{user.username}</span>
              </Link>
            </div>
            
          </div>
          ))
          
          
          
          }



        </div>
        <div className="footer">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
            id="cancelBtn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
