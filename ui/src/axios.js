import axios from 'axios'


export const baseUrl = "http://localhost:8000/api/"


export const makeRequest = axios.create({
    baseURL:"https://api.liansocialmedia.ml/api/",
    withCredentials:true
})