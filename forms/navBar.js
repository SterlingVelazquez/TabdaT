import { colorConverter } from "../tools/colorConverter.js";

var colorChanges = {
    buttonsColor: null,
    imageShadowColor: null,
    linkShadowColor: null,
    linkTextColor: null,
    tabTextShadowColor: null,
}

export class NavBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultPreferences: this.props.defaultPreferences,
            preferences: this.props.preferences,
            oldPreferences: this.props.oldPreferences,
            user : this.props.user,
            uid: this.props.uid
        };
    }

    static getDerivedStateFromProps(props) {
        return {
            defaultPreferences: props.defaultPreferences,
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


    setLinkTextColor(toSet, isPreview, noSave) {
        var newColor = this.hexc(document.getElementById("colortester1").style.background);
        if (!isPreview)
            this.toggleColorView("colorviewer1", "colorbutton1", "customcolorpicker1", false, false);
        if (document.getElementById("defaultcolor1").style.opacity !== "0.5" || !(["C7C7C7", "52565C"].includes(newColor)) || !toSet) {
            if ((toSet && newColor !== this.state.preferences.linkTextColor) || 
                (!toSet && this.state.oldPreferences.linkTextColor !== this.state.preferences.linkTextColor)) {
                var colorPreferences = this.state.preferences;
                colorPreferences.linkTextColor = toSet ? newColor : (colorChanges.linkTextColor !== null && !noSave ? colorChanges.linkTextColor :  this.state.oldPreferences.linkTextColor);
                this.props.setPreferences(colorPreferences);
                document.getElementById("colorinput1").value = toSet ? newColor : (colorChanges.linkTextColor !== null ? colorChanges.linkTextColor : 
                    (document.getElementById("container").className.includes("active") ? "C7C7C7" : "52565C"));
                this.comparePreferences();
            }
            if (!isPreview && toSet)
                colorChanges.linkTextColor = newColor;
        }
    }
    setLinkShadowColor(toSet, isPreview, noSave) {
        var newColor = this.hexc(document.getElementById("colortester2").style.background);
        if (!isPreview)
            this.toggleColorView("colorviewer2", "colorbutton2", "customcolorpicker2", false, false);
        if (document.getElementById("defaultcolor2").style.opacity !== "0.5" || !(["0E0E0E", "F9FBFD"].includes(newColor)) || !toSet) { 
            if ((toSet && newColor !== this.state.preferences.linkShadowColor) || 
                (!toSet && this.state.oldPreferences.linkShadowColor !== this.state.preferences.linkShadowColor)) {
                var colorPreferences = this.state.preferences;
                colorPreferences.linkShadowColor = toSet ? newColor : (colorChanges.linkShadowColor !== null && !noSave ? colorChanges.linkShadowColor :  this.state.oldPreferences.linkShadowColor);
                this.props.setPreferences(colorPreferences);
                document.getElementById("colorinput2").value = toSet ? newColor : (this.state.oldPreferences.linkShadowColor ? this.state.oldPreferences.linkShadowColor : 
                    (document.getElementById("container").className.includes("active") ? "0E0E0E" : "F9FBFD"));
                this.comparePreferences();
            }
            if (!isPreview && toSet)
                colorChanges.linkShadowColor = newColor;
        }
    }
    setImageShadowColor(toSet, isPreview, noSave) {
        var newColor = this.hexc(document.getElementById("colortester3").style.background);
        if (!isPreview)
            this.toggleColorView("colorviewer3", "colorbutton3", "customcolorpicker3", false, false);
        if (document.getElementById("defaultcolor3").style.opacity !== "0.5" || !(["4D4D4D", "B6B6B6"].includes(newColor)) || !toSet) {
            if ((toSet && newColor !== this.state.preferences.imageShadowColor) || 
                (!toSet && this.state.oldPreferences.imageShadowColor !== this.state.preferences.imageShadowColor)) {
                var colorPreferences = this.state.preferences;
                colorPreferences.imageShadowColor = toSet ? newColor : (colorChanges.imageShadowColor !== null && !noSave ? colorChanges.imageShadowColor :  this.state.oldPreferences.imageShadowColor);
                this.props.setPreferences(colorPreferences);
                document.getElementById("colorinput3").value = toSet ? newColor : (this.state.oldPreferences.imageShadowColor ? this.state.oldPreferences.imageShadowColor : 
                    (document.getElementById("container").className.includes("active") ? "4D4D4D" : "B6B6B6"));
                this.comparePreferences();
            }
            if (!isPreview && toSet)
                colorChanges.imageShadowColor = newColor;
        }
    }
    setTabTextShadowColor(toSet, isPreview, noSave) {
        var newColor = this.hexc(document.getElementById("colortester4").style.background);
        if (!isPreview)
            this.toggleColorView("colorviewer4", "colorbutton4", "customcolorpicker4", false, false);
        if (document.getElementById("defaultcolor4").style.opacity !== "0.5" || !(["000000", "808080"].includes(newColor)) || !toSet) {
            if ((toSet && newColor !== this.state.preferences.tabTextShadowColor) || 
                (!toSet && this.state.oldPreferences.tabTextShadowColor !== this.state.preferences.tabTextShadowColor)) {
                var colorPreferences = this.state.preferences;
                colorPreferences.tabTextShadowColor = toSet ? newColor : (colorChanges.tabTextShadowColor !== null && !noSave ? colorChanges.tabTextShadowColor :  this.state.oldPreferences.tabTextShadowColor);
                this.props.setPreferences(colorPreferences);
                document.getElementById("colorinput4").value = toSet ? newColor : (this.state.oldPreferences.tabTextShadowColor ? this.state.oldPreferences.tabTextShadowColor : 
                    (document.getElementById("container").className.includes("active") ? "000000" : "808080"));
                this.comparePreferences();
            }
            if (!isPreview && toSet)
                colorChanges.tabTextShadowColor = newColor;
        }
    }
    setButtonsColor(toSet, isPreview, noSave) {
        var newColor = this.hexc(document.getElementById("colortester5").style.background);
        if (!isPreview)
            this.toggleColorView("colorviewer5", "colorbutton5", "customcolorpicker5", false, false);
        if (document.getElementById("defaultcolor5").style.opacity !== "0.5" || !(["313131", "F9FBFD"].includes(newColor)) || !toSet) {    
            if ((toSet && newColor !== this.state.preferences.buttonsColor) || 
                (!toSet && this.state.oldPreferences.buttonsColor !== this.state.preferences.buttonsColor)) {
                var colorPreferences = this.state.preferences;
                colorPreferences.buttonsColor = toSet ? newColor : (colorChanges.buttonsColor !== null && !noSave ? colorChanges.buttonsColor :  this.state.oldPreferences.buttonsColor);
                this.props.setPreferences(colorPreferences);
                document.getElementById("colorinput5").value = toSet ? newColor : (this.state.oldPreferences.buttonsColor ? this.state.oldPreferences.buttonsColor : 
                    (document.getElementById("container").className.includes("active") ? "313131" : "F9FBFD"));
                this.comparePreferences();
            }
            if (!isPreview && toSet)
                colorChanges.buttonsColor = newColor;
        }
    }
    setDefaultLinkTextColor()  {
        var colorPreferences = this.state.preferences;
        colorPreferences.linkTextColor = false;
        this.props.setPreferences(colorPreferences);
        document.getElementById("colorinput1").value = document.getElementById("container").className.includes("active") ? "C7C7C7" : "52565C";
        this.comparePreferences();
    }
    setDefaultLinkShadowColor() {
        var colorPreferences = this.state.preferences;
        colorPreferences.linkShadowColor = false;
        this.props.setPreferences(colorPreferences);
        document.getElementById("colorinput2").value = document.getElementById("container").className.includes("active") ? "C7C7C7" : "52565C";
        this.comparePreferences();
    }
    setDefaultImageShadowColor() {
        var colorPreferences = this.state.preferences;
        colorPreferences.imageShadowColor = false;
        this.props.setPreferences(colorPreferences);
        document.getElementById("colorinput3").value = document.getElementById("container").className.includes("active") ? "C7C7C7" : "52565C";
        this.comparePreferences();
    }
    setDefaultTabTextShadowColor() {
        var colorPreferences = this.state.preferences;
        colorPreferences.tabTextShadowColor = false;
        this.props.setPreferences(colorPreferences);
        document.getElementById("colorinput4").value = document.getElementById("container").className.includes("active") ? "C7C7C7" : "52565C";
        this.comparePreferences();
    }
    setDefaultButtonsColor() {
        var colorPreferences = this.state.preferences;
        colorPreferences.buttonsColor = false;
        this.props.setPreferences(colorPreferences);
        document.getElementById("colorinput5").value = document.getElementById("container").className.includes("active") ? "C7C7C7" : "52565C";
        this.comparePreferences();
    }
    adjustBrightness(slider, input, tester) {
        if (/^#[0-9A-F]{6}$/i.test('#' + document.getElementById(input).value)) {
            var newColor = colorConverter.shade(document.getElementById(input).value, document.getElementById(slider).value);
            this.setPreviewColor(input, tester, newColor);
        }
    }
    adjustHue(slider, input, tester) {
        if (/^#[0-9A-F]{6}$/i.test('#' + document.getElementById(input).value)) {
            var newColor = colorConverter.changeHue(document.getElementById(input).value, document.getElementById(slider).value);
            this.setPreviewColor(input, tester, newColor);
        }
    }
    setInputColor(id, color, tester) {
        document.getElementById(id).value = color;
        this.setPreviewColor(id, tester, false);
    }
    setPreviewColor(id, tester, isEdited) {
        if (isEdited) {
            document.getElementById(tester).style.background = '#' + isEdited;
        } else if (/^#[0-9A-F]{6}$/i.test('#' + document.getElementById(id).value)) {
            document.getElementById(tester).style.background = '#' + document.getElementById(id).value;
            this.comparePreferences();
        }
    }
    hexc(colorval) {
        var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete(parts[0]);
        for (var i = 1; i <= 3; ++i) {
          parts[i] = parseInt(parts[i]).toString(16);
          if (parts[i].length == 1) parts[i] = '0' + parts[i];
        }
        return (parts.join('')).toUpperCase();
    }


    updateSlideNum(input, number) {
        document.getElementById(number).innerHTML = document.getElementById(input).value;
    }
    setNumLinks(toSave) {
        var newValue = parseInt(document.getElementById("sizeslider1").value);
        if (newValue !== this.state.preferences.numLinks && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.numLinks = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.numLinks = this.state.oldPreferences.numLinks;
            this.props.setPreferences(sizePreferences);
            document.getElementById("sizeslider1").value = this.state.oldPreferences.numLinks;
        }
    }
    setGridSize(toSave) {
        var newValue = parseInt(document.getElementById("sizeslider2").value);
        if (newValue !== this.state.preferences.gridSize && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.gridSize = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.gridSize = this.state.oldPreferences.gridSize;
            this.props.setPreferences(sizePreferences);
            document.getElementById("sizeslider2").value = this.state.oldPreferences.gridSize;
        }
    }
    setLinkImageSize(toSave) {
        var newValue = parseInt(document.getElementById("sizeslider3").value);
        if (newValue !== this.state.preferences.linkImageSize && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkImageSize = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkImageSize = this.state.oldPreferences.linkImageSize;
            this.props.setPreferences(sizePreferences);
            document.getElementById("sizeslider3").value = this.state.oldPreferences.linkImageSize;
        }
    }
    setLinkTextSize(toSave) {
        var newValue = parseInt(document.getElementById("sizeslider4").value);
        if (newValue !== this.state.preferences.linkTextSize && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkTextSize = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkTextSize = this.state.oldPreferences.linkTextSize;
            this.props.setPreferences(sizePreferences);
            document.getElementById("sizeslider4").value = this.state.oldPreferences.linkTextSize;
        }
    }
    setTabShadowSize(toSave) {
        var newValue = parseInt(document.getElementById("sizeslider5").value);
        if (newValue !== this.state.preferences.tabShadowSize && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.tabShadowSize = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.tabShadowSize = this.state.oldPreferences.tabShadowSize;
            this.props.setPreferences(sizePreferences);
            document.getElementById("sizeslider5").value = this.state.oldPreferences.tabShadowSize;
        }
    }
    setImageShadowSize(toSave) {
        var newValue = parseInt(document.getElementById("sizeslider6").value);
        if (newValue !== this.state.preferences.imageShadowSize && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.imageShadowSize = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.imageShadowSize = this.state.oldPreferences.imageShadowSize;
            this.props.setPreferences(sizePreferences);
            document.getElementById("sizeslider6").value = this.state.oldPreferences.imageShadowSize;
        }
    }
    setLinkShadowSize(toSave) {
        var newValue = parseInt(document.getElementById("sizeslider7").value);
        if (newValue !== this.state.preferences.linkShadowSize && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkShadowSize = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkShadowSize = this.state.oldPreferences.linkShadowSize;
            this.props.setPreferences(sizePreferences);
            document.getElementById("sizeslider7").value = this.state.oldPreferences.linkShadowSize;
        }
    }
    resetNumLinks() {
        var sizePreferences = this.state.preferences;
        sizePreferences.numLinks = 10;
        this.props.setPreferences(sizePreferences);
        document.getElementById("sizeslider1").value = 10;
        this.comparePreferences();
    }
    resetGridSize() {
        var sizePreferences = this.state.preferences;
        sizePreferences.gridSize = 20;
        this.props.setPreferences(sizePreferences);
        document.getElementById("sizeslider2").value = 20;
        this.comparePreferences();
    }
    resetLinkImageSize() {
        var sizePreferences = this.state.preferences;
        sizePreferences.linkImageSize = 50;
        this.props.setPreferences(sizePreferences);
        document.getElementById("sizeslider3").value = 50;
        this.comparePreferences();
    }
    resetLinkTextSize() {
        var sizePreferences = this.state.preferences;
        sizePreferences.linkTextSize = 50;
        this.props.setPreferences(sizePreferences);
        document.getElementById("sizeslider4").value = 50;
        this.comparePreferences();
    }
    resetTabShadowSize() {
        var sizePreferences = this.state.preferences;
        sizePreferences.tabShadowSize = 20;
        this.props.setPreferences(sizePreferences);
        document.getElementById("sizeslider5").value = 20;
        this.comparePreferences();
    }
    resetImageShadowSize() {
        var sizePreferences = this.state.preferences;
        sizePreferences.imageShadowSize = 20;
        this.props.setPreferences(sizePreferences);
        document.getElementById("sizeslider6").value = 20;
        this.comparePreferences();
    }
    resetLinkShadowSize() {
        var sizePreferences = this.state.preferences;
        sizePreferences.linkShadowSize = 10;
        this.props.setPreferences(sizePreferences);
        document.getElementById("sizeslider7").value = 10;
        this.comparePreferences();
    }

    async nightMode() {
        this.props.toggleNightMode();
        this.comparePreferences();
    }

    toggleActive(id) {
        document.getElementById(id).classList.toggle("active");
        if (id === "resetconfirmbox")
            document.getElementById("navbar").scrollTo({top: 1000, behavior:'smooth'});
    }
    toggleOptions(id) {
        this.toggleColorView("", "", "", true, true);
        var activeElems = document.getElementsByClassName("sideContainer active");
        if (activeElems.length > 0 && activeElems[0].id !== id)
            activeElems[0].classList.toggle("active");
        document.getElementById(id).classList.toggle("active");
    }
    toggleColorView(viewer, button, colorPicker, open, closeMenu) {
        if (open && document.getElementsByClassName("colorViewer active").length > 0) {
            var id1 = document.getElementsByClassName("colorBtn active")[0], id2 = document.getElementsByClassName("colorBtn active")[1];
            document.getElementsByClassName("colorViewer active")[0].classList.toggle("active");
            id1.classList.toggle("active");
            id2.classList.toggle("active");
            document.getElementsByClassName("customColorPicker active")[0].classList.toggle("active");
        }
        if (!closeMenu) {
            document.getElementById(viewer).classList.toggle("active");
            document.getElementById(button + "a").classList.toggle("active");
            document.getElementById(button + "b").classList.toggle("active");
            document.getElementById(colorPicker).classList.toggle("active");
        }
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
        this.toggleColorView("", "", "", true, true);
    }
    openImportLinks() {
        document.getElementById("bookmarkbox").classList.toggle("focus");
        document.getElementById("shadow").classList.toggle("active");
    }
    closeSave() {
        if (this.state.preferences.addLink !== this.state.oldPreferences.addLink)
            this.hideAddLink();
        if (this.state.preferences.addTab !== this.state.oldPreferences.addTab)
            this.hideAddTab();
        if (this.state.preferences.editBtn !== this.state.oldPreferences.editBtn)
            this.hideEditBtn();
        if (this.state.preferences.linkArrows !== this.state.oldPreferences.linkArrows)
            this.hideLinkArrows();
        if (this.state.preferences.night !== this.state.oldPreferences.night)
            this.nightMode();
        if (this.state.preferences.removeBtn !== this.state.oldPreferences.removeBtn)
            this.hideRemoveBtn();
        if (this.state.preferences.tabArrows !== this.state.oldPreferences.tabArrows)
            this.hideTabArrows();
        if (this.state.preferences.linkTextColor !== this.state.oldPreferences.linkTextColor)
            this.setLinkTextColor(false, true, true);
        if (this.state.preferences.linkShadowColor !== this.state.oldPreferences.linkShadowColor)
            this.setLinkShadowColor(false, true, true);
        if (this.state.preferences.imageShadowColor !== this.state.oldPreferences.imageShadowColor)
            this.setImageShadowColor(false, true, true);
        if (this.state.preferences.tabTextShadowColor !== this.state.oldPreferences.tabTextShadowColor)
            this.setTabTextShadowColor(false, true, true);
        if (this.state.preferences.buttonsColor !== this.state.oldPreferences.buttonsColor)
            this.setButtonsColor(false, true, true);
        if (this.state.preferences.numLinks !== this.state.oldPreferences.numLinks)
            this.setNumLinks(false);
        if (this.state.preferences.gridSize !== this.state.oldPreferences.gridSize)
            this.setGridSize(false);
        if (this.state.preferences.linkImageSize !== this.state.oldPreferences.linkImageSize)
            this.setLinkImageSize(false);
        if (this.state.preferences.linkTextSize !== this.state.oldPreferences.linkTextSize)
            this.setLinkTextSize(false);
        if (this.state.preferences.tabShadowSize !== this.state.oldPreferences.tabShadowSize)
            this.setTabShadowSize(false);
        if (this.state.preferences.imageShadowSize !== this.state.oldPreferences.imageShadowSize)
            this.setImageShadowSize(false);
        if (this.state.preferences.linkShadowSize !== this.state.oldPreferences.linkShadowSize)
            this.setLinkShadowSize(false);
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

                    <div className="sideContainer active" id="sidecontainershow" style={{marginTop:"1.5rem"}}>
                        <div className="sideContainerHeader" id="sidecontainerheader1" onClick={e => this.toggleOptions("sidecontainershow")}>
                            <p className="sideHeader">Show / Hide Stuff</p>
                            <div className="sideHeaderArrow"></div>
                        </div>
                        <div className="sideOptions" id="hideoptions">
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

                    <div className="sideContainer" id="sidecontainercolor">
                        <div className="sideContainerHeader" id="sidecontainerheader2" onClick={e => this.toggleOptions("sidecontainercolor")}>
                            <p className="sideHeader">Colors</p>
                            <div className="sideHeaderArrow"></div>
                        </div>
                        <div className="sideOptions" id="linkoptions">
                            <div className="sideOptionContainer">
                                <p className="option">Link Text</p>
                                <button className="colorViewer" id="colorviewer1" style={{background: this.state.preferences.linkTextColor ? '#' + this.state.preferences.linkTextColor : 
                                    (this.state.preferences.night ? "rgb(199, 199, 199)" : "rgb(82, 86, 92)")}} 
                                    onClick={e => this.toggleColorView("colorviewer1", "colorbutton1", "customcolorpicker1", true, false)}></button>
                                <button className="colorBtn" id="colorbutton1a" onClick={e => this.setLinkTextColor(false, false, false)}>
                                    <img className="colorCancel" src="cancel.png"></img></button>
                                <button className="colorBtn" id="colorbutton1b" onClick={e => this.setLinkTextColor(true, false, false)}>
                                    <div className="colorCheck"></div></button>
                                <div className="customColorPicker" id="customcolorpicker1">
                                    <p className="defaultColor" id="defaultcolor1" onClick={e => this.setDefaultLinkTextColor()} style={{opacity: this.state.preferences.linkTextColor ? "1" : "0.5", 
                                        pointerEvents: this.state.preferences.linkTextColor ? "all" : "none"}}>Set to Default</p>
                                    <p className="previewColor" onClick={e => this.setLinkTextColor(true, true, false)}>Preview</p>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput1", "FF0000", "colortester1")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput1", "FFA500", "colortester1")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput1", "FFFF00", "colortester1")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput1", "008000", "colortester1")}></div>
                                    <br/>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput1", "ADD8E6", "colortester1")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput1", "0000FF", "colortester1")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput1", "EE82EE", "colortester1")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput1", "4B0082", "colortester1")}></div>
                                    <div className="colorInputDiv">
                                        <div className="colorInputLabel"><p className="hashTag">#</p></div>
                                        <input className="colorInput" id="colorinput1" spellCheck="false" defaultValue={this.state.preferences.linkTextColor ? this.state.preferences.linkTextColor : 
                                            (this.state.preferences.night ? "C7C7C7" : "52565C")} onChange={e => this.setPreviewColor("colorinput1", "colortester1")}></input>
                                    </div>
                                    <input type="range" min="-100" max="100" defaultValue="0" className="brightnessSlider" id="brightnessslider1"
                                        onChange={e => this.adjustBrightness("brightnessslider1", "colorinput1", "colortester1")}></input>
                                    <input type="range" min="-50" max="50" defaultValue="0" className="hueSlider" id="hueslider1"
                                        onChange={e => this.adjustHue("hueslider1", "colorinput1", "colortester1")}></input>
                                    <div className="colorTester" id="colortester1" style={{background: this.state.preferences.linkTextColor ? '#' + this.state.preferences.linkTextColor : 
                                        (this.state.preferences.night ? "#C7C7C7" : "#52565C")}}></div>
                                </div>
                            </div>
                            <div className="sideOptionContainer">
                                <p className="option" style={{transitionDelay: "0.1s"}}>Link Shadow</p>
                                <button className="colorViewer" id="colorviewer2" style={{background: this.state.preferences.linkShadowColor ? '#' +  this.state.preferences.linkShadowColor : 
                                    (this.state.preferences.night ? "rgb(14, 14, 14)" : "rgb(249, 251, 253)")}} 
                                    onClick={e => this.toggleColorView("colorviewer2", "colorbutton2", "customcolorpicker2", true, false)}></button>
                                <button className="colorBtn" id="colorbutton2a" onClick={e => this.setLinkShadowColor(false, false, false)}>
                                    <img className="colorCancel" src="cancel.png"></img></button>
                                <button className="colorBtn" id="colorbutton2b" onClick={e => this.setLinkShadowColor(true, false, false)}>
                                    <div className="colorCheck"></div></button>
                                <div className="customColorPicker" id="customcolorpicker2">
                                    <p className="defaultColor" id="defaultcolor2" onClick={e => this.setDefaultLinkShadowColor()} style={{opacity: this.state.preferences.linkShadowColor ? "1" : "0.5", 
                                        pointerEvents: this.state.preferences.linkShadowColor ? "all" : "none"}}>Set to Default</p>
                                    <p className="previewColor" onClick={e => this.setLinkShadowColor(true, true, false)}>Preview</p>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput2", "FF0000", "colortester2")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput2", "FFA500", "colortester2")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput2", "FFFF00", "colortester2")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput2", "008000", "colortester2")}></div>
                                    <br/>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput2", "ADD8E6", "colortester2")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput2", "0000FF", "colortester2")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput2", "EE82EE", "colortester2")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput2", "4B0082", "colortester2")}></div>
                                    <div className="colorInputDiv">
                                        <div className="colorInputLabel"><p className="hashTag">#</p></div>
                                        <input className="colorInput" id="colorinput2" spellCheck="false" defaultValue={this.state.preferences.linkShadowColor ? this.state.preferences.linkShadowColor : 
                                            (this.state.preferences.night ? "0E0E0E" : "F9FBFD")} onChange={e => this.setPreviewColor("colorinput2", "colortester2")}></input>
                                    </div>
                                    <input type="range" min="-100" max="100" defaultValue="0" className="brightnessSlider" id="brightnessslider2"
                                        onChange={e => this.adjustBrightness("brightnessslider2", "colorinput2", "colortester2")}></input>
                                    <input type="range" min="-50" max="50" defaultValue="0" className="hueSlider" id="hueslider2"
                                        onChange={e => this.adjustHue("hueslider2", "colorinput2", "colortester2")}></input>
                                    <div className="colorTester" id="colortester2" style={{background: this.state.preferences.linkShadowColor ? '#' + this.state.preferences.linkShadowColor : 
                                        (this.state.preferences.night ? "#0E0E0E" : "#F9FBFD")}}></div>
                                </div>
                            </div>
                            <div className="sideOptionContainer">
                                <p className="option" style={{transitionDelay: "0.2s"}}>Image Shadow</p>
                                <button className="colorViewer" id="colorviewer3" style={{background: this.state.preferences.imageShadowColor ? '#' + this.state.preferences.imageShadowColor : 
                                    (this.state.preferences.night ? "rgb(77, 77, 77)" : "rgb(182, 182, 182)")}} 
                                    onClick={e => this.toggleColorView("colorviewer3", "colorbutton3", "customcolorpicker3", true, false)}></button>
                                <button className="colorBtn" id="colorbutton3a" onClick={e => this.setImageShadowColor(false, false, false)}>
                                    <img className="colorCancel" src="cancel.png"></img></button>
                                <button className="colorBtn" id="colorbutton3b" onClick={e => this.setImageShadowColor(true, false, false)}>
                                    <div className="colorCheck"></div></button>
                                <div className="customColorPicker" id="customcolorpicker3">
                                    <p className="defaultColor" id="defaultcolor3" onClick={e => this.setDefaultImageShadowColor()} style={{opacity: this.state.preferences.imageShadowColor ? "1" : "0.5", 
                                        pointerEvents: this.state.preferences.imageShadowColor ? "all" : "none"}}>Set to Default</p>
                                    <p className="previewColor" onClick={e => this.setImageShadowColor(true, true, false)}>Preview</p>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput3", "FF0000", "colortester3")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput3", "FFA500", "colortester3")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput3", "FFFF00", "colortester3")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput3", "008000", "colortester3")}></div>
                                    <br/>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput3", "ADD8E6", "colortester3")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput3", "0000FF", "colortester3")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput3", "EE82EE", "colortester3")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput3", "4B0082", "colortester3")}></div>
                                    <div className="colorInputDiv">
                                        <div className="colorInputLabel"><p className="hashTag">#</p></div>
                                        <input className="colorInput" id="colorinput3" spellCheck="false" defaultValue={this.state.preferences.imageShadowColor ? this.state.preferences.imageShadowColor : 
                                            (this.state.preferences.night ? "4D4D4D" : "B6B6B6")} onChange={e => this.setPreviewColor("colorinput3", "colortester3")}></input>
                                    </div>
                                    <input type="range" min="-100" max="100" defaultValue="0" className="brightnessSlider" id="brightnessslider3"
                                        onChange={e => this.adjustBrightness("brightnessslider3", "colorinput3", "colortester3")}></input>
                                    <input type="range" min="-50" max="50" defaultValue="0" className="hueSlider" id="hueslider3"
                                        onChange={e => this.adjustHue("hueslider3", "colorinput3", "colortester3")}></input>
                                    <div className="colorTester" id="colortester3" style={{background: this.state.preferences.imageShadowColor ? '#' + this.state.preferences.imageShadowColor : 
                                        (this.state.preferences.night ? "#4D4D4D" : "#B6B6B6")}}></div>
                                </div>
                            </div>
                            <div className="sideOptionContainer">
                                <p className="option" style={{transitionDelay: "0.3s"}}>Tab Text Shadow</p>
                                <button className="colorViewer" id="colorviewer4" style={{background: this.state.preferences.tabTextShadowColor ? '#' + this.state.preferences.tabTextShadowColor : 
                                    (this.state.preferences.night ? "rgb(0, 0, 0)" : "rgb(128, 128, 128)")}} 
                                    onClick={e => this.toggleColorView("colorviewer4", "colorbutton4", "customcolorpicker4", true, false)}></button>
                                <button className="colorBtn" id="colorbutton4a" onClick={e => this.setTabTextShadowColor(false, false, false)}>
                                    <img className="colorCancel" src="cancel.png"></img></button>
                                <button className="colorBtn" id="colorbutton4b" onClick={e => this.setTabTextShadowColor(true, false, false)}>
                                    <div className="colorCheck"></div></button>
                                <div className="customColorPicker" id="customcolorpicker4">
                                    <p className="defaultColor" id="defaultcolor4" onClick={e => this.setDefaultTabTextShadowColor()} style={{opacity: this.state.preferences.tabTextShadowColor ? "1" : "0.5", 
                                        pointerEvents: this.state.preferences.tabTextShadowColor ? "all" : "none"}}>Set to Default</p>
                                    <p className="previewColor" onClick={e => this.setTabTextShadowColor(true, true, false)}>Preview</p>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput4", "FF0000", "colortester4")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput4", "FFA500", "colortester4")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput4", "FFFF00", "colortester4")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput4", "008000", "colortester4")}></div>
                                    <br/>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput4", "ADD8E6", "colortester4")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput4", "0000FF", "colortester4")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput4", "EE82EE", "colortester4")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput4", "4B0082", "colortester4")}></div>
                                    <div className="colorInputDiv">
                                        <div className="colorInputLabel"><p className="hashTag">#</p></div>
                                        <input className="colorInput" id="colorinput4" spellCheck="false" defaultValue={this.state.preferences.tabTextShadowColor ? this.state.preferences.tabTextShadowColor : 
                                            (this.state.preferences.night ? "000000" : "808080")} onChange={e => this.setPreviewColor("colorinput4", "colortester4")}></input>
                                    </div>
                                    <input type="range" min="-100" max="100" defaultValue="0" className="brightnessSlider" id="brightnessslider4"
                                        onChange={e => this.adjustBrightness("brightnessslider4", "colorinput4", "colortester4")}></input>
                                    <input type="range" min="-50" max="50" defaultValue="0" className="hueSlider" id="hueslider4"
                                        onChange={e => this.adjustHue("hueslider4", "colorinput4", "colortester4")}></input>
                                    <div className="colorTester" id="colortester4" style={{background: this.state.preferences.tabTextShadowColor ? '#' + this.state.preferences.tabTextShadowColor : 
                                        (this.state.preferences.night ? "#000000" : "#808080")}}></div>
                                </div>
                            </div>
                            <div className="sideOptionContainer">
                                <p className="option" style={{transitionDelay: "0.4s"}}>Buttons</p>
                                <button className="colorViewer" id="colorviewer5" style={{background: this.state.preferences.buttonsColor ? '#' + this.state.preferences.buttonsColor : 
                                    (this.state.preferences.night ? "rgb(49, 49, 49)" : "rgb(249, 251, 253)")}} 
                                    onClick={e => this.toggleColorView("colorviewer5", "colorbutton5", "customcolorpicker5", true, false)}></button>
                                <button className="colorBtn" id="colorbutton5a" onClick={e => this.setButtonsColor(false, false, false)}>
                                    <img className="colorCancel" src="cancel.png"></img></button>
                                <button className="colorBtn" id="colorbutton5b" onClick={e => this.setButtonsColor(true, false, false)}>
                                    <div className="colorCheck"></div></button>
                                <div className="customColorPicker" id="customcolorpicker5">
                                    <p className="defaultColor" id="defaultcolor5" onClick={e => this.setDefaultButtonsColor()} style={{opacity: this.state.preferences.buttonsColor ? "1" : "0.5", 
                                        pointerEvents: this.state.preferences.buttonsColor ? "all" : "none"}}>Set to Default</p>
                                    <p className="previewColor" onClick={e => this.setButtonsColor(true, true, false)}>Preview</p>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput5", "FF0000", "colortester5")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput5", "FFA500", "colortester5")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput5", "FFFF00", "colortester5")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput5", "008000", "colortester5")}></div>
                                    <br/>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput5", "ADD8E6", "colortester5")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput5", "0000FF", "colortester5")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput5", "EE82EE", "colortester5")}></div>
                                    <div className="swatch" onClick={e => this.setInputColor("colorinput5", "4B0082", "colortester5")}></div>
                                    <div className="colorInputDiv">
                                        <div className="colorInputLabel"><p className="hashTag">#</p></div>
                                        <input className="colorInput" id="colorinput5" spellCheck="false" defaultValue={this.state.preferences.buttonsColor ? this.state.preferences.buttonsColor : 
                                            (this.state.preferences.night ? "313131" : "F9FBFD")} onChange={e => this.setPreviewColor("colorinput5", "colortester5")}></input>
                                    </div>
                                    <input type="range" min="-100" max="100" defaultValue="0" className="brightnessSlider" id="brightnessslider5"
                                        onChange={e => this.adjustBrightness("brightnessslider5", "colorinput5", "colortester5")}></input>
                                    <input type="range" min="-50" max="50" defaultValue="0" className="hueSlider" id="hueslider5"
                                        onChange={e => this.adjustHue("hueslider5", "colorinput5", "colortester5")}></input>
                                    <div className="colorTester" id="colortester5" style={{background: this.state.preferences.buttonsColor ? '#' + this.state.preferences.buttonsColor : 
                                        (this.state.preferences.night ? "#313131" : "#F9FBFD")}}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sideContainer" id="sidecontainersize">
                        <div className="sideContainerHeader" id="sidecontainerheader3" onClick={e => this.toggleOptions("sidecontainersize")}>
                            <p className="sideHeader">Sizes</p>
                            <div className="sideHeaderArrow"></div>
                        </div>
                        <div className="sideOptions" id="hideoptions">
                            <div className="sideOptionContainerSize">
                                <p className="option">Number of Links</p>
                                <div className="sizeSliderBox">
                                    <img className={"resetSlider" + (this.state.preferences.numLinks !== 10 ? " active" : "")} id="resetslider1" src="reset.png" onClick={e => this.resetNumLinks()}></img>
                                    <input type="range" min="10" max="100" defaultValue="10" className="sizeSlider" id="sizeslider1" onChange={e => this.updateSlideNum("sizeslider1", "slidernumber1")}
                                        onMouseUp={e => this.setNumLinks(true)}></input>
                                    <p className="sliderNumber" id="slidernumber1">{this.state.preferences.numLinks}</p>
                                </div>
                            </div>
                            <div className="sideOptionContainerSize">
                                <p className="option" style={{transitionDelay: "0.08s"}}>Grid</p>
                                <div className="sizeSliderBox" style={{transitionDelay:"0.08s"}}>
                                    <img className={"resetSlider" + (this.state.preferences.gridSize !== 20 ? " active" : "")} id="resetslider2" src="reset.png" onClick={e => this.resetGridSize()}></img>
                                    <input type="range" min="1" max="100" defaultValue="20" className="sizeSlider" id="sizeslider2" onChange={e => this.updateSlideNum("sizeslider2", "slidernumber2")}
                                        onMouseUp={e => this.setGridSize(true)}></input>
                                    <p className="sliderNumber" id="slidernumber2">{this.state.preferences.gridSize}</p>
                                </div>
                            </div>
                            <div className="sideOptionContainerSize">
                                <p className="option" style={{transitionDelay: "0.16s"}}>Link Image</p>
                                <div className="sizeSliderBox" style={{transitionDelay: "0.16s"}}>
                                    <img className={"resetSlider" + (this.state.preferences.linkImageSize !== 50 ? " active" : "")} id="resetslider3" src="reset.png" onClick={e => this.resetLinkImageSize()}></img>
                                    <input type="range" min="1" max="100" defaultValue="50" className="sizeSlider" id="sizeslider3" onChange={e => this.updateSlideNum("sizeslider3", "slidernumber3")}
                                        onMouseUp={e => this.setLinkImageSize(true)}></input>
                                    <p className="sliderNumber" id="slidernumber3">{this.state.preferences.linkImageSize}</p>
                                </div>
                            </div>
                            <div className="sideOptionContainerSize">
                                <p className="option" style={{transitionDelay: "0.24s"}}>Link Text</p>
                                <div className="sizeSliderBox" style={{transitionDelay: "0.24s"}}>
                                    <img className={"resetSlider" + (this.state.preferences.linkTextSize !== 50 ? " active" : "")} id="resetslider4" src="reset.png" onClick={e => this.resetLinkTextSize()}></img>
                                    <input type="range" min="1" max="100" defaultValue="50" className="sizeSlider" id="sizeslider4" onChange={e => this.updateSlideNum("sizeslider4", "slidernumber4")}
                                        onMouseUp={e => this.setLinkTextSize(true)}></input>
                                    <p className="sliderNumber" id="slidernumber4">{this.state.preferences.linkTextSize}</p>
                                </div>
                            </div>
                            <div className="sideOptionContainerSize">
                                <p className="option" style={{transitionDelay: "0.32s"}}>Tab Shadow</p>
                                <div className="sizeSliderBox" style={{transitionDelay: "0.32s"}}>
                                    <img className={"resetSlider" + (this.state.preferences.tabShadowSize !== 20 ? " active" : "")} id="resetslider5" src="reset.png" onClick={e => this.resetTabShadowSize()}></img>
                                    <input type="range" min="1" max="100" defaultValue="20" className="sizeSlider" id="sizeslider5" onChange={e => this.updateSlideNum("sizeslider5", "slidernumber5")}
                                        onMouseUp={e => this.setTabShadowSize(true)}></input>
                                    <p className="sliderNumber" id="slidernumber5">{this.state.preferences.tabShadowSize}</p>
                                </div>
                            </div>
                            <div className="sideOptionContainerSize">
                                <p className="option" style={{transitionDelay: "0.4s"}}>Image Shadow</p>
                                <div className="sizeSliderBox" style={{transitionDelay: "0.4s"}}>
                                    <img className={"resetSlider" + (this.state.preferences.imageShadowSize !== 20 ? " active" : "")} id="resetslider6" src="reset.png" onClick={e => this.resetImageShadowSize()}></img>
                                    <input type="range" min="1" max="100" defaultValue="20" className="sizeSlider" id="sizeslider6" onChange={e => this.updateSlideNum("sizeslider6", "slidernumber6")}
                                        onMouseUp={e => this.setImageShadowSize(true)}></input>
                                    <p className="sliderNumber" id="slidernumber6">{this.state.preferences.imageShadowSize}</p>
                                </div>
                            </div>
                            <div className="sideOptionContainerSize">
                                <p className="option" style={{transitionDelay: "0.48s"}}>Link Shadow</p>
                                <div className="sizeSliderBox" style={{transitionDelay: "0.48s"}}>
                                    <img className={"resetSlider" + (this.state.preferences.linkShadowSize !== 10 ? " active" : "")} id="resetslider7" src="reset.png" onClick={e => this.resetLinkShadowSize()}></img>
                                    <input type="range" min="1" max="100" defaultValue="10" className="sizeSlider" id="sizeslider7" onChange={e => this.updateSlideNum("sizeslider7", "slidernumber7")}
                                        onMouseUp={e => this.setLinkShadowSize(true)}></input>
                                    <p className="sliderNumber" id="slidernumber7">{this.state.preferences.linkShadowSize}</p>
                                </div>
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

            document.getElementById("colorinput1").value = document.getElementById("container").className.includes("active") ? "C7C7C7" : "52565C";
            document.getElementById("colorinput2").value = document.getElementById("container").className.includes("active") ? "0E0E0E" : "F9FBFD";
            document.getElementById("colorinput3").value = document.getElementById("container").className.includes("active") ? "4D4D4D" : "B6B6B6";
            document.getElementById("colorinput4").value = document.getElementById("container").className.includes("active") ? "000000" : "808080";
            document.getElementById("colorinput5").value = document.getElementById("container").className.includes("active") ? "313131" : "F9FBFD";
            
            document.getElementById("sizeslider1").value = 10;
            document.getElementById("sizeslider2").value = 20;
            document.getElementById("sizeslider3").value = 50;
            document.getElementById("sizeslider4").value = 50;
            document.getElementById("sizeslider5").value = 20;
            document.getElementById("sizeslider6").value = 20;
            document.getElementById("sizeslider7").value = 10;
            
            document.getElementById("resetbox").classList.toggle("active");
        }
        document.getElementById("resetconfirmbox").classList.toggle("active");
    }
}