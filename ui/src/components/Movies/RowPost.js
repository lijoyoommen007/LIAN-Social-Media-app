import axios from './axios'
import React,{useEffect,useState} from 'react'
import './RowPost.css'
import Youtube from 'react-youtube'
import { makeRequest } from '../../axios'
const imageUrl = 'https://image.tmdb.org/t/p/original'
const API_KEY = "0fc3c71d5a849985c23e7761c5513794"


function RowPost(props) {
  const [movies, setMovies] = useState([])
  const [urlId ,setUrlId]= useState('')
  useEffect(()=> {
    makeRequest.get(props.url).then(res=>{
      console.log(res.data);
      setMovies(res.data.results)
    }).catch((err)=>{
      //console.log(err);
    })
  },[])
  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };
  const handleMovie = (id)=>{
    console.log(id);
      makeRequest.get(`/movie/${id}/videos?api_key=${API_KEY}&language=en-US`).then(res=>{
      if(res.data.results.length!==0){
        setUrlId(res.data.results[0])
      }
    })
  }
  return (
    <div className='row'>
        <h2 >{props.title}</h2>
        <div className="posters">
          {movies.map((obj)=>{
            return(
            <img onClick={()=>handleMovie(obj.id)} className={props.isSmall ? 'smallPoster' : 'poster'} src={`${imageUrl+obj.backdrop_path}`} alt="posters" />
            )
          })}
                     
        </div>
        { urlId && <Youtube opts={opts} videoId={urlId.key}/>}
    </div>
  )
}

export default RowPost