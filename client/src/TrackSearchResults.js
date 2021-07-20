import React from 'react';
import { Card, CardBody, CardSubtitle, CardLink, CardTitle } from 'reactstrap';

export default function TrackSearchResults({ track, chooseTrack }) {
    return (
        < Card >
            <CardBody style={{ backgroundColor: 'dark grey' }}>
                <CardTitle tag="h5">{track.title}</CardTitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted">{track.artist}</CardSubtitle>
            </CardBody>
            <div
                className="d-flex m-2 align-items-center"
                style={{ cursor: "pointer", backgroundColor: '#181818' }}
                onClick={() => chooseTrack(track)}
            >
                <img width="100%" src={track.albumUrl} alt="Album Art" />
            </div>

            <CardBody>
                <CardLink href={track.albumUrl}>Album Cover Art</CardLink>
                <CardLink href={track.uri}>Open in Spotify</CardLink>
            </CardBody>
        </Card >
    )
}