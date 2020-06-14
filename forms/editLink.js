import React from 'react';

class EditLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name : null, 
            link : null, 
            image : null,
            currLink : this.props.currLink,
            defaultImg: "ultafedIgm/doggo.png",
        };
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            currLink : props.currLink
        }
    }

    setName(event) {
        if (event.target.value !== "") {
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
    }
    setLink(event) {
        this.setState({link: event.target.value});
    }
    setImage(event) {
        event.stopPropagation();
        document.getElementById("fileUploader2").addEventListener('change', async (event) => {
            if (event.target.files.length !== 0) {
                var files = event.target.files, reader = new FileReader();
                reader.onload = function () {
                    document.getElementById("outimage2").src = reader.result;
                }
                this.setState({image: files[0]})
                reader.readAsDataURL(files[0])
                if (document.getElementById("uploadimg2").className !== "imgContainer active")
                    this.toggleDefault();
            }
        })
    }

    toggleDefault() {
        document.getElementById("defaultimg2").classList.toggle("active");
        document.getElementById("uploadimg2").classList.toggle("active");
    }

    async submitForm(event) {
        event.preventDefault();
        if (this.state.name === null && this.state.link === null && this.state.image === null) {
            this.closeEditForm();
        } else {
            var newLink = {
                name: this.state.name === null ? this.state.currLink.name : this.state.name,
                link: this.state.link === null ? this.state.currLink.link : this.state.link,
                image: this.state.image === null ? this.state.currLink.image : this.state.image,
            };
            if (document.getElementById("defaultimg2").className === "imgContainer active" && (!(newLink.image.includes("ultafedIgm/")))) {
                newLink.image = this.state.defaultImg;
                console.log(newLink.image)
            }
            this.props.editLink(newLink);
            this.closeEditForm();
        }
    }

    async closeEditForm() {
        document.getElementById("EditFormDiv").style.opacity = "0";
        document.getElementById("EditFormDiv").style.top = "-500px";
        document.getElementById("EditFormDiv").style.boxShadow = "0 0 0 rgb(246, 247, 253)";
        document.getElementById("shadow").style.opacity = "0";
        document.getElementById("shadow").style.height = "0";
        document.getElementById("editFormDiv").reset();
        window.formOpen = false;
        this.setState({
            image: null,
            defaultImg: "ultafedIgm/doggo.png"
        })
    }

    render () {
        return (
            <div className="addForm" id="EditFormDiv">
                <form id="editFormDiv" onSubmit={this.submitForm}>
                    <h1> EDIT LINK </h1>
                    <label><b>Title</b></label>
                    <input type="text" name="linkName" defaultValue={this.state.currLink.name} onChange={e =>this.setName(e)} required/>

                    <label><b>URL</b></label>
                    <input type="text" name="link" defaultValue={this.state.currLink.link} onChange={e => this.setLink(e)} required/>

                    <label style={{float:"none"}}><b>Image</b></label>
                    <br/>

                    <div id="defaultimg2" onClick={e => this.toggleDefault()} className={this.state.currLink.image.includes("ultafedIgm/") ? "imgContainer active" : "imgContainer"}>
                        <div className="defaultImg">
                            <img src={this.state.currLink.image.includes("ultafedIgm/") ? this.state.currLink.image : this.state.defaultImg}></img>
                        </div>
                        <p className="imgLabel">Default</p>
                    </div>

                    <div onClick={e => this.toggleDefault()} id="uploadimg2" className={this.state.currLink.image.includes("ultafedIgm/") ? "imgContainer" : "imgContainer active"}>
                        <input onClick={e => this.setImage(e)} type="file" id="fileUploader2" className="addFile" accept="image/*"></input>
                            <div className="defaultImg">
                                <img id="outimage2" src={this.state.currLink.image.includes("ultafedIgm/") ? "arrow.png" : this.state.currLink.image}></img>
                            </div>
                        <p className="imgLabel">Upload</p>
                    </div>

                    <button type="submit" className="submit"><b>SUBMIT</b></button>
                    <img type="button" src="cancel.png" className="submit" onClick={e => this.closeEditForm()}></img>
                </form>
            </div>
        );
    }
}

export default EditLink;