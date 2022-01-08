import React from 'react';

class ColorViewer extends React.Component {
    render() {
        return (
            <div className="sideOptionContainer" style={{display:this.props.display}}>
                <p className="option" style={{ transitionDelay: this.props.transitionDelay }}>{this.props.name}</p>
                <button className="colorViewer" id={"colorviewer" + this.props.index} style={{ background: '#' + (this.props.preferences ? this.props.preferences : this.props.theme ? (this.props.themeColorHex === 'XXXXXX' ? '000000' : this.props.themeColorHex) : 
                    this.props.night ? this.props.nightColorHex : this.props.dayColorHex)}}
                    onClick={e => this.props.toggleColorView("colorviewer" + this.props.index, "colorbutton" + this.props.index, "customcolorpicker" + this.props.index, true, false)}></button>
                <button className="colorBtn" id={"colorbutton" + this.props.index + "a"} onClick={e => this.props.setColor(false, false, false, this.props.colorType, this.props.index, this.props.nightColorHex, this.props.dayColorHex, this.props.themeColorHex)}>
                    <img className="colorCancel" src="cancel.png"></img></button>
                <button className="colorBtn" id={"colorbutton" + this.props.index + "b"} onClick={e => this.props.setColor(true, false, false, this.props.colorType, this.props.index, this.props.nightColorHex, this.props.dayColorHex, this.props.themeColorHex)}>
                    <div className="colorCheck"></div></button>
                <div className="customColorPicker" id={"customcolorpicker" + this.props.index}>
                    <p className={this.props.preferences ? "defaultColor active" : "defaultColor"} id={"defaultcolor" + this.props.index} 
                        onClick={e => this.props.setPreviewColor(this.props.index, this.props.theme ? this.props.themeColorHex : this.props.night ? this.props.nightColorHex : this.props.dayColorHex)}>Default</p>
                    <p className="previewColor" onClick={e => this.props.setColor(false, true, false, this.props.colorType, this.props.index, this.props.nightColorHex, this.props.dayColorHex, this.props.themeColorHex)}>Preview</p>
                    <div className="swatch" onClick={e => this.props.setPreviewColor(this.props.index, "FF0000")}></div>
                    <div className="swatch" onClick={e => this.props.setPreviewColor(this.props.index, "FFA500")}></div>
                    <div className="swatch" onClick={e => this.props.setPreviewColor(this.props.index, "FFFF00")}></div>
                    <div className="swatch" onClick={e => this.props.setPreviewColor(this.props.index, "008000")}></div>
                    <br />
                    <div className="swatch" onClick={e => this.props.setPreviewColor(this.props.index, "ADD8E6")}></div>
                    <div className="swatch" onClick={e => this.props.setPreviewColor(this.props.index, "0000FF")}></div>
                    <div className="swatch" onClick={e => this.props.setPreviewColor(this.props.index, "EE82EE")}></div>
                    <div className="swatch" onClick={e => this.props.setPreviewColor(this.props.index, "4B0082")}></div>
                    <div className="colorInputDiv">
                        <div className="colorInputLabel"><p className="hashTag" id="hashtag">#</p></div>
                        <input className="colorInput" id={"colorinput" + this.props.index} spellCheck="false" defaultValue={this.props.preferences ? this.props.preferences :
                            this.props.theme ? this.props.themeColorHex : this.props.night ? this.props.nightColorHex : this.props.dayColorHex} onChange={e => this.props.setPreviewColor(this.props.index, "")}></input>
                    </div>
                    <input type="range" min="-100" max="100" defaultValue="0" className="brightnessSlider" id={"brightnessslider" + this.props.index}
                        onChange={e => this.props.adjustBrightness(this.props.index)}></input>
                    <input type="range" min="-50" max="50" defaultValue="0" className="hueSlider" id={"hueslider" + this.props.index}
                        onChange={e => this.props.adjustHue(this.props.index)}></input>
                    <div className="colorTester" id={"colortester" + this.props.index} style={{
                        background: '#' + (this.props.preferences ? this.props.preferences : this.props.theme ? (this.props.themeColorHex === 'XXXXXX' ? '000000' : this.props.themeColorHex) : 
                            this.props.night ? this.props.nightColorHex : this.props.dayColorHex)
                    }}></div>
                </div>
            </div>
        );
    }
}

export default ColorViewer