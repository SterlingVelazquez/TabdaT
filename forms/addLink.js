import React from 'react';

class AddLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name : null, 
            link : null, 
            image : null,
            defaultImg: "ultafedIgm/doggo.png",
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
        if (event.target.value !== "" && event.target.value.charAt(0).match(/[A-Z]/i)) {
            this.setState({
                name: event.target.value,
                defaultImg: "ultafedIgm/" + event.target.value.charAt(0).toUpperCase() + ".png"
            })
        } else {
            this.setState({
                name: event.target.value,
                defaultImg: "ultafedIgm/doggo.png"
            })
        }
        if (event.target.value.includes('/') || event.target.value.includes('.') || event.target.value.includes('#') || event.target.value.includes('$')
            || event.target.value.includes('[') || event.target.value.includes(']')) {
            document.getElementById("errmsg").style.display = "block";
        } else {
            document.getElementById("errmsg").style.display = "none";
        }
    }
    setLink(event) {
        this.setState({link: event.target.value});
    }
    setImage(event) {
        event.stopPropagation();
        document.getElementById("fileUploader").addEventListener('change', async (event) => {
            if (event.target.files.length !== 0) {
                var files = event.target.files, reader = new FileReader();
                reader.onload = function () {
                    document.getElementById("outimage").src = reader.result;
                }
                this.setState({image: files[0]})
                reader.readAsDataURL(files[0])
                if (document.getElementById("uploadimg").className !== "imgContainer active")
                    this.toggleDefault();
            }
        })
    }

    toggleDefault() {
        document.getElementById("defaultimg").classList.toggle("active");
        document.getElementById("uploadimg").classList.toggle("active");
    }

    async submitForm(event) {
        event.preventDefault();
        var newLink = {
            name: this.state.name,
            link: this.state.link,
            image: this.state.image,
        };
        if (!(this.state.link.includes("https://")) && !(this.state.link.includes("http://")))
            newLink.link = "https://" + newLink.link;
        if (document.getElementById("defaultimg").className === "imgContainer active" || this.state.image === null)
            newLink.image = this.state.defaultImg;
        if (newLink.name.includes('/') || newLink.name.includes('.') || newLink.name.includes('#') || newLink.name.includes('$')
            || newLink.name.includes('[') || newLink.name.includes(']')) {
            document.getElementById("errmsg").style.display = "block";
        } else {
            this.props.addLink(newLink);
            this.closeAddForm();
        }
    }

    async closeAddForm() {
        document.getElementById("AddFormDiv").style.opacity = "0";
        document.getElementById("AddFormDiv").style.top = "-500px";
        document.getElementById("AddFormDiv").style.boxShadow = "0 0 0 rgb(246, 247, 253)";
        document.getElementById("shadow").style.opacity = "0";
        document.getElementById("shadow").style.height = "0";
        document.getElementById("addFormDiv").reset();
        window.formOpen = false;
        this.setState({
            name:null,
            link:null,
            image: null,
            defaultImg: "ultafedIgm/doggo.png"
        })
        if (document.getElementById("uploadimg").className === "imgContainer active") {
            this.toggleDefault();
        }
        document.getElementById("outimage").src = "arrow.png";
        document.getElementById("errmsg").style.display = "none";
    }

    render () {
        return (
            <div className="addForm" id="AddFormDiv">
                <form id="addFormDiv" onSubmit={this.submitForm}>
                    <h1> ADD NEW LINK </h1>
                    <label><b>Title</b></label>
                    <input type="text" name="linkName" onChange={e =>this.setName(e)} spellCheck="false" required/>
                    <p className="errMsg" id="errmsg">Can't contain: . [ ] # $ /</p>

                    <label><b>URL</b></label>
                    <input type="text" name="link" onChange={e => this.setLink(e)} spellCheck="false" required/>

                    <label style={{float:"none"}}><b>Image</b></label>
                    <br/>

                    <div id="defaultimg" onClick={e => this.toggleDefault()} className="imgContainer active">
                        <div className="defaultImg">
                            <img src={this.state.defaultImg} className="linkImgForm"></img>
                        </div>
                        <p className="imgLabel">Default</p>
                    </div>
                    
                    <div onClick={e => this.toggleDefault()} id="uploadimg" className="imgContainer">
                        <input onClick={e => this.setImage(e)} type="file" id="fileUploader" className="addFile" accept="image/*"></input>
                            <div className="defaultImg">
                                <img id="outimage" src="arrow.png" className="linkImgForm"></img>
                            </div>
                        <p className="imgLabel">Upload</p>
                    </div>

                    <button type="submit" className="submit"><b>SUBMIT</b></button>
                    <img type="button" src="cancel.png" className="addLinkCancel" onClick={e => this.closeAddForm()}></img>
                </form>
            </div>
        );
    }
}

export default AddLink;