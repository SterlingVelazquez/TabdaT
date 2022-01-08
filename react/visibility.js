import React from 'react';

class Visibility extends React.Component {
    render() {
        return (
            <div className="sideOptionContainer" style={{display:this.props.display}}>
                <p className="option" style={{transitionDelay: this.props.transitionDelay}}>{this.props.name}</p>
                <button className={this.props.preference ? "switchContainer active" : "switchContainer"}
                    id={"switchcontainer" + this.props.index} onClick={e => this.props.hideElement(this.props.hideType)} style={{
                        pointerEvents: this.props.user === "default" ? "none" : "all",
                        transition: "background-color 0.5s, box-shadow 0.5s, transform 0.5s " + this.props.transitionDelay + ", opacity 0.5s " + this.props.transitionDelay
                    }}>
                    <div className="switch" id={"switch" + this.props.index}></div>
                </button>
            </div>
        );
    }
}

export default Visibility
