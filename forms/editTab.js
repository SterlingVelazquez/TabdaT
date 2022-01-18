import React from 'react';

export class EditTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            color: "",
            currTab: this.props.currTab,
            tabs: this.props.tabs,
            preferences: this.props.preferences,
            taberrmsg: "taberrmsg" + this.props.currTab.name,
            titletaberrmsg: "titletaberrmsg" + this.props.currTab.name,
            colorpicker: "colorpicker" + this.props.currTab.name,
            colorpickerwrapper: "colorpickerwrapper" + this.props.currTab.name,
            tabinput: "tabinput" + this.props.currTab.name,
        }
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        return {
            currTab: props.currTab,
            tabs: props.tabs,
            preferences: props.preferences,
            taberrmsg: "taberrmsg" + props.currTab.name,
            titletaberrmsg: "titletaberrmsg" + props.currTab.name,
            colorpicker: "colorpicker" + props.currTab.name,
            colorpickerwrapper: "colorpickerwrapper" + props.currTab.name,
            tabinput: "tabinput" + props.currTab.name,
        }
    }

    setName(event) {
        var count = 0;
        this.setState({ name: event.target.value });
        if (event.target.value.includes('/') || event.target.value.includes('.') || event.target.value.includes('#') || event.target.value.includes('$')
            || event.target.value.includes('[') || event.target.value.includes(']')) {
            document.getElementById(this.state.taberrmsg).style.display = "block";
        } else {
            document.getElementById(this.state.taberrmsg).style.display = "none";
        }
        for (var i = 0; i < this.state.tabs.length; i++) {
            if (event.target.value === this.state.tabs[i].name && event.target.value !== this.props.currTab.name)
                count++;
        }
        if (count !== 0) {
            document.getElementById(this.state.titletaberrmsg).style.display = "block";
        } else {
            document.getElementById(this.state.titletaberrmsg).style.display = "none";
        }
    }
    async setColor() {
        this.setState({ color: await document.getElementById(this.state.colorpicker).value })
    }

    async submitForm(event) {
        event.preventDefault();
        if ((this.state.name === this.props.currTab.name && this.state.color === this.props.currTab.color) ||
            (this.state.name === "" && this.state.color === "" )) {
            this.viewTab();
        } else {
            var newTab = {
                name: this.state.name !== this.props.currTab.name && this.state.name !== "" ? this.state.name : this.props.currTab.name,
                color: this.state.color !== this.props.currTab.color && this.state.color !== "" ? this.state.color : this.props.currTab.color,
            };
            if (newTab.name.includes('/') || newTab.name.includes('.') || newTab.name.includes('#') || newTab.name.includes('$')
                || newTab.name.includes('[') || newTab.name.includes(']')) {
                document.getElementById(this.state.taberrmsg).style.display = "block";
            } else {
                var count = 0;
                for (var i = 0; i < this.state.tabs.length; i++) {
                    if (newTab.name === this.state.tabs[i].name && newTab.name !== this.props.currTab.name)
                        count++;
                }
                if (count !== 0) {
                    document.getElementById(this.state.titletaberrmsg).style.display = "block";
                } else {
                    this.props.editTab(newTab, this.props.currTab);
                    this.viewTab();
                }
            }
        }
    }

    viewTab() {
        document.getElementById("taberrmsg" + this.props.currTab.name).style.display = "none";
        document.getElementById("titletaberrmsg" + this.props.currTab.name).style.display = "none";
        this.props.closeActiveEdit();
        window.formOpen = false;
        this.setState({
            name: "",
            color: ""
        })
    }

    render() {
        return (
            <div className="addTabDiv editTabDiv" style={{ borderColor: this.state.color !== "" ? this.state.color : this.state.currTab.color }} onClick={e => e.stopPropagation()}>
                <form className="addTabForm" id="edittabform" onSubmit={this.submitForm}>
                    <p className="tabErrMsgEdit" id={this.state.taberrmsg}>Can't contain: . [ ] # $ /</p>
                    <p className="tabErrMsg" id={this.state.titletaberrmsg}>Name taken</p>
                    <input className="tabInput" id={this.state.tabinput} type="text" onChange={e => this.setName(e)} spellCheck="false" style={{ color: this.state.color !== "" ? this.state.color : this.state.currTab.color }}
                        value={this.state.name !== "" ? this.state.name : this.state.currTab.name} required></input>
                    <input className="colorPicker" id={this.state.colorpicker} onChange={e => this.setColor()} type="color"
                        value={this.state.color !== "" ? this.state.color : this.state.currTab.color}></input>
                    <div className="colorPickerWrapper" id={this.state.colorpickerwrapper} style={{ backgroundColor: this.state.color !== "" ? this.state.color : this.state.currTab.color }}></div>
                    <button className="tabCancel" id="tabcancel2" type="button" onClick={e => this.viewTab()}><img className="submitTabImg" src="cancel.webp" id="tabcancelimg"></img></button>
                    <button className="tabSubmit" id="tabsubmit2" type="submit"><img className="submitTabImg" src="checkmark.webp" id="tabsubmitimg"></img></button>
                </form>
            </div>
        );
    }
}