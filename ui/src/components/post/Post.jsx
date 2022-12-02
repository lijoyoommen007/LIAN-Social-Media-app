import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useEffect, useState } from "react";
import { baseUrl, makeRequest} from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import altImg from "../../assets/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";


const Post = ({ post, socket }) => {
  console.log(socket);
  const {currentUser} = useContext(AuthContext);
  const [commentOpen, setCommentOpen] = useState(false);
  const [user, setUser] = useState({});
  const [video, setVideo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false)
  const [liked, setLiked] = useState(post.likes.includes(currentUser._id)?true:false)
  const queryClient = useQueryClient();
  
  useEffect(() => {
    makeRequest.get(`users/${post.userId}`).then((res)=>{
      setUser(res.data)
    }).catch((err)=>{console.log(err);})
    post.likes.includes(currentUser._id)?setLiked(true):setLiked(false)
  }, [post])

  useEffect(()=>{
    if(post.img){
      const extension = post?.key?.substring(post?.key?.lastIndexOf('.') + 1);
      (extension === 'mp4') ? setVideo(true) : setVideo(false)   
    }
  },[post])

  const deleteMutation = useMutation(
    (postId) => {
      return makeRequest.delete("posts/"+ postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );
  
  //TEMPORARY
  // const liked = true;
  const handleLike = ()=>{
    makeRequest.put(`/posts/${post._id}/like`,{userId:currentUser._id},{withCredentials:true}).then(()=>{
      queryClient.invalidateQueries(["posts"]);
      
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate(post._id);
  };
  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={user?.profilePicture || altImg} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{user?.username}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          { post.userId === currentUser._id && <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />}
          {menuOpen && post.userId === currentUser._id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content" onDoubleClick={handleLike}>
          <p>{post.desc}</p>
          {
            post.img && video? <video controls src={post.img}></video>:
            <img src={post.img} alt="" />
          }

          
        </div>
        <div className="info">
          <div className="item" onClick={handleLike}>
            {liked ? <FavoriteOutlinedIcon style={{color:"red"}}/> : <FavoriteBorderOutlinedIcon />}
            {post.likes.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {post.comments.length} Comments
          </div>
          {/* <div className="item">
            <ShareOutlinedIcon />
            Share
          </div> */}
        </div>
        {commentOpen && <Comments id={post._id}/>}
      </div>
    </div>
  );
};

export default Post;
