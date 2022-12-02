import axios from 'axios'


export const baseUrl = "http://localhost:8000/api/"


export const makeRequest = axios.create({
    baseURL:"http://localhost:3000/",
    withCredentials:true
})