import React from 'react';

export class EditTab extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.currTab.name !== "") {
            this.state = {
                name : this.props.currTab.name, 
                color : this.props.currTab.color,
                tabs: this.props.tabs,
                preferences: this.props.preferences,
            }
        } else {
            this.state = {
                name : "", 
                color : "", 
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
        this.setState({name: event.target.value});
        if (event.target.value.includes('/') || event.target.value.includes('.') || event.target.value.includes('#') || event.target.value.includes('$')
            || event.target.value.includes('[') || event.target.value.includes(']')) {
            document.getElementById("taberrmsg2").style.display = "block";
        } else {
            document.getElementById("taberrmsg2").style.display = "none";
        }
        for (var i = 0; i < this.state.tabs.length; i++) {
            if (event.target.value === this.state.tabs[i].name && event.target.value !== this.props.currTab.name)
                count++;
        }
        if (count !== 0) {
            document.getElementById("titletaberrmsg2").style.display = "block";
        } else {
            document.getElementById("titletaberrmsg2").style.display = "none";
        }
    }
    async setColor() {
        this.setState({color: await document.getElementById("colorpicker2").value})
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
                document.getElementById("taberrmsg2").style.display = "block";
            } else {
                var count = 0;
                for (var i = 0; i < this.state.tabs.length; i++) {
                    if (newTab.name === this.state.tabs[i].name && newTab.name !== this.props.currTab.name)
                        count++;
                }
                if (count !== 0) {
                    document.getElementById("titletaberrmsg2").style.display = "block";
                } else {
                    this.props.editTab(newTab, false);
                    this.viewTab();
                }
            }
        }
    }

    viewTab() {
        this.props.editTab("", true);
        document.getElementById("buttonnav").classList.toggle("focus");
        document.getElementById("edittabdiv").classList.toggle("active");
        document.getElementById("taberrmsg2").style.display = "none";
        document.getElementById("titletaberrmsg2").style.display = "none";
        if (!(document.getElementById("addtabdiv").className.includes("active"))) {
            if (!this.state.preferences.addTab)
                document.getElementById("addtabplus").classList.toggle("active");
            document.getElementById("lefttabarrow").classList.toggle("active");
            document.getElementById("righttabarrow").classList.toggle("active");
        }
        window.formOpen = false;
        this.setState({
            name: "",
            color: ""
        })
    } 

    render () {
        return (
            <div className="addTabDiv" id="edittabdiv" style={{top:"0"}}>
                <form className="addTabForm" id="edittabform" onSubmit={this.submitForm}>
                    <p className="tabErrMsg" id="taberrmsg2">Can't contain: . [ ] # $ /</p>
                    <p className="tabErrMsg" id="titletaberrmsg2" style={{left:"3.5rem"}}>Name taken</p>
                    <input className="tabInput" id="tabinput2" type="text" onChange={e => this.setName(e)} spellCheck="false" style={{color:this.state.color}} required></input>
                    <input className="colorPicker" id="colorpicker2" onChange={e => this.setColor()} type="color"></input>
                    <button className="tabCancel" id="tabcancel2" type="button" onClick={e => this.viewTab()}>Cancel</button>
                    <button className="tabSubmit" id="tabsubmit2" type="submit">Submit</button>
                </form>
            </div>
        );
    }
}