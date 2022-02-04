import React from 'react';
import { database } from "../tools/database.js";

var key = 0;

export class AddLink extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            link: null,
            image: null,
            imageAddress: "",
            defaultImg: "ultafedIgm/doggo.png",
            suggestions: [],
            suggestedTitle: [],
            suggestedLinks: [],
            uid: this.props.userId,
            selectedTab: this.props.currTab,
            newTab: null,
            tabs: this.props.tabs,
            allLinks: this.props.allLinks
        };
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            uid: props.userId,
            selectedTab: props.currTab,
            tabs: props.tabs,
            allLinks: props.allLinks,
            suggestions: props.suggestions
        }
    }

    async setName(event, isDefault) {
        event.persist();
        if (this.state.suggestedLinks.length > 0)
            this.setState({ suggestedLinks: [] })
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
                if (event.target.value === this.state.allLinks[i].name)
                    count++;
            }
            if (count !== 0) {
                document.getElementById("titleerrmsg").style.display = "block"
            } else {
                document.getElementById("titleerrmsg").style.display = "none"
            }
            if (event.target.value.includes('/') || event.target.value.includes('.') || event.target.value.includes('#') || event.target.value.includes('$')
                || event.target.value.includes('[') || event.target.value.includes(']')) {
                document.getElementById("errmsg").style.display = "block";
            } else {
                document.getElementById("errmsg").style.display = "none";
            }
        } else {
            document.getElementById("addtitle").value = isDefault.name;
            document.getElementById("addurl").value = isDefault.url;
            this.setState({
                name: isDefault.name,
                link: isDefault.url,
                imageAddress: isDefault.image,
                suggestedTitle: [],
            })
            document.getElementById("addtitle").focus();
            this.toggleURL();
        }
    }
    async setLink(event, isDefault) {
        if (this.state.suggestedTitle.length > 0)
            this.setState({ suggestedTitle: [] })
        if (!isDefault) {
            var count = 0;
            for (var i = 0; i < this.state.suggestions.length; i++) {
                if (event.target.value.includes(this.state.suggestions[i].url)) {
                    this.setState({ imageAddress: this.state.suggestions[i].image })
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
            document.getElementById("addurl").value = isDefault.url;
            this.setState({
                link: isDefault.url,
                imageAddress: isDefault.image,
                suggestedLinks: [],
            })
            document.getElementById("addurl").focus();
            this.toggleURL()
        }
    }
    setImage(event) {
        event.stopPropagation();
        document.getElementById("fileUploader").addEventListener('change', async (event) => {
            if (event.target.files.length !== 0) {
                var files = event.target.files, reader = new FileReader();
                reader.onload = function () {
                    document.getElementById("outimage").src = reader.result;
                }
                this.setState({ image: files[0] })
                reader.readAsDataURL(files[0])
                if (!document.getElementById("uploadimg").className.includes("active"))
                    this.toggleDefault();
            }
        })
    }
    setImageAddress(event) {
        this.setState({ imageAddress: event.target.value })
        this.toggleURL();
    }
    setNewTab(tabName) {
        if (tabName !== this.state.newTab)
            this.setState({ newTab: tabName })
    }

    toggleDefault(isDefault) {
        if (document.getElementById("imageaddress").className === "imageAddress active") {
            document.getElementById("previewbox").classList.toggle("active");
            document.getElementById("imageaddress").classList.toggle("active")
        }
        if (isDefault) {
            if (!document.getElementById("defaultimg").className.includes("active"))
                document.getElementById("defaultimg").classList.toggle("active")
            if (document.getElementById("uploadimg").className.includes("active"))
                document.getElementById("uploadimg").classList.toggle("active")
        } else {
            if (document.getElementById("defaultimg").className.includes("active"))
                document.getElementById("defaultimg").classList.toggle("active")
            if (!document.getElementById("uploadimg").className.includes("active"))
                document.getElementById("uploadimg").classList.toggle("active")
        }
    }
    toggleURL() {
        if (!document.getElementById("imageaddress").className.includes("active")) {
            document.getElementById("previewbox").classList.toggle("active");
            document.getElementById("imageaddress").classList.toggle("active")
        }
        if (document.getElementById("defaultimg").className.includes("active"))
            document.getElementById("defaultimg").classList.toggle("active")
        if (document.getElementById("uploadimg").className.includes("active"))
            document.getElementById("uploadimg").classList.toggle("active")
    }
    toggleTabActive(e) {
        e.stopPropagation();
        document.getElementById("selecttab").classList.toggle("active")
    }
    clearImg() {
        document.getElementById("imageaddressinput").value = "";
        this.setState({ imageAddress: "" });
        this.toggleDefault(true);
    }
    closeSuggestions() {
        this.setState({
            suggestedTitle: [],
            suggestedLinks: []
        })
        if (document.getElementById("selecttab").className === "selectTab active")
            document.getElementById("selecttab").classList.toggle("active")
    }

    async submitForm(event) {
        event.preventDefault();
        var newLink = {
            name: this.state.name,
            link: this.state.link,
            image: document.getElementById("uploadimg").className.includes("active") && this.state.image !== "arrow.webp" ? this.state.image : (
                document.getElementById("imageaddress").className.includes("active") && this.state.imageAddress !== "" ? this.state.imageAddress : this.state.defaultImg),
            tab: this.state.newTab !== null ? this.state.newTab : this.state.selectedTab
        };
        if (!(this.state.link.includes("https://")) && !(this.state.link.includes("http://")))
            newLink.link = "http://" + newLink.link;
        if (newLink.name.includes('/') || newLink.name.includes('.') || newLink.name.includes('#') || newLink.name.includes('$')
            || newLink.name.includes('[') || newLink.name.includes(']')) {
            document.getElementById("errmsg").style.display = "block";
        } else {
            var count = 0;
            for (var i = 0; i < this.state.allLinks.length; i++) {
                if (newLink.name === this.state.allLinks[i].name)
                    ++count;
            }
            if (count !== 0) {
                document.getElementById("titleerrmsg").style.display = "block"
            } else {
                document.getElementById("imageaddressinput").value = "";
                this.props.addLink(newLink);
                this.closeAddForm();
            }
        }
    }

    async closeAddForm() {
        document.getElementById("addLinkForm").classList.toggle("active");
        document.getElementById("shadow").classList.toggle("active");
        document.getElementById("addFormDiv").reset();
        if (document.activeElement.id === "addtitle") {
            document.getElementById("addtitle").blur();
        } else if (document.activeElement.id === "addurl") {
            document.getElementById("addurl").blur();
        } else if (document.activeElement.id === "imageaddressinput") {
            document.getElementById("imageaddressinput").blur();
        }
        if (document.getElementById("selecttab").className === "selectTab active")
            document.getElementById("selecttab").classList.toggle("active")
        window.formOpen = false;
        this.setState({
            name: null,
            link: null,
            image: null,
            defaultImg: "ultafedIgm/doggo.png",
            imageAddress: "",
            suggestedTitle: [],
            suggestedLinks: [],
            newTab: null
        })
        this.toggleDefault(true);
        document.getElementById("outimage").src = "arrow.webp";
        document.getElementById("errmsg").style.display = "none";
        document.getElementById("titleerrmsg").style.display = "none";
    }

    render() {
        return (
            <div className="linkForm" id="addLinkForm" onClick={e => this.closeSuggestions()}>
                <form className="linkFormDiv" id="addFormDiv" onSubmit={this.submitForm}>
                    <h1> ADD NEW LINK </h1>

                    <div className="selectTab" id="selecttab">
                        <div className="selectTabChosen" id="selecttabchosen" onClick={e => this.toggleTabActive(e)}>
                            <div className="selectTabText" id="selecttabtext">{this.state.newTab !== null ? this.state.newTab : this.state.selectedTab}</div>
                            <div className="selectTabArrow" id="selectTabArrow"></div>
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
                    <input type="text" name="linkName" id="addtitle" onChange={e => this.setName(e, false)} spellCheck="false" required />
                    <p className="errMsg" id="errmsg">Can't contain: . [ ] # $ /</p>
                    <p className="errMsg" id="titleerrmsg" style={{ right: "1rem" }}>You've already used that name</p>

                    <label><b>URL</b></label>
                    <input type="text" name="link" className="addURL" id="addurl" onChange={e => this.setLink(e, false)} spellCheck="false" required />

                    <div id="defaultimg" onClick={e => this.toggleDefault(true)} className={this.state.imageAddress !== "" || this.state.image ? "imgContainer" : "imgContainer active"}>
                        <div className="defaultImg">
                            <img src={this.state.defaultImg} className="linkImgForm"></img>
                        </div>
                        <p className="imgLabel">Default</p>
                    </div>

                    <div onClick={e => this.toggleDefault(false)} id="uploadimg" className={this.state.image && this.state.imageAddress === "" ? "imgContainer active" : "imgContainer"}>
                        <div className="defaultImg">
                            <img id="outimage" src="arrow.webp" className="linkImgForm"></img>
                            <input onClick={e => this.setImage(e)} type="file" id="fileUploader" className="addFile" accept="image/*"></input>
                        </div>
                        <p className="imgLabel">Upload</p>
                    </div>

                    <br />
                    <label id="orLinkText"><b>OR</b></label>
                    <br />
                    <label className={this.state.imageAddress !== "" && !this.state.image ? "imageAddress active" : "imageAddress"} id="imageaddress" onClick={e => this.toggleURL()}><b>Image URL</b></label>
                    <input type="text" className="imgAddressInput" id="imageaddressinput" name="link" defaultValue={this.state.imageAddress} onChange={e => this.setImageAddress(e)} spellCheck="false"></input>

                    <button className="clearImg" id="clearimg" type="button" style={{ display: this.state.imageAddress !== "" && document.activeElement.id === "imageaddressinput" ? "inline" : "none" }} onClick={e => this.clearImg()}>Clear</button>

                    <button type="submit" className="submit"><b>SUBMIT</b></button>
                    <img type="button" src="cancel.webp" className="addLinkCancel" onClick={e => this.closeAddForm()}></img>
                </form>

                <div className="suggestionWrapper" id="suggestiontitlewrapper">
                    <ul className="suggestionList">
                        {
                            this.state.suggestedTitle.slice(0, 5).map((each) =>
                                <button className="suggestionTitle" key={key++} value={each} onClick={e => this.setName(e, each)} onSubmit={e => this.setName(e, each)}>{each.name}
                                    <img className="suggestionImg" src={each.image}></img>
                                </button>
                            )
                        }
                    </ul>
                </div>
                <div className="suggestionWrapper">
                    <ul className="suggestionList">
                        {
                            this.state.suggestedLinks.slice(0, 5).map((each) =>
                                <button className="suggestionLink" key={key++} value={each} onClick={e => this.setLink(e, each)} onSubmit={e => this.setLink(e, each)}>{each.url}
                                    <img className="suggestionImg" src={each.image}></img>
                                </button>
                            )
                        }
                    </ul>
                </div>

                <div className={this.state.imageAddress !== "" ? "previewBox active" : "previewBox"} id="previewbox">
                    <img src={this.state.imageAddress} style={{ display: this.state.imageAddress !== "" ? "block" : "none" }}></img>
                </div>
            </div>
        );
    }
}