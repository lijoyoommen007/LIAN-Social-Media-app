import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { baseUrl, makeRequest } from "../../axios";
import { AuthContext } from "../../context/AuthContext";
import "./comments.scss"
import { CommentUser, ProfileUser } from "./CommentUser";
import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
import moment from "moment"
import { useQuery, useQueryClient } from "@tanstack/react-query";

function Comments(props) {

  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext)
  const [posts, setPosts] = useState([])
  const [userComment, setComments] = useState('')
  console.log(userComment);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await makeRequest.get(`/posts/${props.id}`)
      setPosts([res.data])
    }
    fetchPosts();
  },[userComment, posts])


  const { isLoading, error, data } = useQuery(["comments"], () =>
  makeRequest.get(`/posts/${props.id}`).then((res)=>{
    setPosts([res.data])
  })

  )



  const handleComments = async (e) => {
    e.preventDefault()
    const commentData = {
      comments: userComment,
      userId: currentUser._id
    }
    try {
      const res = await makeRequest.post(`/posts/comment/${props.id}`, commentData)
      setComments('')
      queryClient.invalidateQueries(["posts"]);  
      queryClient.invalidateQueries(['comments'])
    } catch (error) {
      console.log(error);
    }
  }




  return (
    <div className="comments">

      <div >
        <form className="write " action="">
          <img src={currentUser.profilePicture || altImg} alt="" />
          <input type="text" className="outline-none" placeholder="write a comment" value={userComment} onChange={(e) => setComments(e.target.value)} />
          <button onClick={(e) => handleComments(e)}>Send</button>
        </form>
      </div>

      {posts.map(post => (
        post.comments.map(comment => (
          <div className="comment">
            <ProfileUser id={comment.userId} />
            <div className="info">
              <CommentUser id={comment.userId} />
              <p>{comment.comment}</p>
            </div>
            <span className="date"> {moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      ))}
    </div>
  )
}

export default Comments
