import React from 'react';
import {database} from "../tools/database.js";
import {firebase} from "../tools/config.js"

class AddLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name : "", 
            link : "", 
            image : "",
            uid : this.props.userId
        };
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {uid : props.userId}
    }
    
    setName(event) {
        this.setState({name: event.target.value});
    }
    setLink(event) {
        this.setState({link: event.target.value});
    }
    setImage(event) {
        this.setState({image: event.target.value});
    }

    async submitForm(event) {
        event.preventDefault();
        var newLink = {
            name: this.state.name,
            link: this.state.link,
            image: this.state.image,
        };
        await firebase.database().ref(this.state.uid + '/').set(newLink)
        closeAddForm();
    }

    render () {
        return (
            <div className="addForm" id="AddFormDiv">
                <form id="addFormDiv" onSubmit={this.submitForm}>
                    <h1> Add a New Link </h1>
                    <label><b>Name</b></label>
                    <input type="text" name="linkName" onChange={e =>this.setName(e)} required/>

                    <label><b>Link</b></label>
                    <input type="text" name="link" onChange={e => this.setLink(e)} required/>

                    <label><b>Image</b></label>
                    <input type="text" name="image" onChange={e => this.setImage(e)} required/>

                    <button type="submit" className="submit">Submit</button>
                    <button type="button" className="submit" onClick={closeAddForm}>Close</button>
                </form>
            </div>
        );
    }
}

function closeAddForm() {
    document.getElementById("AddFormDiv").style.height = "0";
    document.getElementById("AddFormDiv").style.opacity = "0";
    document.getElementById("shadow").style.opacity = "0";
    document.getElementById("shadow").style.height = "0";
    document.getElementById("addFormDiv").reset();
    window.formOpen = false;
}

export default AddLink;