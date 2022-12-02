import LeftBar from "../../components/leftBar/LeftBar"
import NavBar from "../../components/navBar/NavBar"
import "../../style.scss"
import { MusicPlayer } from "../../music player/components"
import "./home.scss"
import RightBar from "../../components/rightBar/RightBar"
import LeftBottomBar from "../../components/leftBar/LeftBottomBar"
import { useContext, useEffect, useState } from "react"
import { DarkModeContext } from "../../context/darkModeContext"
import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import { useSelector } from 'react-redux';
import UserPost from "../../components/userpost/UserPost"
import {io} from "socket.io-client"
import { AuthContext } from "../../context/AuthContext"

function Home() {

  const {darkMode} = useContext(DarkModeContext)
  const { activeSong } = useSelector((state) => state.player);
  const {currentUser} = useContext(AuthContext)
  const [socket, setSocket] = useState(null)
  useEffect(()=>{
    setSocket(io("http://localhost:8900"))
  },[])

  useEffect(()=>{
    socket?.emit("addUser", currentUser._id)
  },[socket, currentUser])


  return (
    <div className={`theme-${darkMode? "dark":"light"} animate-slideleft`}>
      <div className="themesbg">
      <NavBar/>
      <div style={{display:"flex"}} >
        <div>
            <LeftBar/>
            <LeftBottomBar/>
        </div>
        <div style={{flex:6}} className="home" >
          {/* <Stories/> */}
          <UserPost/>
          <Posts socket={socket} />
        </div>
        <RightBar socket={socket} />
      </div>
      </div>
      {activeSong?.title && (
        <div className="sticky h-28 bottom-0 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-t-3xl z-10">
          <MusicPlayer />
        </div>
      )}
    </div>
  )
}

export default Home