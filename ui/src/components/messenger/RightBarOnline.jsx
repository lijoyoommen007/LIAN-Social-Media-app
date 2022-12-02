import "./chatOnline.css"
import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
import { useState } from "react"
import { useEffect } from "react"
import { makeRequest } from "../../axios"
import { Link } from "react-router-dom"

export default function RightBarOnline({ onlinUsers: onlineUsers, currentId,  }) {

  console.log(onlineUsers);
  const [friends, setFriends] = useState([])
  const [onlineFriends, setOnlineFriends] = useState([])

  useEffect(() => {
    const getFriends = async () => {
      const res = await makeRequest.get("/users/friends/" + currentId)
      setFriends(res.data)
    }
    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter(f => onlineUsers?.includes(f._id)))
  }, [friends, onlineUsers])



  return (
    <div className="chatOnline mt-1">
      {onlineFriends.map((o) => (  
        <Link to={'/messenger'}>
        <div className="chatOnlineFriend">
          <div className="chatOnlineImgContainer">
            <img src={o.profilePicture || altImg} alt="" className="chatOnlineImg" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName ml-3">{o.username}</span>
        </div>
        </Link>
      ))}
    </div>
  )
}
