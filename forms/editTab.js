import React from 'react';

export class EditTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            color: "",
            tabs: this.props.tabs,
            preferences: this.props.preferences,
            taberrmsg: "taberrmsg" + this.props.currTab.name,
            titletaberrmsg: "titletaberrmsg" + this.props.currTab.name,
            colorpicker: "colorpicker" + this.props.currTab.name
        }
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (state.name === "") {
            return {
                name: props.currTab.name,
                color: props.currTab.color,
                tabs: props.tabs,
                preferences: props.preferences,
                taberrmsg: "taberrmsg" + props.currTab.name,
                titletaberrmsg: "titletaberrmsg" + props.currTab.name,
                colorpicker: "colorpicker" + props.currTab.name,
            }
        }
        return null;
    }

    setName(event) {
        var count = 0;
        this.setState({name: event.target.value});
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
        this.setState({color: await document.getElementById(this.state.colorpicker).value})
    }

    async submitForm(event) {
        event.preventDefault();
        if (this.state.name === this.props.currTab.name && this.state.color === this.props.currTab.color) {
            this.viewTab();
        } else {
            var newTab = {
                name: this.state.name,
                color: this.state.color
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
        this.setState({
            name:"",
            color: ""
        })
        document.getElementById(this.state.taberrmsg).style.display = "none";
        document.getElementById(this.state.titletaberrmsg).style.display = "none";
        this.props.closeActiveEdit();
        window.formOpen = false;
    }

    render () {
        return (
            <div className="addTabDiv editTabDiv" style={{borderColor: this.state.color}} onClick={e => e.stopPropagation()}>
                <form className="addTabForm" id="edittabform" onSubmit={this.submitForm}>
                    <p className="tabErrMsgEdit" id={this.state.taberrmsg}>Can't contain: . [ ] # $ /</p>
                    <p className="tabErrMsg" id={this.state.titletaberrmsg}>Name taken</p>
                    <input className="tabInput" id={"tabinput" + this.props.currTab.name} type="text" onChange={e => this.setName(e)} spellCheck="false" style={{color:this.state.color}} required></input>
                    <input className="colorPicker" id={this.state.colorpicker} onChange={e => this.setColor()} type="color"></input>
                    <div className="colorPickerWrapper" style={{backgroundColor: this.state.color}}></div>
                    <button className="tabCancel" id="tabcancel2" type="button" onClick={e => this.viewTab()}><img className="submitTabImg" src="cancel.png" id="tabcancelimg"></img></button>
                    <button className="tabSubmit" id="tabsubmit2" type="submit"><img className="submitTabImg" src="checkmark.png" id="tabsubmitimg"></img></button>
                </form>
            </div>
        );
    }
}