import React from 'react';

class EditTab extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.currTab.name !== "") {
            this.state = {
                name : this.props.currTab.name, 
                color : this.props.currTab.color, 
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
            }
        }
        return null;
    }

    setName(event) {
        this.setState({name: event.target.value});
        if (event.target.value.includes('/') || event.target.value.includes('.') || event.target.value.includes('#') || event.target.value.includes('$')
            || event.target.value.includes('[') || event.target.value.includes(']')) {
            document.getElementById("taberrmsg2").style.display = "block";
        } else {
            document.getElementById("taberrmsg2").style.display = "none";
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
                this.props.editTab(newTab, false);
                this.viewTab();
            }
        }
    }

    viewTab() {
        this.props.editTab("", true);
        document.getElementById("buttonnav").classList.toggle("focus");
        document.getElementById("edittabdiv").classList.toggle("active");
        document.getElementById("tabinput2").classList.toggle("active");
        document.getElementById("colorpicker2").classList.toggle("active");
        document.getElementById("tabcancel2").classList.toggle("active");
        document.getElementById("tabsubmit2").classList.toggle("active");
        document.getElementById("taberrmsg2").style.display = "none";
        if (!(document.getElementById("addtabdiv").className.includes("active"))) {
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
                    <input className="tabInput" id="tabinput2" type="text" onChange={e => this.setName(e)} spellCheck="false" style={{color:this.state.color}}></input>
                    <input className="colorPicker" id="colorpicker2" onChange={e => this.setColor()} type="color"></input>
                    <button className="tabCancel" id="tabcancel2" type="button" onClick={e => this.viewTab()}>Cancel</button>
                    <button className="tabSubmit" id="tabsubmit2" type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default EditTab;