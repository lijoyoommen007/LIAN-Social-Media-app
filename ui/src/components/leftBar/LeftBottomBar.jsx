import React, { useContext } from 'react'
import "./leftBar.scss"
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import NewspaperOutlinedIcon from '@mui/icons-material/NewspaperOutlined';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Swal from "sweetalert2"

const LeftBottomBar = () => {

    const {currentUser} = useContext(AuthContext)
    const navigate = useNavigate()

    
    const handleLogout = () => {
      Swal.fire({
        title: 'Do you want to logout?',
       
        showCancelButton: true,
        confirmButtonText: 'Yes',
      
        customClass: {
          actions: 'my-actions',
          cancelButton: 'order-1 right-gap',
          confirmButton: 'order-2',
         
        }
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("user");
      
          window.location.replace('/login');
        } else if (result.isDenied) {
          
        }
      })
    }

  return (
    <div className='leftBottomBar'>
        <div className="container">
        <Link to={`/profile/${currentUser._id}`}>
            <div className="items">
                <PermIdentityOutlinedIcon className='icon'/>
                <span>Profile</span>
            </div>
            </Link>
            <Link to={`/messenger/`}>
            <div className='items'>
                <ChatBubbleOutlineOutlinedIcon className='icon'/>
                <span>Chats</span>
            </div>
            </Link>
            <div className='items'>
                <Link to={'/movies'}>
                <MovieCreationIcon className='icon'/>
                </Link>
                <Link to={'/movies'}>
                <span>Movies</span>
                </Link>
            </div>
            <div className='items'>
                <Link to={'/music'}> 
                <LibraryMusicOutlinedIcon className='icon'/>
                </Link>
                <Link to={'/music'}>
                <span>Music</span>
                </Link>
            </div>
            <div className='items' onClick={()=>{handleLogout()}} >
                <LogoutOutlinedIcon className='icon'/>
                <span>Logout</span>
            </div>
        </div>
    </div>
  )
}


export default LeftBottomBar