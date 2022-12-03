import Axios from 'axios' 
import React, { useEffect, useState } from 'react'
import './Banner.css'
const API_KEY = "0fc3c71d5a849985c23e7761c5513794"
const imageUrl = 'https://image.tmdb.org/t/p/original'


function Banner() {
  
  const [movie, setMovie] = useState('')
  useEffect(()=>{
     Axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`).then((res)=>{
      setMovie(res.data.results[Math.floor(Math.random()*res.data.results.length)])
    })
  },[])
  return (
    <div
    style={{backgroundImage:`url(${imageUrl+movie?.backdrop_path})`}} className='banner'>
        <div className='content'>
            <h1 className='title'>{movie.title}</h1>
            <h1 className='discription'>{movie.overview}</h1>
        </div>
        <div className="fade_bottom"></div>
    </div>
  )
}

export default Banner