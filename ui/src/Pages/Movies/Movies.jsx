import React, { useContext } from 'react'
import Banner from '../../components/Movies/Banner'
import RowPost from '../../components/Movies/RowPost'
import NavBar from '../../components/navBar/NavBar'
import { DarkModeContext } from '../../context/darkModeContext'
import {action,originals,HorrorMovies,ComedyMovies,RomanceMovies} from './urls'

function Movies() {
    const {darkMode} = useContext(DarkModeContext)

    return (
        <div className={`theme-${darkMode? "dark":"light"}`}>
          <div className="themesbg">
          <NavBar/>
          <Banner/>
          <RowPost url={originals} title='NetFlix Origianls'/>
          <RowPost url={action} title='Action' isSmall />
          <RowPost url={HorrorMovies} title='Horror Movies' isSmall />
          <RowPost url={ComedyMovies} title='Comedy Movies' isSmall />
          <RowPost url={RomanceMovies} title='Romantic Movies' isSmall />
          </div>
        </div>
      )
}

export default Movies