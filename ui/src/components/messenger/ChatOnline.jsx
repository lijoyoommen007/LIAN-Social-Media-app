import "./chatOnline.css"
import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
import { useState } from "react"
import { useEffect } from "react"
import { makeRequest } from "../../axios"

export default function ChatOnline({ onlinUsers, currentId, setCurrentChat }) {

  console.log(onlinUsers);
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
    setOnlineFriends(friends.filter(f => onlinUsers.includes(f._id)))
  }, [friends, onlinUsers])

  const handleClick = async (user) => {
    try {
      const res = await makeRequest.get(`/conversations/find/${currentId}/${user._id}`)
      setCurrentChat(res.data)
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img src={o.profilePicture || altImg} alt="" className="chatOnlineImg" />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o.username}</span>
        </div>
      ))}
    </div>
  )
}
