import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import "./style.scss"
import Login from "./Pages/login/Login";
import Register from "./Pages/register/Register";
import Home from "./Pages/home/Home"
import Profile from "./Pages/profile/Profile";
import News from "./Pages/News/News";
import Movies from "./Pages/Movies/Movies";
import MusicDiscovery from "./Pages/musicplayer/MusicDiscovery";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./Pages/messenger/Messenger";
import {io} from "socket.io-client"
import Notifications from "./components/notification/Notifications";




function App() {

  const { currentUser } = useContext(AuthContext)
  
  const ProtectedRouter = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />
    }
    return children
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element:
        <ProtectedRouter>
          <Home  />
        </ProtectedRouter>
    },
    {
      path: "/login",
      element:
        currentUser ? <Navigate to="/" /> : <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/profile/:id",
      element:
        <ProtectedRouter>
          <Profile />
        </ProtectedRouter>
    },
    {
      path: "/news",
      element:
        <ProtectedRouter>
          <News />
        </ProtectedRouter>
    },
    {
      path: "/movies",
      element:
        <ProtectedRouter>
          <Movies />
        </ProtectedRouter>
    },
    {
      path: "/music",
      element:
        <MusicDiscovery Music='Discovery' />
    },
    {
      path: "/music/songs/:songid",
      element:
        <MusicDiscovery Music="SongDetails" />
    },
    {
      path: "/music/artists/:id",
      element:
        <MusicDiscovery Music="ArtistDetails" />
    },
    {
      path: "/music/around-you",
      element:
        <MusicDiscovery Music="AroundYou" />
    },
    {
      path: "/music/top-charts",
      element: <MusicDiscovery Music="TopCharts" />
    },
    {
      path: "/music/top-artists",
      element: <MusicDiscovery Music="TopArtist" />
    },
    {
      path: "/music/search/:searchTerm",
      element: <MusicDiscovery Music="Search" />
    },
    {
      path: "/messenger",

      element:
        <ProtectedRouter>
          <Messenger />
        </ProtectedRouter>
    },
    {
      path:"/notifications",
      element:
      <ProtectedRouter>
        <Notifications/>
      </ProtectedRouter>
    }


  ])



  return (
    <RouterProvider router={router} />
  );
}

export default App;
