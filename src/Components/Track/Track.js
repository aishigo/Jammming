import React from 'react';
import './Track.css';

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }


    // renderAction() {
    //     return (isRemoval ? '-' : '+');
    // }

    renderAnchor() {
        if (this.props.isRemoval) {
            return <a onClick={this.removeTrack} className="Track-action">-</a>
        } else {
            return <a onClick={this.addTrack} className="Track-action">+</a>
        }
    }

    addTrack() {
        this.props.onAdd(this.props.track)
    };

    removeTrack() {
        this.props.onRemove(this.props.track)
    };

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                {this.renderAnchor()}
            </div>
        )
    }
}

//export default Track;