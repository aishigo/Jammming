import React from 'react';
import { TrackList } from '../TrackList/TrackList';
import './Playlist.css';


export class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.onNameChange = this.props.onNameChange.bind(this);
    }

    handleNameChange = (event) => {
        this.onNameChange(event.target.value)
    };

    render() {
        return (
            <div className="Playlist">
                <input onChange={this.handleNameChange}
                       defaultValue={"New Playlist"}/>
                <TrackList tracks={this.props.playlistTracks}
                           onRemove={this.props.onRemove}
                           isRemoval={this.props.isRemoval}/>
                <a className="Playlist-save"
                   onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
            </div>
        )
    }
}

//export default Playlist;