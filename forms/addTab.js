import React from 'react';

export class AddTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name : "", 
            color : "#8D9CB8",
            user: this.props.isUser,
            tabs: this.props.tabs,
            numTabs: this.props.tabs.length,
            tabIndex: this.props.tabIndex,
            preferences: this.props.preferences,
        };
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            user : props.isUser,
            tabs: props.tabs,
            numTabs: props.tabs.length,
            tabIndex: props.tabIndex,
            preferences: props.preferences,
        }
    }

    setName(event) {
        var count = 0;
        this.setState({name: event.target.value});
        if (event.target.value.includes('/') || event.target.value.includes('.') || event.target.value.includes('#') || event.target.value.includes('$')
            || event.target.value.includes('[') || event.target.value.includes(']')) {
            document.getElementById("taberrmsg").style.display = "block";
        } else {
            document.getElementById("taberrmsg").style.display = "none";
        }
        for (var i = 0; i < this.state.tabs.length; i++) {
            if (event.target.value === this.state.tabs[i].name)
                count++;
        }
        if (count !== 0) {
            document.getElementById("titletaberrmsg").style.display = "block";
        } else {
            document.getElementById("titletaberrmsg").style.display = "none";
        }
    }
    async setColor() {
        this.setState({color: await document.getElementById("colorpicker").value})
    }

    async submitForm(event) {
        event.preventDefault();
        var newTab = ({
            name: this.state.name,
            color: this.state.color,
        });
        if (newTab.name.includes('/') || newTab.name.includes('.') || newTab.name.includes('#') || newTab.name.includes('$')
            || newTab.name.includes('[') || newTab.name.includes(']')) {
            document.getElementById("taberrmsg").style.display = "block";
        } else {
            var count = 0;
            for (var i = 0; i < this.state.tabs.length; i++) {
                if (newTab.name === this.state.tabs[i].name)
                    count++;
            }
            if (count !== 0) {
                document.getElementById("titletaberrmsg").style.display = "block";
            } else {
                this.props.addTab(newTab, false);
                this.viewTab();
            }
        }
    }

    viewTab() {
        this.props.openTabAdd();
        window.formOpen = false;
        if (document.getElementById("container").className.includes("focus")) {
            this.setState({color:"#9C9C9C"})
        } else if (document.getElementById("container").className.includes("themes")) {
            this.setState({color:"#CCCCCC"})
        } else {
            this.setState({color:"#8D9CB8"})
        }
    }

    render () {
        var isLastIndex = this.state.tabIndex < Math.floor(this.state.numTabs / 4);
        return (
            <div className="addTabDiv" id="addtabdiv" style={{ display: this.state.user === "default" || isLastIndex ? "none" : "inline-table", left: isLastIndex ? "-100px" : "0", borderColor: this.state.color}}>
                <img className={!(this.state.preferences.addTab) ? "addTabPlus active" : "addTabPlus"} id="addtabplus" src="plus.png" onClick={e => this.viewTab()}></img>
                <form className="addTabForm" id="addtabform" onSubmit={this.submitForm}>
                    <p className="tabErrMsg" id="taberrmsg">Can't contain: . [ ] # $ /</p>
                    <p className="tabErrMsg" id="titletaberrmsg">Name taken</p>
                    <input className="tabInput" id="tabinput" type="text" placeholder="Name..." onChange={e => this.setName(e)} style={{color:this.state.color}} required></input>
                    <input className="colorPicker" id="colorpicker" onChange={e => this.setColor()} type="color"></input>
                    <div className="colorPickerWrapper" style={{backgroundColor: this.state.color}}></div>
                    <button className="tabCancel" id="tabcancel" type="button" onClick={e => this.viewTab()}><img className="submitTabImg" src="cancel.png" id="tabcancelimg"></img></button>
                    <button className="tabSubmit" id="tabsubmit" type="submit"><img className="submitTabImg" src="checkmark.png" id="tabsubmitimg"></img></button>
                </form>
            </div>
        );
    }
}