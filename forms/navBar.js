export class NavBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultPreferences: {
                addLink: false,
                addTab: false,
                editBtn: false, 
                linkArrows: false,
                night: false,
                removeBtn: false,
                tabArrows: false, 
            },
            preferences: this.props.preferences,
            oldPreferences: this.props.oldPreferences,
            user : this.props.user,
            uid: this.props.uid
        };
    }

    static getDerivedStateFromProps(props) {
        return {
            oldPreferences: props.oldPreferences,
            preferences: props.preferences,
            user: props.user,
            uid: props.uid
        }
    }

    hideAddTab() {
        if (document.getElementsByClassName("addTabDiv active").length === 0)
            document.getElementById("addtabplus").classList.toggle("active");
        var hidePreferences = this.state.preferences;
        hidePreferences.addTab = !hidePreferences.addTab;
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }
    hideAddLink() {
        document.getElementById("addcontainer").classList.toggle("active");
        var hidePreferences = this.state.preferences;
        document.getElementById("erasebox").style.top = !hidePreferences.addLink ? "-2rem" : "0";
        document.getElementById("editbox").style.top = !hidePreferences.addLink ? "-2rem" : "0";
        document.getElementById("confirmerase").style.top = !hidePreferences.addLink ? "-2rem" : "0";
        hidePreferences.addLink = !hidePreferences.addLink;
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }
    hideEditBtn() {
        if (document.getElementById("editbox").className === "modBox focus")
            this.props.editActive();
        document.getElementById("editbox").classList.toggle("hide")
        var hidePreferences = this.state.preferences;
        if (!hidePreferences.editBtn) {
            document.getElementById("erasebox").style.marginLeft = "-4.1rem"
        } else {
            document.getElementById("erasebox").style.marginLeft = "1rem"
        }
        hidePreferences.editBtn = !hidePreferences.editBtn;
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }
    hideRemoveBtn() {
        if (document.getElementById("erasebox").className === "modBox active")
            this.props.eraseActive();
        document.getElementById("erasebox").classList.toggle("hide");
        document.getElementById("confirmerase").classList.toggle("hide");
        var hidePreferences = this.state.preferences;
        if (!hidePreferences.removeBtn) {
            document.getElementById("editbox").style.marginLeft = "6.2rem"
        } else {
            document.getElementById("editbox").style.marginLeft = "1rem"
        }
        hidePreferences.removeBtn = !hidePreferences.removeBtn;
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }
    hideTabArrows() {
        document.getElementById("lefttabarrow").classList.toggle("hide");
        document.getElementById("righttabarrow").classList.toggle("hide");
        var hidePreferences = this.state.preferences;
        hidePreferences.tabArrows = !hidePreferences.tabArrows;
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }
    hideLinkArrows() {
        document.getElementById("leftarrow").classList.toggle("hide");
        document.getElementById("rightarrow").classList.toggle("hide");
        var hidePreferences = this.state.preferences;
        hidePreferences.linkArrows = !hidePreferences.linkArrows;
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }
    async nightMode() {
        this.props.toggleNightMode();
        this.comparePreferences();
    }

    toggleActive(id) {
        document.getElementById(id).classList.toggle("active");
    }
    toggleSideMenu() {
        document.getElementById("navbar").classList.toggle("active");
        document.getElementById("sidemenubtn").classList.toggle("active");
        if (document.getElementById("resetconfirmbox").className.includes("active"))
            document.getElementById("resetconfirmbox").classList.toggle("active");
        if (document.getElementById("savebox").className.includes("active")) {
            document.getElementById("savebox").classList.toggle("active");
            document.getElementById("saveconfirm").classList.toggle("active");
            document.getElementById("shadow").classList.toggle("active");
        }
    }
    openImportLinks() {
        document.getElementById("bookmarkbox").classList.toggle("focus");
        document.getElementById("shadow").classList.toggle("active");
    }
    closeSave() {
        if (this.state.preferences.addLink !== this.state.oldPreferences.addLink) {
            this.hideAddLink();
        }
        if (this.state.preferences.addTab !== this.state.oldPreferences.addTab) {
            this.hideAddTab();
        }
        if (this.state.preferences.editBtn !== this.state.oldPreferences.editBtn) {
            this.hideEditBtn();
        }
        if (this.state.preferences.linkArrows !== this.state.oldPreferences.linkArrows) {
            this.hideLinkArrows();
        }
        if (this.state.preferences.night !== this.state.oldPreferences.night) {
            this.nightMode();
        }
        if (this.state.preferences.removeBtn !== this.state.oldPreferences.removeBtn) {
            this.hideRemoveBtn();
        }
        if (this.state.preferences.tabArrows !== this.state.oldPreferences.tabArrows) {
            this.hideTabArrows();
        }
        document.getElementById("saveconfirm").classList.toggle("active");
        document.getElementById("shadow").classList.toggle("active");
    }

    comparePreferences() {
        if (JSON.stringify(this.state.oldPreferences) !== JSON.stringify(this.state.preferences))
            document.getElementById("savebox").className = "saveBox active";
        else
            document.getElementById("savebox").className = "saveBox";
        if (JSON.stringify(this.state.defaultPreferences) !== JSON.stringify(this.state.preferences))
            document.getElementById("resetbox").className = "resetBox active";
        else {
            if (document.getElementById("resetconfirmbox").className.includes("active"))
                document.getElementById("resetconfirmbox").classList.toggle("active");
            document.getElementById("resetbox").className = "resetBox";
        }
    }
    savePreferences() {
        this.props.savePreferences();
        if (document.getElementById("savebox").className.includes("active"))
            document.getElementById("savebox").classList.toggle("active");
        if (document.getElementById("saveconfirm").className.includes("active")) {
            document.getElementById("saveconfirm").classList.toggle("active");
            document.getElementById("shadow").classList.toggle("active");
        }
    }

    render() {
        return (
            <div className="navBar" id="navbar">
                <p className="navTitle" id="navtitle">Options</p>
                <div className="sideSignIn" id="sidesignin" onClick={e => this.props.signIn()}>
                    <div className="rocketContainer">
                        <img src="rocket.png" className="rocket" id="rocket"></img>
                        <img src="flame.png" className="flame" id="flame"></img>
                    </div>
                    <p className="baseSignIn" id="basesignin"><b>Sign In</b> To Google To Unlock All Features</p>
                </div>
                <div className="sideMenuBtn" id="sidemenubtn" onClick={e => this.toggleSideMenu()}>
                    <div className="cancelBar"></div>
                    <div className="cancelBar"></div>
                    <div className="cancelBar"></div>
                </div>
                <div className="sideShadow" id="sideshadow" style={{pointerEvents: this.state.user === "default" ? "none" : "all", opacity: this.state.user === "default" ? "0.5" : "1"}}>
                    <div className="importBox" id="importbox" onClick={e => this.openImportLinks()}>
                        <p className="importText" id="importtext">Import Your Bookmarks</p>
                        <div className="arrow" id="arrow">
                            <div className="arrowBody"></div>
                            <div className="arrowHead"></div>
                            <div className="arrowHead"></div>
                        </div>
                        <div className="arrowBox">
                            <div className="boxBottom"></div>
                            <div className="boxSide"></div>
                            <div className="boxSide"></div>
                        </div>
                    </div>
                    <div className="sideContainer active" id="sidecontainershow">
                        <div className="sideContainerHeader" id="sidecontainerheader1" onClick={e => this.toggleActive("sidecontainershow")}>
                            <p className="sideHeader">Show / Hide Stuff</p>
                            <div className="sideHeaderArrow"></div>
                        </div>
                        <div className="sideOptions">
                            <div className="sideOptionContainer">
                                <p className="option">Add Tab Button</p>
                                <button className={this.state.preferences.addTab ? "switchContainer active" : "switchContainer"} 
                                    id="switchcontainer1" onClick={e => this.hideAddTab()} style={{pointerEvents: this.state.user === "default" ? "none" : "all", 
                                    transition: "background-color 0.5s, box-shadow 0.5s, right 0.5s, opacity 0.5s"}}>
                                    <div className="switch" id="switch1"></div>
                                </button>
                            </div>
                            <div className="sideOptionContainer">
                                <p className="option" style={{transitionDelay: "0.1s"}}>Add Link Button</p>
                                <button className={this.state.preferences.addLink ? "switchContainer active" : "switchContainer"} 
                                    id="switchcontainer2" onClick={e => this.hideAddLink()} style={{pointerEvents: this.state.user === "default" ? "none" : "all", 
                                    transition: "background-color 0.5s, box-shadow 0.5s, right 0.5s 0.1s, opacity 0.5s 0.1s"}}>
                                    <div className="switch" id="switch2"></div>
                                </button>
                            </div>
                            <div className="sideOptionContainer">
                                <p className="option" style={{transitionDelay: "0.2s"}}>Edit Button</p>
                                <button className={this.state.preferences.editBtn ? "switchContainer active" : "switchContainer"} 
                                    id="switchcontainer3" onClick={e => this.hideEditBtn()} style={{pointerEvents: this.state.user === "default" ? "none" : "all", 
                                    transition: "background-color 0.5s, box-shadow 0.5s, right 0.5s 0.2s, opacity 0.5s 0.2s"}} >
                                    <div className="switch" id="switch3"></div>
                                </button>
                            </div>
                            <div className="sideOptionContainer">
                                <p className="option" style={{transitionDelay: "0.3s"}}>Remove Button</p>
                                <button className={this.state.preferences.removeBtn ? "switchContainer active" : "switchContainer"} 
                                    id="switchcontainer4" onClick={e => this.hideRemoveBtn()} style={{pointerEvents: this.state.user === "default" ? "none" : "all", 
                                    transition: "background-color 0.5s, box-shadow 0.5s, right 0.5s 0.3s, opacity 0.5s 0.3s"}}>
                                    <div className="switch" id="switch4"></div>
                                </button>
                            </div>
                            <div className="sideOptionContainer">
                                <p className="option" style={{transitionDelay: "0.4s"}}>Tab Arrows</p>
                                <button className={this.state.preferences.tabArrows ? "switchContainer active" : "switchContainer"} 
                                    id="switchcontainer5" onClick={e => this.hideTabArrows()} style={{pointerEvents: this.state.user === "default" ? "none" : "all", 
                                    transition: "background-color 0.5s, box-shadow 0.5s, right 0.5s 0.4s, opacity 0.5s 0.4s"}}>
                                    <div className="switch" id="switch5"></div>
                                </button>
                            </div>
                            <div className="sideOptionContainer">
                                <p className="option" style={{transitionDelay: "0.5s"}}>Link Arrows</p>
                                <button className={this.state.preferences.linkArrows ? "switchContainer active" : "switchContainer"} 
                                    id="switchcontainer6" onClick={e => this.hideLinkArrows()} style={{pointerEvents: this.state.user === "default" ? "none" : "all", 
                                    transition: "background-color 0.5s, box-shadow 0.5s, right 0.5s 0.5s, opacity 0.5s 0.5s"}}>
                                    <div className="switch" id="switch6"></div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="resetBox" id="resetbox">
                        <p className="resetPreferences" id="resetpreferences" onClick={e => this.toggleActive("resetconfirmbox")}>Reset to Default Settings</p>
                        <div className="resetConfirmBox" id="resetconfirmbox">
                            <p className="resetConfirm" id="resetconfirm">Are you sure you want to reset all settings?</p>
                            <button className="resetBtn" onClick={e => this.toggleActive("resetconfirmbox")}><img className="resetCancel" src="cancel.png"></img></button>
                            <button className="resetBtn" onClick={e => this.resetPreferences()}><div className="resetCheck"></div></button>
                        </div>
                    </div>

                    <div className="saveBox" id="savebox" onClick={e => this.savePreferences()}>
                        <button className="saveBtn" id="savebtn">
                            <img className="saveImg" id="saveimg" src="save.png"></img>
                        </button>
                        <p className="saveText">Save</p>
                    </div>

                    <div className="saveConfirm" id="saveconfirm">
                        <p className="saveConfirmText" id="saveconfirmtext">Would you like to save your changes?</p>
                        <button className="saveConfirmBtn" onClick={e => this.closeSave()}><img className="saveConfirmImg" src="cancel.png"></img></button>
                        <button className="saveConfirmBtn" onClick={e => this.savePreferences()}><div className="saveCheck"></div></button>
                    </div>

                    <div className="sideNightContainer" id="sidenightcontainer">
                        <p className="sideNightLabel" id="sidelabel">Night Mode</p>
                        <button className="nightContainer" id="nightmodecontainer" onClick={e => this.nightMode()} style={{pointerEvents: this.state.user === "default" ? "none" : "all"}}>
                            <img src="sun.png" className="nightImg"></img>
                            <img src="moon.png" className="nightImg" style={{marginLeft:"20px"}}></img>
                            <div className="nightSwitch" id="nightswitch"></div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    async resetPreferences() {
        if (JSON.stringify(this.state.preferences) !== JSON.stringify(this.state.defaultPreferences)) {
            await this.props.setPreferences(JSON.parse(JSON.stringify(this.state.defaultPreferences)));
            await this.props.savePreferences();

            if (document.getElementById("container").className === "container focus")
                this.props.toggleNightMode();
            if (document.getElementById("addtabplus").className !== "addTabPlus active" && document.getElementsByClassName("addTabDiv active").length === 0)
                document.getElementById("addtabplus").classList.toggle("active");
            if (document.getElementById("addcontainer").className === "addContainer active") {  
                document.getElementById("addcontainer").classList.toggle("active");
                document.getElementById("erasebox").style.top = "0";
                document.getElementById("editbox").style.top = "0";
                document.getElementById("confirmerase").style.top = "0";
            }
            if (document.getElementById("editbox").className === "modBox hide") {
                document.getElementById("editbox").classList.toggle("hide")
                document.getElementById("erasebox").style.marginLeft = "1rem"
            }
            if (document.getElementById("erasebox").className === "modBox hide") {
                document.getElementById("erasebox").classList.toggle("hide");
                document.getElementById("confirmerase").classList.toggle("hide");
                document.getElementById("editbox").style.marginLeft = "1rem"
            }
            if (document.getElementById("lefttabarrow").className === "leftTabArrow hide") {
                document.getElementById("lefttabarrow").classList.toggle("hide");
                document.getElementById("righttabarrow").classList.toggle("hide");
            }
            if (document.getElementById("leftarrow").className === "leftLinkArrow hide") {
                document.getElementById("leftarrow").classList.toggle("hide");
                document.getElementById("rightarrow").classList.toggle("hide");
            }
            if (document.getElementById("savebox").className.includes("active"))
                document.getElementById("savebox").classList.toggle("active");
            document.getElementById("resetbox").classList.toggle("active");
        }
        document.getElementById("resetconfirmbox").classList.toggle("active");
    }
}