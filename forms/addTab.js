import React from 'react';

class AddTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name : "", 
            color : "",
        };
        //this.submitForm = this.submitForm.bind(this);
    }
    
    setName(event) {
        this.setState({name: event.target.value});
    }
    setColor(event) {
        this.setState({link: event.target.value});
    }

    async submitForm(event) {
        event.preventDefault();
        this.props.addNewTab({
            name: this.state.name,
            link: this.state.color,
        });
        closeAddTab();
    }

    render () {
        return (
            <div className="addTabForm" id="AddTabDiv">
                <form id="addTabForm" onSubmit={this.submitForm}>
                    <label><b>Name </b></label>
                    <input type="text" name="linkName" onChange={e =>this.setName(e)} required/>
                    <br/>
                    <label><b>Color </b></label>
                    <input type="text" name="link" onChange={e => this.setColor(e)} required/>
                    <br/>

                    <button type="submit" className="submit">Submit</button>
                    <button type="button" className="submit" onClick={closeAddTab}>Close</button>
                </form>
            </div>
        );
    }
}

function closeAddTab() {
    document.getElementById("AddTabDiv").style.height = "0";
    document.getElementById("AddTabDiv").style.opacity = "0";
    document.getElementById("shadow").style.opacity = "0";
    document.getElementById("shadow").style.height = "0";
    document.getElementById("addTabForm").reset();
    window.formOpen = false;
}

export default AddTab;