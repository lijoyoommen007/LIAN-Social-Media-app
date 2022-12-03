import axios from 'axios'
const baseURL = 'https://api.themoviedb.org/3'

const instanceNews = axios.create({
    baseURL: baseURL
})


export default instanceNews 