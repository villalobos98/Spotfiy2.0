import useAuth from "./useAuth"
import React, { useState, useEffect } from "react"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import TrackSearchResults from "./TrackSearchResults"
import Player from "./Player"
import axios from "axios"

const api = new SpotifyWebApi({
  clientId: "47e10cc4b9cc4d6cacb650a18a75448b",
})

export default function Dashboard({ code }) {
  const accessToken = useAuth(code)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [currentTrack, setCurrentTrack] = useState([])
  const [lyrics, setLyrics] = useState('')

  //Choose song that will be playing, this will also occur when a song is changed
  function chooseTrack(track) {
    setCurrentTrack(track)
    setSearch('')
    setLyrics('')
  }


  useEffect(() => {
    if (!currentTrack) return

    axios.get("http://localhost:1334/lyrics", {
      params: {
        track: currentTrack.title,
        artist: currentTrack.artist
      }
    }).then(response => { setLyrics(response.data.lyrics) })

  }, [currentTrack])

  useEffect(() => {
    if (!accessToken) return
    api.setAccessToken(accessToken)
  }, [accessToken])

  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return
    let cancel = false;

    api.searchTracks(search).then(response => {
      if (cancel) return
      let data = response.body.tracks.items.map(track => {
        const greatestImageAlbum = track.album.images.reduce(
          (greatest, image) => {
            if (image.height > greatest.height) return image
            return greatest
          },
          track.album.images[0]
        )
        return {
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: greatestImageAlbum.url
        }
      })
      function unique(arr) {
        var seenURLs = {}
        var uniqueList = []
        for (var i = 0; i < arr.length; i++) {
          if (!seenURLs.hasOwnProperty(arr[i].albumUrl)) {
            seenURLs[arr[i].albumUrl] = true
            uniqueList.push(arr[i])
          }
        }
        return uniqueList
      }
      setSearchResults(unique(data))
    })
    return () => cancel = true
  }, [search, accessToken])


  return (
    <div style={{ backgroundColor: 'black' }}>
      <Container className='d-flex flex-column py-2' style={{ height: "100vh" }} >
        <Form.Control
          type="search"
          placeholder="Search Songs/Artists"
          value={search}
          style={{ backgroundColor: '#333', textColor: '#FFF' }}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex-grow-1 my-2 align-items-center" style={{ overflow: "auto" }}>
          {
            searchResults.map(track => (
              <TrackSearchResults
                track={track}
                key={track.albumUrl}
                chooseTrack={chooseTrack}
              />
            ))
          }
          {lyrics === "No Lyrics Found" && (
            <h1>No Lyrics Found</h1>
          )}
          {searchResults.length === 0 && lyrics !== "No Lyrics Found" && (
            <div className="text-center" style={{ backgroundColor: 'grey', whiteSpace: 'pre' }}>
              {lyrics}
            </div>
          )}
        </div>
        <div>
          <Player accessToken={accessToken} trackURI={currentTrack?.uri} />
        </div>
      </Container >
    </div>
  )

}
