import React, { useState, useEffect } from 'react';
import SpotifyWebPlayer from 'react-spotify-web-playback';
export default function Player({ accessToken, trackURI }) {
    const [playback, setPlayback] = useState(false)
    const [nextTrack, setNextTrack] = useState([])

    useEffect(() => {
        setPlayback(true)
    }, [trackURI])

    if (!accessToken) return null;
    return (
        <SpotifyWebPlayer
            token={accessToken}
            autoPlay={false}
            syncExternalDevice
            showSaveIcon
            uris={trackURI ? [trackURI] : []}
            play={playback}
            callback={state => {
                if (!state.isPlaying) {
                    setPlayback(false)
                    setNextTrack(trackURI)
                    state.nextTrack = nextTrack
                }
            }}
            magnifySliderOnHover={true}
            styles={{
                activeColor: '#fff',
                bgColor: '#333',
                color: '#fff',
                loaderColor: '#fff',
                sliderColor: '#1cb954',
                trackArtistColor: '#ccc',
                trackNameColor: '#fff',
            }}
        />
    )
}