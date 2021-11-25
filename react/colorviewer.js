import React from 'react';

class ColorViewer extends React.Component {
    render() {
        return (
            <div className="sideOptionContainer">
                <p className="option" style={{ transitionDelay: this.props.transitionDelay }}>{this.props.name}</p>
                <button className="colorViewer" id={"colorviewer" + this.props.index} style={{ background: this.props.preferences ? '#' + this.props.preferences : 
                    (this.props.night ? this.props.nightColor : this.props.dayColor)}}
                    onClick={e => this.props.toggleColorView("colorviewer" + this.props.index, "colorbutton" + this.props.index, "customcolorpicker" + this.props.index, true, false)}></button>
                <button className="colorBtn" id={"colorbutton" + this.props.index + "a"} onClick={e => this.props.setColor(false, false, false)}>
                    <img className="colorCancel" src="cancel.png"></img></button>
                <button className="colorBtn" id={"colorbutton" + this.props.index + "b"} onClick={e => this.props.setColor(true, false, false)}>
                    <div className="colorCheck"></div></button>
                <div className="customColorPicker" id={"customcolorpicker" + this.props.index}>
                    <p className="defaultColor" id={"defaultcolor" + this.props.index} onClick={e => this.props.setDefaultColor()} style={{
                        opacity: this.props.preferences ? "1" : "0.5",
                        pointerEvents: this.props.preferences ? "all" : "none"
                    }}>Set to Default</p>
                    <p className="previewColor" onClick={e => this.props.setColor(true, true, false)}>Preview</p>
                    <div className="swatch" onClick={e => this.props.setInputColor("colorinput" + this.props.index, "FF0000", "colortester" + this.props.index)}></div>
                    <div className="swatch" onClick={e => this.props.setInputColor("colorinput" + this.props.index, "FFA500", "colortester" + this.props.index)}></div>
                    <div className="swatch" onClick={e => this.props.setInputColor("colorinput" + this.props.index, "FFFF00", "colortester" + this.props.index)}></div>
                    <div className="swatch" onClick={e => this.props.setInputColor("colorinput" + this.props.index, "008000", "colortester" + this.props.index)}></div>
                    <br />
                    <div className="swatch" onClick={e => this.props.setInputColor("colorinput" + this.props.index, "ADD8E6", "colortester" + this.props.index)}></div>
                    <div className="swatch" onClick={e => this.props.setInputColor("colorinput" + this.props.index, "0000FF", "colortester" + this.props.index)}></div>
                    <div className="swatch" onClick={e => this.props.setInputColor("colorinput" + this.props.index, "EE82EE", "colortester" + this.props.index)}></div>
                    <div className="swatch" onClick={e => this.props.setInputColor("colorinput" + this.props.index, "4B0082", "colortester" + this.props.index)}></div>
                    <div className="colorInputDiv">
                        <div className="colorInputLabel"><p className="hashTag">#</p></div>
                        <input className="colorInput" id={"colorinput" + this.props.index} spellCheck="false" defaultValue={this.props.preferences ? this.props.preferences :
                            (this.props.night ? this.props.nightColorHex : this.props.dayColorHex)} onChange={e => this.props.setPreviewColor("colorinput" + this.props.index, "colortester" + this.props.index)}></input>
                    </div>
                    <input type="range" min="-100" max="100" defaultValue="0" className="brightnessSlider" id={"brightnessslider" + this.props.index}
                        onChange={e => this.props.adjustBrightness("brightnessslider" + this.props.index, "colorinput" + this.props.index, "colortester" + this.props.index)}></input>
                    <input type="range" min="-50" max="50" defaultValue="0" className="hueSlider" id={"hueslider" + this.props.index}
                        onChange={e => this.props.adjustHue("hueslider" + this.props.index, "colorinput" + this.props.index, "colortester" + this.props.index)}></input>
                    <div className="colorTester" id={"colortester" + this.props.index} style={{
                        background: this.props.preferences ? '#' + this.props.preferences :
                            (this.props.night ? this.props.nightColorHex : this.props.dayColorHex)
                    }}></div>
                </div>
            </div>
        );
    }
}

export default ColorViewer
