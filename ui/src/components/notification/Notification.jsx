import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment';
import { Link } from 'react-router-dom';
import { makeRequest } from '../../axios';


function Notification({ notification }) {
    const {emiterId, text, createdAt }= notification
    const [user, setUser] = useState({})

    useEffect(() => {
        makeRequest.get(`/users/${emiterId}`).then(({ data }) => {
            console.log(data);
            setUser(data)
        }).catch((error) => {
            console.log(error);
        })
    }, [notification])

    return (
       
        <div className="w-full h-full bg-white my-3 rounded-xl shadow-md border-gray-100  border-2">
            <div className=" flex flex-wrap justify-between items-center p-2.5">
                <div className="flex items-center">
                    <Link to={`/profile/${user?._id}`} className='font-semibold'>{user?.username} <span className='font-medium'> {text}</span></Link>
                </div>
                <span className='text-xs '>{moment(createdAt).fromNow()}</span>

            </div>
        </div>
        
    )
}

export default Notification