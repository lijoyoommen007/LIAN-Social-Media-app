import React, { useContext, useEffect, useState } from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
import { useQuery } from '@tanstack/react-query';


import "./navBar.scss"
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/AuthContext';
import { makeRequest } from '../../axios';


function NavBar() {
  const [notifications, setNotifications] = useState([])
  const {currentUser} = useContext(AuthContext)
  const {toggle, darkMode} = useContext(DarkModeContext)
  const [count, setCount] = useState(0)
  const [searchWord, setSearchWord] = useState('')
  const [filteredData, setFilteredData] = useState([]);
  const [userData, setUserData] = useState('')


  const { isLoading, error, data } = useQuery(["notifications"], () => {
    return makeRequest.get(`/notifications/${currentUser._id}`)
      .then(({ data }) => {
        setNotifications(data)
        return data;
      }).catch((error) => console.log(error))
  }
  );

  useEffect(() => {
    notifications &&
      setCount(notifications.filter(e => e.isVisited === false).length)
  }, [notifications])

  useEffect(() => {
    makeRequest.get(`/users`)
      .then(({ data }) => setUserData(data))
      .catch((error) => console.log(error))
  }, [])
  const handleChange = async(e) => {
    const searchWord = e.target.value
    setSearchWord(searchWord)
    const newFilter =await userData.filter((value) => {
      return value.username.toLowerCase().includes(searchWord.toLowerCase())
    });
   newFilter && setFilteredData(newFilter);
  };

  return (
    <div className='navbar'>
      <div className='left'>
        <Link to='/' style={{textDecoration:"none"}}>
        <span>LIAN.IN</span>
        </Link>
        <HomeOutlinedIcon/>
        {darkMode ? <WbSunnyOutlinedIcon onClick={toggle} style={{cursor:"pointer"}} /> :<DarkModeOutlinedIcon style={{cursor:"pointer"}} onClick={toggle}  /> }
        <AppsOutlinedIcon/>
        <div className="search">
          <SearchOutlinedIcon/>
          <input type="text" id="search-navbar" value={searchWord} onChange={handleChange} placeholder="Find people..." />
          {searchWord && <div className='absolute bg-gray-300 md:w-4/12  rounded-2xl mt-56'>
             <ul >
              { filteredData.length >0?
                filteredData.map((user) => (
                    <Link to={`/profile/${user._id}`} onClick={()=> setSearchWord('')} key={user._id} className='flex flex-wrap gap-2 items-center p-3 hover:bg-gray-200 border-b border-gray-200'>
                    <img src={user?.profilePicture ? user.profilePicture : altImg} alt={user?.username} className="w-10 h-10 rounded-full object-cover" />
                     <p>{user?.username}</p> 
                     </Link>
                ))
                : 
                  <li className='p-3 hover:bg-gray-300 border-b rounded-b-lg border-gray-200'>No results found</li>
                }
                </ul>
            </div>}
        </div>
      </div>
      <div className='right'>
        <PersonOutlineOutlinedIcon/>
        <MailOutlineOutlinedIcon/>
        
        <Link to={'/notifications'}>
        <NotificationsOutlinedIcon/>{count > 0 && <span className='-ml-2 absolute px-1.5 py-0.5 bg-red-600 text-white rounded-full text-xs'> {count}</span>}<span className='md:hidden pl-3 text-white'>Notificatoins</span>
        </Link>
        
        <Link to={`/profile/${currentUser._id}`}>
        <div className="user">
           <img src={currentUser?.profilePicture || altImg} alt="lijoy" /> 
          <span>{currentUser?.username}</span>
        </div>
        </Link>
      </div>
    </div>
  )
}

export default NavBar