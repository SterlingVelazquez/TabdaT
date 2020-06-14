import React from 'react';

class EditTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name : null,
            color: null,
            currName : this.props.currTab.name 
        };
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            currName : props.currTab.name,
        }
    }

    setName(event) {
        this.setState({name: event.target.value});
    }
    async setColor() {
        this.setState({color: await document.getElementById("colorpicker2").value})
    }

    async submitForm(event) {
        event.preventDefault();
        if ((this.state.name === null || this.state.name === this.state.currName) && this.state.color === null) {
            this.viewTab();
        } else {
            var newTab = ({
                name: this.state.name === null ? this.state.currTab.name : this.state.name,
                color: document.getElementById("colorpicker2").value
            });
            this.props.editTab(newTab);
            this.viewTab();
        }
    }

    viewTab() {
        document.getElementById("buttonnav").classList.toggle("focus");
        document.getElementById("edittabdiv").classList.toggle("active");
        document.getElementById("addtabplus").classList.toggle("active");
        document.getElementById("tabinput2").classList.toggle("active");
        document.getElementById("colorpicker2").classList.toggle("active");
        document.getElementById("tabcancel2").classList.toggle("active");
        document.getElementById("tabsubmit2").classList.toggle("active");
        window.formOpen = false;
    } 

    render () {
        return (
            <div className="addTabDiv" id="edittabdiv" style={{top:"0"}}>
                <form className="addTabForm" id="edittabform" onSubmit={this.submitForm}>
                    <input className="tabInput" id="tabinput2" type="text" onChange={e => this.setName(e)} style={{color:this.state.color}}></input>
                    <input className="colorPicker" id="colorpicker2" onChange={e => this.setColor()} type="color"></input>
                    <button className="tabCancel" id="tabcancel2" type="button" onClick={e => this.viewTab()}>Cancel</button>
                    <button className="tabSubmit" id="tabsubmit2" type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default EditTab;