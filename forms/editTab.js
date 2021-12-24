import React from 'react';

export class EditTab extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.currTab.name !== "") {
            this.state = {
                name: this.props.currTab.name,
                color: this.props.currTab.color,
                tabs: this.props.tabs,
                preferences: this.props.preferences,
            }
        } else {
            this.state = {
                name: "",
                color: "",
            }
        }
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currTab.name !== "" && state.name === "" && state.color === "") {
            return {
                name: props.currTab.name,
                color: props.currTab.color,
                tabs: props.tabs,
                preferences: props.preferences,
            }
        }
        return null;
    }

    setName(event) {
        var count = 0;
        this.setState({ name: event.target.value });
        if (event.target.value.includes('/') || event.target.value.includes('.') || event.target.value.includes('#') || event.target.value.includes('$')
            || event.target.value.includes('[') || event.target.value.includes(']')) {
            document.getElementById("taberrmsg" + this.props.thisTab.name).style.display = "block";
        } else {
            document.getElementById("taberrmsg" + this.props.thisTab.name).style.display = "none";
        }
        for (var i = 0; i < this.state.tabs.length; i++) {
            if (event.target.value === this.state.tabs[i].name && event.target.value !== this.props.currTab.name)
                count++;
        }
        if (count !== 0) {
            document.getElementById("titletaberrmsg" + this.props.thisTab.name).style.display = "block";
        } else {
            document.getElementById("titletaberrmsg" + this.props.thisTab.name).style.display = "none";
        }
    }
    async setColor() {
        this.setState({ color: await document.getElementById("colorpicker" + this.props.thisTab.name).value })
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
                document.getElementById("taberrmsg" + this.props.thisTab.name).style.display = "block";
            } else {
                var count = 0;
                for (var i = 0; i < this.state.tabs.length; i++) {
                    if (newTab.name === this.state.tabs[i].name && newTab.name !== this.props.currTab.name)
                        count++;
                }
                if (count !== 0) {
                    document.getElementById("titletaberrmsg" + this.props.thisTab.name).style.display = "block";
                } else {
                    this.props.editTab(newTab, this.props.currTab);
                    this.viewTab();
                }
            }
        }
    }

    viewTab() {
        document.getElementById("taberrmsg" + this.props.thisTab.name).style.display = "none";
        document.getElementById("titletaberrmsg" + this.props.thisTab.name).style.display = "none";
        this.props.closeActiveEdit();
        window.formOpen = false;
        this.setState({
            name: "",
            color: ""
        })
    }

    render() {
        return (
            <div className="addTabDiv editTabDiv" style={{ borderColor: this.state.color }} onClick={e => e.stopPropagation()}>
                <form className="addTabForm" id="edittabform" onSubmit={this.submitForm}>
                    <p className="tabErrMsgEdit" id={"taberrmsg" + this.props.thisTab.name}>Can't contain: . [ ] # $ /</p>
                    <p className="tabErrMsg" id={"titletaberrmsg" + this.props.thisTab.name}>Name taken</p>
                    <input className="tabInput" id={"tabinput" + this.props.thisTab.name} type="text" onChange={e => this.setName(e)} spellCheck="false" style={{ color: this.state.color }} required></input>
                    <input className="colorPicker" id={"colorpicker" + this.props.thisTab.name} onChange={e => this.setColor()} type="color"></input>
                    <div className="colorPickerWrapper" style={{ backgroundColor: this.state.color }}></div>
                    <button className="tabCancel" id="tabcancel2" type="button" onClick={e => this.viewTab()}><img className="submitTabImg" src="cancel.png" id="tabcancelimg"></img></button>
                    <button className="tabSubmit" id="tabsubmit2" type="submit"><img className="submitTabImg" src="checkmark.png" id="tabsubmitimg"></img></button>
                </form>
            </div>
        );
    }
}