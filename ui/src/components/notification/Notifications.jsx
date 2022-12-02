import React, { useContext, useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AuthContext } from '../../context/AuthContext'
import Notification from './Notification'
import { makeRequest } from '../../axios'
import NavBar from '../navBar/NavBar'
import { DarkModeContext } from '../../context/darkModeContext'


function Notifications() {
    const {  currentUser } = useContext(AuthContext)
    const [notifications, setNotifications] = useState([])
    const {darkMode} = useContext(DarkModeContext)

    const queryClient = useQueryClient()

    const getNotifications = () => {
        makeRequest.get(`/notifications/${currentUser._id}`)
            .then((response) => {
                const sortedData = response.data.sort(function (a, b) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                setNotifications(sortedData)
                return sortedData;
            }).catch((error) => console.log(error))
    }

    useEffect(() => {
        getNotifications()
        const updateStatus = () => {
            try {
                makeRequest.put(`/notifications/${currentUser._id}`, { isVisited: true })
                    .then((response) => {
                        console.log(response);
                        queryClient.invalidateQueries({ queryKey: ['notifications'] })
                    }).catch((error) => console.log(error))
            } catch (error) {
                console.log(error);
            }
        }
        updateStatus()

    }, [])


    return (
        <div className={`theme-${darkMode? "dark":"light"} animate-slideleft`}>
        <div className="themesbg">
          <NavBar/>
        <div className=' md:px-14  my-3 w-96 md:w-full'>
            <h1 className='text-2xl  text-purple-700 font-thin mb-3'>Notifications</h1>
            {notifications.length > 0 ? notifications.map((notification, index) => (
                <Notification key={index} notification={notification} />
            ))
                : <div className='flex flex-col justify-center gap-2 items-center h-full'>
                    <span className="text-xl text-gray-400">
                        There are no notifications yet.
                    </span>
                </div>
            }

        </div>
        </div>
        </div>

    )
}

export default Notifications