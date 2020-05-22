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
            uid : this.props.userId,
            selectedTab : this.props.currTab,
        };
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            uid : props.userId,
            selectedTab : props.currTab
            }
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
                    <h1> ADD NEW LINK </h1>
                    <label><b>Title</b></label>
                    <input type="text" name="linkName" onChange={e =>this.setName(e)} required/>

                    <label><b>URL</b></label>
                    <input type="text" name="link" onChange={e => this.setLink(e)} required/>

                    <label style={{float:"none"}}><b>Image</b></label>
                    <br/>

                    <button type="submit" className="submit"><b>SUBMIT</b></button>
                    <img src="x.png" className="submit" onClick={closeAddForm}></img>
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