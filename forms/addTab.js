import React from 'react';

class AddTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name : "", 
            color : "black",
        };
        this.submitForm = this.submitForm.bind(this);
    }
    
    setName(event) {
        this.setState({name: event.target.value});
    }
    async setColor() {
        this.setState({color: await document.getElementById("colorpicker").value})
    }

    async submitForm(event) {
        event.preventDefault();
        var newTab = ({
            name: this.state.name,
            link: this.state.color,
        });
        this.viewTab();
    }

    viewTab() {
        document.getElementById("addtabdiv").classList.toggle("active");
        document.getElementById("addtabplus").classList.toggle("active");
        document.getElementById("tabinput").classList.toggle("active");
        document.getElementById("colorpicker").classList.toggle("active");
        document.getElementById("tabcancel").classList.toggle("active");
        document.getElementById("tabsubmit").classList.toggle("active");
        document.getElementById("addtabform").reset();
        window.formOpen = false;
        this.setState({color:"black"})
    }

    render () {
        return (
            <div className="addTabDiv" id="addtabdiv">
                <img className="addTabPlus active" id="addtabplus" src="plus.png" onClick={e => this.viewTab()}></img>
                <form className="addTabForm" id="addtabform" onSubmit={this.submitForm}>
                    <input className="tabInput" id="tabinput" maxLength="20" type="text" placeholder="Tab Name" style={{color:this.state.color}}></input>
                    <input className="colorPicker" id="colorpicker" onChange={e => this.setColor()} type="color"></input>
                    <button className="tabCancel" id="tabcancel" type="button" onClick={e => this.viewTab()}>Cancel</button>
                    <button className="tabSubmit" id="tabsubmit" type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default AddTab;