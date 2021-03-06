import React, { Component } from 'react';
import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';
import {Spotify} from "../../util/Spotify";
import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults: [],
            playlistName: 'New Playlist',
            playlistTracks: []
        };
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
        Spotify.getAccessToken();
    }

    addTrack(track) {
        if (!this.state.playlistTracks.find((playlistTrack) => {
                    return (track.id === playlistTrack.id)
                }
            )) {
            //add track to end of playlist
            let newPlaylistTracks = this.state.playlistTracks.concat(track);
            this.setState({
                playlistTracks: newPlaylistTracks
            })
        }
    }

    removeTrack(track) {
        let trackId = (this.state.playlistTracks.findIndex((playlistTrack) => {
                return (track.id === playlistTrack.id)
            }
        ));
        if (trackId >= 0) {
            let newPlaylistTracks = this.state.playlistTracks.slice(0);
            newPlaylistTracks.splice(trackId, 1);
            this.setState({
                playlistTracks: newPlaylistTracks
            })
        }
    }

    updatePlaylistName(name) {
        this.setState({
            playlistName: name
        })
    }

    savePlaylist() {
        let tracks = this.state.playlistTracks;
        if (tracks.length && this.state.playlistName) {
            let trackURIs = tracks.map((track) => {
                return track.uri});
            Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
                this.setState({
                    playlistName: 'New Playlist',
                    playlistTracks: [],
                });
            });
        }
    }

    //    savePlaylist() {
    //     let trackURIs = this.state.playlistTracks.map((track) => track.uri);
    //     let copyPlaylistName = {...this.state.playlistName};
    //     Spotify.savePlaylist(copyPlaylistName, trackURIs).then(() => {
    //         this.setState({
    //             playlistName: 'New Playlist',
    //             playlistTracks: [],
    //         });
    //     });
    //     return trackURIs;
    // }

    search(searchTerm) {
        console.log(searchTerm);
        Spotify.search(searchTerm).then(results => {
            this.setState({
                searchResults: results
            })
        });

    }

    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar onSearch={this.search}/>
                    <div className="App-playlist">
                        <SearchResults searchResults={this.state.searchResults}
                                       onAdd={this.addTrack}
                                       isRemoval={false}/>
                        <Playlist playlistName={this.state.playlistName}
                                  playlistTracks={this.state.playlistTracks}
                                  onRemove={this.removeTrack}
                                  isRemoval={true}
                                  onNameChange={this.updatePlaylistName}
                                  onSave={this.savePlaylist}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default App

