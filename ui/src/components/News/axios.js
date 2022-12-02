import axios from 'axios'
const baseURL = 'https://newsapi.org/v2/'


const instanceNews = axios.create({
    baseURL: baseURL,
})


export default instanceNews 