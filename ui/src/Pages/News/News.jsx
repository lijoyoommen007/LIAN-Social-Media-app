import NavBar from "../../components/navBar/NavBar"
import "../../style.scss"
import { useContext } from "react"
import { DarkModeContext } from "../../context/darkModeContext"
import NewsPage from "../../components/News/News"

function News() {
    const {darkMode} = useContext(DarkModeContext)


    return (
      <div className={`theme-${darkMode? "dark":"light"}`}>
        <div className="themesbg">
        <NavBar/>
        <NewsPage/>
        </div>
      </div>
    )
}

export default News