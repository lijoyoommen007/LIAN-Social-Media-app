import { useContext, useEffect, useReducer, useState } from "react";
import Post from "../post/Post";
import "./posts.scss";
import axios from "axios"
import { baseUrl, makeRequest } from "../../axios";import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";


const Posts = (props ) => {
  const {currentUser} = useContext(AuthContext)
  const [err, setErr] = useState(false)
  console.log(props.socket);


  const { isLoading, error, data } = useQuery(["posts"], () =>
  makeRequest.get(props.id ?  `posts/profile/${props.id}` : "posts/timeline/"+currentUser._id).then((res) => {
    const sortedPosts = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return sortedPosts;
  }).catch((e)=>{
    localStorage.removeItem("user");
    setErr(e.response.data+"please re-login");
  })
);
  

return <div className="posts">
{error? <span onClick={()=>{window.location.replace('/login')}} style={{cursor:"pointer"}}>{err}</span> :
  (isLoading ? "loading...":data.map(post=>(
    <Post post={post} key={post._id} socket={props.socket} />
  )))
}

</div>;
};

export default Posts;