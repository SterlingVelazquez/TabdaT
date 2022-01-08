import React from 'react';
import { database } from "../tools/database.js";

var key=0;

export class EditLink extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.currLink.name !== "") {
            this.state = {
                name : this.props.currLink.name, 
                link : this.props.currLink.link, 
                image : this.props.currLink.image,
                defaultImg: this.props.currLink.name.charAt(0).match(/[A-Z]/i) ? "ultafedIgm/" + props.currLink.name.charAt(0).toUpperCase() + ".png" : "ultafedIgm/doggo.png",
                imageAddress: "",
                suggestions: this.props.suggestions,
                suggestedTitle: [],
                suggestedLinks: [],
                tabs: this.props.tabs,
                currTab: this.props.currTab,
                newTab: null,
                allLinks : this.props.allLinks
            };
        } else {
            this.state = {
                name : "",
                link : "",
                image : "",
                defaultImg: "ultafedIgm/doggo.png",
                imageAddress: "",
                suggestions: this.props.suggestions,
                suggestedTitle: [],
                suggestedLinks: [],
                tabs: this.props.tabs,
                currTab: this.props.currTab,
                newTab: null,
                allLinks : this.props.allLinks,
                suggestions: props.suggestions,
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
                    defaultImg: props.currLink.name.charAt(0).match(/[A-Z]/i) ? "ultafedIgm/" + props.currLink.name.charAt(0).toUpperCase() + ".png" : "ultafedIgm/doggo.png",
                    imageAddress: "",
                    tabs: props.tabs,
                    currTab: props.currTab,
                    allLinks : props.allLinks,
                    suggestions: props.suggestions,
                }
            } else if (typeof props.currLink.ref !== "undefined") {
                return {
                    name: props.currLink.name,
                    link: props.currLink.link,
                    image: props.currLink.image,
                    defaultImg: props.currLink.name.charAt(0).match(/[A-Z]/i) ? "ultafedIgm/" + props.currLink.name.charAt(0).toUpperCase() + ".png" : "ultafedIgm/doggo.png",
                    imageAddress: "",
                    tabs: props.tabs,
                    currTab: props.currTab,
                    allLinks : props.allLinks,
                    suggestions: props.suggestions,
                }
            } else {
                return {
                    name: props.currLink.name,
                    link: props.currLink.link,
                    image: "arrow.png",
                    defaultImg: props.currLink.name.charAt(0).match(/[A-Z]/i) ? "ultafedIgm/" + props.currLink.name.charAt(0).toUpperCase() + ".png" : "ultafedIgm/doggo.png",
                    imageAddress: props.currLink.image,
                    tabs: props.tabs,
                    currTab: props.currTab,
                    allLinks : props.allLinks,
                    suggestions: props.suggestions,
                }
            }
        }
        return null;
    }

    async setName(event, isDefault) {
        event.persist();
        if (this.state.suggestedLinks.length > 0) 
            this.setState({suggestedLinks: []})
        if (!isDefault) {
            var count = 0;
            if (event.target.value !== "" && event.target.value.charAt(0).match(/[A-Z]/i) && this.state.defaultImg.includes("ultafedIgm/")) {
                this.setState({
                    name: event.target.value,
                    suggestedTitle: event.target.value !== "" ? await database.stringSearch(event.target.value, this.state.suggestions, 0.65, false) : [],
                    defaultImg: "ultafedIgm/" + event.target.value.charAt(0).toUpperCase() + ".png"
                })
            } else if (this.state.defaultImg.includes("ultafedIgm/")) {
                this.setState({
                    name: event.target.value,
                    suggestedTitle: event.target.value !== "" ? await database.stringSearch(event.target.value, this.state.suggestions, 0.65, false) : [],
                    defaultImg: "ultafedIgm/doggo.png"
                })
            } else {
                this.setState({
                    name: event.target.value,
                    suggestedTitle: event.target.value !== "" ? await database.stringSearch(event.target.value, this.state.suggestions, 0.65, false) : [],
                })
            }
            for (var i = 0; i < this.state.allLinks.length; i++) {
                if (event.target.value === this.state.allLinks[i].name && event.target.value !== this.props.currLink.name)
                    count++;
            }
            if (count !== 0) {
                document.getElementById("titleerrmsg2").style.display = "block"
            } else {
                document.getElementById("titleerrmsg2").style.display = "none"
            }
            if (event.target.value.includes('/') || event.target.value.includes('.') || event.target.value.includes('#') || event.target.value.includes('$')
                || event.target.value.includes('[') || event.target.value.includes(']')) {
                document.getElementById("errmsg2").style.display = "block";
            } else {
                document.getElementById("errmsg2").style.display = "none";
            }
        } else {
            document.getElementById("edittitle").value = isDefault.name;
            document.getElementById("editurl").value = isDefault.url;
            this.setState({
                name: isDefault.name,
                link: isDefault.url,
                imageAddress: isDefault.image,
                suggestedTitle: [],
            })
            document.getElementById("edittitle").focus();
            this.toggleURL();
        }
    }
    async setLink(event, isDefault) {
        if (this.state.suggestedTitle.length > 0) 
            this.setState({suggestedTitle: []})
        if (!isDefault) {
            var count = 0;
            for (var i = 0; i < this.state.suggestions.length; i++) {
                if (event.target.value.includes(this.state.suggestions[i].url)) {
                    this.setState({defaultImg: this.state.suggestions[i].image})
                    count++;
                    i = this.state.suggestions.length;
                }
            }
            if (count === 0) {
                this.setState({
                    defaultImg: this.state.name !== null && this.state.name.charAt(0).match(/[A-Z]/i) ? 
                        "ultafedIgm/" + this.state.name.charAt(0).toUpperCase() + ".png" : "ultafedIgm/doggo.png",
                })
            }
            this.setState({
                link: event.target.value,
                suggestedLinks: event.target.value !== "" ? await database.stringSearch(event.target.value, this.state.suggestions, 0.65, true) : [],
            })
        } else {
            document.getElementById("editurl").value = isDefault.url;
            this.setState({
                link: isDefault.url,
                imageAddress: isDefault.image,
                suggestedLinks: [],
            })
            document.getElementById("editurl").focus();
            this.toggleURL()
        }
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
                if (!document.getElementById("uploadimg2").className.includes("active"))
                    this.toggleDefault(false);
            }
        })
    }
    setImageAddress(event) {
        this.setState({imageAddress: event.target.value})
        this.toggleURL();
    }
    setNewTab(tabName) {
        if (tabName !== this.state.newTab)
            this.setState({newTab: tabName})
    }

    toggleDefault(isDefault) {
        if (document.getElementById("imageaddress2").className.includes("active")) {
            document.getElementById("previewbox2").classList.toggle("active");
            document.getElementById("imageaddress2").classList.toggle("active");
        }
        if (isDefault) {
            if (!document.getElementById("defaultimg2").className.includes("active"))
                document.getElementById("defaultimg2").classList.toggle("active");
            if (document.getElementById("uploadimg2").className.includes("active"))
                document.getElementById("uploadimg2").classList.toggle("active");
        } else {
            if (document.getElementById("defaultimg2").className.includes("active"))
                document.getElementById("defaultimg2").classList.toggle("active");
            if (!document.getElementById("uploadimg2").className.includes("active"))
                document.getElementById("uploadimg2").classList.toggle("active");
        }
    }
    toggleURL() {
        if (!document.getElementById("imageaddress2").className.includes("active")) {
            document.getElementById("imageaddress2").classList.toggle("active");
            document.getElementById("previewbox2").classList.toggle("active");
        }
        if (document.getElementById("defaultimg2").className.includes("active"))
            document.getElementById("defaultimg2").classList.toggle("active");
        if (document.getElementById("uploadimg2").className.includes("active"))
            document.getElementById("uploadimg2").classList.toggle("active");
    }
    toggleTabActive(e) {
        e.stopPropagation();
        document.getElementById("selecttab2").classList.toggle("active") 
    }
    clearImg() {
        document.getElementById("imageaddressinput2").value = "";
        this.setState({imageAddress: ""});
        this.toggleDefault(true);
    }
    closeSuggestions() {
        this.setState({
            suggestedTitle: [],
            suggestedLinks: []
        })
        if (document.getElementById("selecttab2").className.includes("active"))
            document.getElementById("selecttab2").classList.toggle("active")
    }

    async submitForm(event) {
        event.preventDefault();
        if (this.state.name === this.props.currLink.name && this.state.link === this.props.currLink.link && (this.state.newTab === this.props.currLink.tab || this.state.newTab === null) &&
            ((document.getElementById("defaultimg2").className.includes("active") && this.state.defaultImg === this.props.currLink.image) ||
                (document.getElementById("uploadimg2").className.includes("active") && this.state.image === this.props.currLink.image) || 
                    (document.getElementById("imageaddress2").className.includes("active") && this.state.imageAddress === this.props.currLink.image))) {
            this.closeEditForm();
        } else {
            var newLink = {
                name: this.state.name,
                link: this.state.link,
                image: document.getElementById("uploadimg2").className.includes("active") && this.state.image !== "arrow.png" ? this.state.image : (
                    document.getElementById("imageaddress2").className.includes("active") && this.state.imageAddress !== "" ? this.state.imageAddress : this.state.defaultImg),
                tab: this.state.newTab !== null ? this.state.newTab : this.state.currTab
            };
            if (!(newLink.link.includes("https://")) && !(newLink.link.includes("http://")))
                newLink.link = "http://" + newLink.link;
            if (newLink.image === this.props.currLink.image && typeof this.props.currLink.ref !== "undefined")
                newLink.ref = this.props.currLink.ref;
            if (newLink.name.includes('/') || newLink.name.includes('.') || newLink.name.includes('#') || newLink.name.includes('$')
                || newLink.name.includes('[') || newLink.name.includes(']')) {
                document.getElementById("errmsg2").style.display = "block";
            } else {
                var count = 0;
                for (var i = 0; i < this.state.allLinks.length; i++) {
                    if (newLink.name === this.state.allLinks[i].name && newLink.name !== this.props.currLink.name)
                        ++count;
                }
                if (count !== 0) {
                    document.getElementById("titleerrmsg2").style.display = "block"
                } else {
                    document.getElementById("imageaddressinput2").value = "";
                    this.props.editLink(newLink, false);
                    this.closeEditForm();
                }
            }
        }
    }

    async closeEditForm() {
        this.props.editLink("", true)
        document.getElementById("EditFormDiv").classList.toggle("active");
        document.getElementById("shadow").classList.toggle("active");
        document.getElementById("editFormDiv").reset();
        if (document.activeElement.id === "edittitle") {
            document.getElementById("edittitle").blur();
        } else if (document.activeElement.id === "editurl") {
            document.getElementById("editurl").blur();
        } else if (document.activeElement.id === "imageaddressinput2") {
            document.getElementById("imageaddressinput2").blur();
        }
        if (document.getElementById("selecttab2").className.includes("active"))
            document.getElementById("selecttab2").classList.toggle("active")
        window.formOpen = false;
        this.setState({
            name: "",
            link: "",
            image: "",
            defaultImg: "ultafedIgm/doggo.png",
            imageAddress: "",
            suggestedTitle: [],
            suggestedLinks: [],
            newTab: null
        })
        document.getElementById("errmsg2").style.display = "none";
        document.getElementById("titleerrmsg2").style.display = "none";
    }

    render () {
        return (
            <div className="addForm" id="EditFormDiv" onClick={e => this.closeSuggestions()}>
                <form id="editFormDiv" onSubmit={this.submitForm}>
                    <h1> EDIT LINK </h1>

                    <div className="selectTab" id="selecttab2">
                        <div className="selectTabChosen" id="selecttabchosen" onClick={e => this.toggleTabActive(e)}>
                            <div className="selectTabText" id="selecttabtext">{this.state.newTab !== null ? this.state.newTab : this.state.currTab}
                            <div className="selectTabArrow" id="selectTabArrow"></div></div>
                        </div>
                        <div className="selectTabDrop" id="selecttabdrop">
                            <ul className="selectTabList" id="selecttablist">
                                {
                                    this.state.tabs.map((each) => 
                                        <li className="selectTabItem" onClick={e => this.setNewTab(each.name)} key={key++}>{each.name}</li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>

                    <label><b>Title</b></label>
                    <input type="text" name="linkName" id="edittitle" defaultValue={this.state.name} onChange={e =>this.setName(e)} spellCheck="false" required/>
                    <p className="errMsg" id="errmsg2">Can't contain: . [ ] # $ /</p>
                    <p className="errMsg" id="titleerrmsg2" style={{right:"1rem"}}>You've already used that name</p>

                    <ul className="suggestionList" id="suggestiontitlelist2" style={{top:"18%"}}>
                        {
                            this.state.suggestedTitle.slice(0, 5).map( (each) => 
                                <button className="suggestionTitle" key={key++} value={each} onClick={e => this.setName(e, each)} onSubmit={e => this.setName(e, each)}>{each.name}
                                    <img className="suggestionImg" src={each.image}></img>
                                </button>
                            )
                        }
                    </ul>

                    <label><b>URL</b></label>
                    <input type="text" name="link" id="editurl" defaultValue={this.state.link} onChange={e => this.setLink(e, false)} spellCheck="false" required/>
                    
                    <ul className="suggestionList" id="suggestionlist2">
                        {
                            this.state.suggestedLinks.slice(0, 5).map( (each) => 
                                <button className="suggestionLink" key={key++} value={each} onClick={e => this.setLink(e, each)} onSubmit={e => this.setLink(e, each)}>{each.url}
                                    <img className="suggestionImg" src={each.image}></img>
                                </button>
                            )
                        }
                    </ul>

                    <div id="defaultimg2" onClick={e => this.toggleDefault(true)} className={this.state.defaultImg === this.props.currLink.image ? "imgContainer active" : "imgContainer"}>
                        <div className="defaultImg">
                            <img id="defaultimgedit" src={this.state.defaultImg} className="linkImgForm"></img>
                        </div>
                        <p className="imgLabel">Default</p>
                    </div>

                    <div onClick={e => this.toggleDefault(false)} id="uploadimg2" className={this.state.image === this.props.currLink.image ? "imgContainer active" : "imgContainer"}>
                        <div className="defaultImg">
                            <img id="outimage2" src={this.state.image} className="linkImgForm"></img>
                            <input onClick={e => this.setImage(e)} type="file" id="fileUploader2" className="addFile" accept="image/*"></input>
                        </div>
                        <p className="imgLabel">Upload</p>
                    </div>

                    <br/>
                    <label id="orLinkTextEdit"><b>OR</b></label>
                    <br/>
                    <label className={this.state.imageAddress !== "" ? "imageAddress active" : "imageAddress"} id="imageaddress2" onClick={e => this.toggleURL()}><b>Image URL</b></label>
                    <input type="text" className="imgAddressInput" id="imageaddressinput2" name="link" defaultValue={this.state.imageAddress} onChange={e => this.setImageAddress(e)} spellCheck="false"></input>

                    <div className={this.state.imageAddress !== "" ? "previewBox active" : "previewBox"} id="previewbox2">
                        <img src={this.state.imageAddress} style={{display:this.state.imageAddress !== "" ? "block" : "none"}}></img>
                    </div>
                    <button className="clearImg" id="clearimg2" type="button" style={{display: this.state.imageAddress !== "" && document.activeElement.id === "imageaddressinput2" ? "inline" : "none"}} onClick={e => this.clearImg()}>Clear</button>

                    <button type="submit" className="submit"><b>SUBMIT</b></button>
                    <img type="button" src="cancel.png" className="addLinkCancel" onClick={e => this.closeEditForm()}></img>
                </form>
            </div>
        );
    }
}