import React from 'react';

class AddTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name : "", 
            color : "#000000",
            user: this.props.isUser,
            numTabs: this.props.numTabs,
        };
        this.submitForm = this.submitForm.bind(this);
    }
    
    static getDerivedStateFromProps(props) {
        return {
            user : props.isUser,
            numTabs: props.numTabs
        }
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
            color: this.state.color,
        });
        this.props.addTab(newTab);
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
        this.setState({color:"#000000"})
    }

    render () {
        return (
            <div className="addTabDiv" id="addtabdiv" style={this.state.user === "default" ? {display:"none"} : {display:"inline-flex"}}>
                <img className="addTabPlus active" id="addtabplus" src="plus.png" onClick={e => this.viewTab()}
                    style={{marginLeft: this.state.numTabs % 4 === 0 ? "-8px" : "60px"}}></img>
                <form className="addTabForm" id="addtabform" onSubmit={this.submitForm}>
                    <input className="tabInput" id="tabinput" type="text" placeholder="Tab Name" onChange={e => this.setName(e)} style={{color:this.state.color}} required></input>
                    <input className="colorPicker" id="colorpicker" onChange={e => this.setColor()} type="color"></input>
                    <button className="tabCancel" id="tabcancel" type="button" onClick={e => this.viewTab()}>Cancel</button>
                    <button className="tabSubmit" id="tabsubmit" type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

export default AddTab;