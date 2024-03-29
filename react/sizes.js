import React from 'react';

class Sizes extends React.Component {
    render() {
        return (
            <div className="sideOptionContainerSize" style={{display:this.props.display}}>
                <p className="option" style={{ transitionDelay: this.props.transitionDelay }}>{this.props.name}</p>
                <div className="sizeSliderBox" style={{ transitionDelay: this.props.transitionDelay }}>
                    <img className={"resetSlider" + (this.props.size !== this.props.benchmark ? " active" : "")} id={"resetslider" + this.props.index} src="reset.webp" 
                        onClick={e => this.props.resetSize("sizeslider" + this.props.index, this.props.sizeType, this.props.benchmark)}></img>
                    <input type="range" min="1" max="100" defaultValue={this.props.size} className="sizeSlider" id={"sizeslider" + this.props.index}
                        onChange={e => this.props.updateSlideNum("sizeslider" + this.props.index, "slidernumber" + this.props.index)} 
                        onMouseUp={e => this.props.setSize(true, "sizeslider" + this.props.index, this.props.sizeType)}
                        onTouchEnd={e => this.props.setSize(true, "sizeslider" + this.props.index, this.props.sizeType)}></input>
                    <p className="sliderNumber" id={"slidernumber" + this.props.index}>{this.props.size}</p>
                </div>
            </div>
        );
    }
}

export default Sizes