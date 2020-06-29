import React from 'react';

class EditLink extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.currLink.name !== "") {
            this.state = {
                name : this.props.currLink.name, 
                link : this.props.currLink.link, 
                image : this.props.currLink.image,
                defaultImg: "ultafedIgm/doggo.png",
            };
        } else {
            this.state = {
                name : "", 
                link : "", 
                image : "",
                defaultImg: "ultafedIgm/doggo.png",
            }
        }
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currLink.name !== "" && state.name === "" && state.link === "" && state.image == "") {
            if (props.currLink.image.includes("ultafedIgm/")) {
                return {
                    name: props.currLink.name,
                    link: props.currLink.link,
                    image: "arrow.png",
                    defaultImg: props.currLink.image,
                }
            } else {
                return {
                    name: props.currLink.name,
                    link: props.currLink.link,
                    image: props.currLink.image,
                    defaultImg: props.currLink.name.charAt(0).match(/[A-Z]/i) ? "ultafedIgm/" + props.currLink.name.charAt(0).toUpperCase() + ".png" :
                        "ultafedIgm/doggo.png",
                }
            }
        }
        return null;
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
            document.getElementById("errmsg2").style.display = "block";
        } else {
            document.getElementById("errmsg2").style.display = "none";
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
        if (this.state.name === this.props.currLink.name && this.state.link === this.props.currLink.link && 
            ((document.getElementById("defaultimg2").className === "imgContainer active" && this.state.defaultImg === this.props.currLink.image) ||
                (document.getElementById("uploadimg2").className === "imgContainer active" && this.state.image === this.props.currLink.image))) {
            this.closeEditForm();
        } else {
            var newLink = {
                name: this.state.name,
                link: this.state.link,
                image: document.getElementById("defaultimg2").className === "imgContainer active" ? this.state.defaultImg : this.state.image,
            };
            if (!(newLink.link.includes("https://")) && !(newLink.link.includes("http://")))
                newLink.link = "https://" + newLink.link;
            if (newLink.image === "arrow.png")
                newLink.image = this.state.defaultImg;
            if (newLink.name.includes('/') || newLink.name.includes('.') || newLink.name.includes('#') || newLink.name.includes('$')
                || newLink.name.includes('[') || newLink.name.includes(']')) {
                document.getElementById("errmsg2").style.display = "block";
            } else {
                this.props.editLink(newLink, false);
                this.closeEditForm();
            }
        }
    }

    async closeEditForm() {
        this.props.editLink("", true)
        document.getElementById("EditFormDiv").style.opacity = "0";
        document.getElementById("EditFormDiv").style.top = "-500px";
        document.getElementById("EditFormDiv").style.boxShadow = "0 0 0 rgb(246, 247, 253)";
        document.getElementById("shadow").style.opacity = "0";
        document.getElementById("shadow").style.height = "0";
        document.getElementById("editFormDiv").reset();
        window.formOpen = false;
        this.setState({
            name: "",
            link: "",
            image: "",
            defaultImg: "ultafedIgm/doggo.png"
        })
        document.getElementById("errmsg2").style.display = "none";
    }

    render () {
        return (
            <div className="addForm" id="EditFormDiv">
                <form id="editFormDiv" onSubmit={this.submitForm}>
                    <h1> EDIT LINK </h1>
                    <label><b>Title</b></label>
                    <input type="text" name="linkName" id="linkname" defaultValue={this.state.name} onChange={e =>this.setName(e)} spellCheck="false" required/>
                    <p className="errMsg" id="errmsg2">Can't contain: . [ ] # $ /</p>

                    <label><b>URL</b></label>
                    <input type="text" name="link" defaultValue={this.state.link} onChange={e => this.setLink(e)} spellCheck="false" required/>

                    <label style={{float:"none"}}><b>Image</b></label>
                    <br/>

                    <div id="defaultimg2" onClick={e => this.toggleDefault()} className={this.state.defaultImg === this.props.currLink.image ? "imgContainer active" : "imgContainer"}>
                        <div className="defaultImg">
                            <img id="defaultimgedit" src={this.state.defaultImg} className="linkImgForm"></img>
                        </div>
                        <p className="imgLabel">Default</p>
                    </div>

                    <div onClick={e => this.toggleDefault()} id="uploadimg2" className={this.state.defaultImg === this.props.currLink.image ? "imgContainer" : "imgContainer active"}>
                        <input onClick={e => this.setImage(e)} type="file" id="fileUploader2" className="addFile" accept="image/*"></input>
                            <div className="defaultImg">
                                <img id="outimage2" src={this.state.image} className="linkImgForm"></img>
                            </div>
                        <p className="imgLabel">Upload</p>
                    </div>

                    <button type="submit" className="submit"><b>SUBMIT</b></button>
                    <img type="button" src="cancel.png" className="addLinkCancel" onClick={e => this.closeEditForm()}></img>
                </form>
            </div>
        );
    }
}

export default EditLink;