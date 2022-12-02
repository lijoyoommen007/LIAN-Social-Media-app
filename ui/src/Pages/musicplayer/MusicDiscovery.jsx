import React from 'react'
import {ArtistDetails, TopArtists, AroundYou, Discover, Search, SongDetails, TopCharts} from "../../music player/pages"
import {Searchbar, Sidebar, MusicPlayer, TopPlay} from "../../music player/components/"
import { useSelector } from 'react-redux';

function MusicDiscovery(props) {
  const { activeSong } = useSelector((state) => state.player);
  return (
    
    <div className="relative flex">
      <Sidebar />
      {console.log(props.Music)}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-[#BDE0FE] to-[#121286]">
        <Searchbar />

        <div className="px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
          <div className="flex-1 h-fit pb-40">
              {props.Music === "Discovery"?<Discover/>:
              (props.Music === "SongDetails"?<SongDetails/>:
              (props.Music === "AroundYou")?<AroundYou/>:
              (props.Music === "ArtistDetails")?<ArtistDetails/>:
              (props.Music === "Search")?<Search/>:
              (props.Music === "TopCharts")?<TopCharts/>:
              (props.Music === "TopArtist")&&<TopArtists/>
              )}              
          </div>
          <div className="xl:sticky relative top-0 h-fit">
            <TopPlay />
          </div>
        </div>
      </div>

      {activeSong?.title && (
        <div className="absolute h-28 bottom-0 left-0 right-0 flex animate-slideup bg-gradient-to-br from-white/10 to-[#2a2a80] backdrop-blur-lg rounded-t-3xl z-10">
          <MusicPlayer />
        </div>
      )}
    </div>
  )
}

export default MusicDiscovery