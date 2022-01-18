import React from 'react'
import Visibility from "../react/visibility.js";
import ColorViewer from "../react/colorviewer.js";
import Sizes from "../react/sizes.js";
import { colorConverter } from "../tools/colorConverter.js";

var colorChanges = {
    buttonsColor: null,
    imageShadowColor: null,
    linkShadowColor: null,
    linkTextColor: null,
    tabTextShadowColor: null,
},
    upload = false, uploadImage = false, toShade = false;

export class NavBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultPreferences: this.props.defaultPreferences,
            preferences: this.props.preferences,
            oldPreferences: this.props.oldPreferences,
            user: this.props.user,
            uid: this.props.uid,
            tabIndex: this.props.tabIndex,
            numTabs: this.props.numTabs,
            displayedTabs: this.props.displayedTabs,
            themes: this.props.themes
        };
    }

    static getDerivedStateFromProps(props) {
        return {
            defaultPreferences: props.defaultPreferences,
            oldPreferences: props.oldPreferences,
            preferences: props.preferences,
            user: props.user,
            uid: props.uid,
            tabIndex: props.tabIndex,
            numTabs: props.numTabs,
            displayedTabs: props.displayedTabs,
            themes: props.themes
        }
    }

    hideElements(hideType) {
        if (hideType === "addTab")
            this.props.checkAddTab(false);
        else if (hideType === "tabArrows")
            this.props.checkAddTab(true);

        if (document.getElementById("buttonnav").className.includes("edit") && hideType === "editBtn")
            this.props.editActive();
        else if (document.getElementById("buttonnav").className.includes("erase") && hideType === "removeBtn")
            this.props.eraseActive();

        var hidePreferences = this.state.preferences;
        hidePreferences[hideType] = !hidePreferences[hideType];
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }

    setOptionsColor(toSet, isPreview, isReset, colorType, index, night, day, theme) {
        var newColor = this.hexc(document.getElementById("colortester" + index).style.background);
        var colorPreferences = this.state.preferences;
        var isDefault = (this.state.preferences.night && newColor === night) || (this.state.preferences.theme && newColor === theme) ||
            (!this.state.preferences.theme && !this.state.preferences.night && newColor === day)
        var noChange = !this.state.preferences[colorType] && (isDefault)
        if (isDefault) newColor = false;

        if (isReset) {
            this.setPreviewColor(index, this.state.oldPreferences[colorType] ? this.state.oldPreferences[colorType] :
                this.state.preferences.theme ? theme : this.state.preferences.night ? night : day);
            colorPreferences[colorType] = this.state.oldPreferences[colorType];
            this.props.setPreferences(colorPreferences);
        } else if (isPreview) {
            if (!noChange) {
                colorPreferences[colorType] = newColor;
                this.props.setPreferences(colorPreferences);
            }
        } else if (!toSet) {
            this.setPreviewColor(index, colorChanges[colorType] ? colorChanges[colorType] : this.state.oldPreferences[colorType] ? this.state.oldPreferences[colorType] :
                this.state.preferences.theme ? theme : this.state.preferences.night ? night : day);
            this.toggleColorView("colorviewer" + index, "colorbutton" + index, "customcolorpicker" + index, false, false);
            colorPreferences[colorType] = colorChanges[colorType] ? colorChanges[colorType] : this.state.oldPreferences[colorType] ? this.state.oldPreferences[colorType] : false;
            this.props.setPreferences(colorPreferences);
        } else {
            this.toggleColorView("colorviewer" + index, "colorbutton" + index, "customcolorpicker" + index, false, false);
            colorChanges[colorType] = !newColor ? null : newColor;
            if (!noChange) {
                colorPreferences[colorType] = newColor;
                this.props.setPreferences(colorPreferences);
            }
        }
        this.comparePreferences();
    }
    setPreviewColor(index, color, isSlider) {
        var newColor = color !== "" ? color : (/^#[0-9A-FX]{6}$/i.test('#' + document.getElementById("colorinput" + index).value)) ?
            document.getElementById("colorinput" + index).value : false;
        if (newColor) {
            if (!isSlider || !toShade) toShade = newColor;
            document.getElementById("colortester" + index).style.background = newColor === 'XXXXXX' ? 'transparent' : '#' + newColor;
            document.getElementById("colorinput" + index).value = newColor;
            this.comparePreferences();
        }
    }
    adjustBrightness(index) {
        if (/^#[0-9A-F]{6}$/i.test('#' + document.getElementById("colorinput" + index).value)) {
            var newColor = colorConverter.shade(toShade ? toShade : document.getElementById("colorinput" + index).value, document.getElementById("brightnessslider" + index).value).toUpperCase();
            this.setPreviewColor(index, newColor, true);
        }
    }
    adjustHue(index) {
        if (/^#[0-9A-F]{6}$/i.test('#' + document.getElementById("colorinput" + index).value)) {
            var newColor = colorConverter.changeHue(toShade ? toShade : document.getElementById("colorinput" + index).value, document.getElementById("hueslider" + index).value).toUpperCase();
            this.setPreviewColor(index, newColor, true);
        }
    }
    hexc(colorval) {
        if (colorval !== "" && colorval !== "transparent") {
            var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            delete (parts[0]);
            for (var i = 1; i <= 3; ++i) {
                parts[i] = parseInt(parts[i]).toString(16);
                if (parts[i].length == 1) parts[i] = '0' + parts[i];
            }
            return (parts.join('')).toUpperCase();
        } else {
            return 'XXXXXX'
        }
    }

    updateSlideNum(input, number) {
        document.getElementById(number).innerHTML = document.getElementById(input).value;
    }
    setOptionSizes(toSave, id, sizeType) {
        var newValue = parseInt(document.getElementById(id).value);
        if (toSave && newValue !== this.state.preferences[sizeType]) {
            var sizePreferences = this.state.preferences;
            sizePreferences[sizeType] = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences[sizeType] = this.state.oldPreferences[sizeType];
            this.props.setPreferences(sizePreferences);
            document.getElementById(id).value = this.state.oldPreferences[sizeType];
        }
    }
    resetSize(id, sizeType, benchmark) {
        var sizePreferences = this.state.preferences;
        sizePreferences[sizeType] = benchmark;
        this.props.setPreferences(sizePreferences);
        document.getElementById(id).value = benchmark;
        this.comparePreferences();
    }

    async setTheme(id) {
        if ((!id && this.state.preferences.theme) || (id && this.state.preferences.theme !== id)) {
            var themePreferences = this.state.preferences;
            themePreferences.theme = id ? id : false;
            await this.props.setPreferences(themePreferences);
            this.comparePreferences();
            this.changeColorInput();
        }
    }
    async setUploadTheme(event, toChange) {
        event.stopPropagation();
        if (toChange && !document.getElementById("themecontainer2").className.includes("active") &&
            (uploadImage || (this.state.oldPreferences.theme && !this.state.oldPreferences.theme.includes("/default")))) {
            var themePreferences = this.state.preferences;
            themePreferences.theme = uploadImage ? uploadImage : this.state.oldPreferences.theme;
            await this.props.setPreferences(themePreferences);
            this.changeColorInput();
        } else {
            document.getElementById("addtheme").addEventListener('change', async (event) => {
                if (event.target.files.length !== 0) {
                    var files = event.target.files, reader = new FileReader();
                    reader.onload = async function () {
                        document.getElementById("themeuploadimage").src = reader.result;
                        var themePreferences = this.state.preferences;
                        themePreferences.theme = reader.result;
                        uploadImage = reader.result;
                        await this.props.setPreferences(themePreferences);
                        this.changeColorInput();
                    }.bind(this)
                    upload = files[0];
                    reader.readAsDataURL(files[0]);
                }
            })
        }
        this.comparePreferences();
    }

    async nightMode() {
        if (!this.state.preferences.theme) {
            await this.props.toggleNightMode();
            this.changeColorInput();
            this.comparePreferences();
        }
    }
    changeColorInput() {
        for (var i = 1; i < document.getElementsByClassName("colorInput").length + 1; i++) {
            document.getElementById("colorinput" + i).value = this.hexc(document.getElementById("colortester" + i).style.background);
        }
    }

    toggleActive(id) {
        document.getElementById(id).classList.toggle("active");
        if (id === "resetconfirmbox")
            document.getElementById("navbar").scrollTo({ top: 1000, behavior: 'smooth' });
    }
    toggleReset() {
        document.getElementById("resetconfirmbox").classList.toggle("active");
        if (document.getElementById("resetconfirmbox").className.includes("active"))
            document.getElementById("navbar").scrollTo({
                top: 100000,
                behavior: "smooth"
            })
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
    openImportLinks() {
        document.getElementById("bookmarkbox").classList.toggle("focus");
        if (document.getElementById("AddFormDiv").classList.contains("active"))
            document.getElementById("AddFormDiv").classList.toggle("active");
        else if (document.getElementById("EditFormDiv").classList.contains("active")) {
            document.getElementById("EditFormDiv").classList.toggle("active");
        }
        else {
            document.getElementById("shadow").classList.toggle("active");
        }
    }
    async closeSave() {
        if (this.state.preferences.night !== this.state.oldPreferences.night)
            this.nightMode();

        var hideElements = ["addLink", "addTab", "editBtn", "linkArrows", "removeBtn", "linkText", "tabArrows"];
        for (var i = 0; i < hideElements.length; i++)
            if (this.state.preferences[hideElements[i]] !== this.state.oldPreferences[hideElements[i]])
                this.hideElements([hideElements[i]]);

        if (this.state.preferences.linkTextColor !== this.state.oldPreferences.linkTextColor)
            this.setOptionsColor(false, false, true, "linkTextColor", 1, "C7C7C7", "5D687E", "EBEBEB");
        if (this.state.preferences.linkShadowColor !== this.state.oldPreferences.linkShadowColor)
            this.setOptionsColor(false, false, true, "linkShadowColor", 2, "0E0E0E", "F9FBFD", "000000");
        if (this.state.preferences.imageShadowColor !== this.state.oldPreferences.imageShadowColor)
            this.setOptionsColor(false, false, true, "imageShadowColor", 3, "000000", "B6B6B6", "XXXXXX");
        if (this.state.preferences.tabTextShadowColor !== this.state.oldPreferences.tabTextShadowColor)
            this.setOptionsColor(false, false, true, "tabTextShadowColor", 4, "000000", "808080", "XXXXXX");
        if (this.state.preferences.buttonsColor !== this.state.oldPreferences.buttonsColor)
            this.setOptionsColor(false, false, true, "buttonsColor", 5, "313131", "C4D3E9", "XXXXXX");

        if (this.state.preferences.gridWidth !== this.state.oldPreferences.gridWidth)
            this.setOptionSizes(false, "sizeslider1", "gridWidth");
        if (this.state.preferences.gridHeight !== this.state.oldPreferences.gridHeight)
            this.setOptionSizes(false, "sizeslider2", "gridHeight");
        if (this.state.preferences.linkImageSize !== this.state.oldPreferences.linkImageSize)
            this.setOptionSizes(false, "sizeslider3", "linkImageSize");
        if (this.state.preferences.linkTextSize !== this.state.oldPreferences.linkTextSize)
            this.setOptionSizes(false, "sizeslider4", "linkTextSize");
        if (this.state.preferences.tabShadowSize !== this.state.oldPreferences.tabShadowSize)
            this.setOptionSizes(false, "sizeslider5", "tabShadowSize");
        if (this.state.preferences.imageShadowSize !== this.state.oldPreferences.imageShadowSize)
            this.setOptionSizes(false, "sizeslider6", "imageShadowSize");
        if (this.state.preferences.linkShadowSize !== this.state.oldPreferences.linkShadowSize)
            this.setOptionSizes(false, "sizeslider7", "linkShadowSize");
        if (this.state.preferences.theme !== this.state.oldPreferences.theme) {
            var themePreferences = this.state.preferences;
            themePreferences.theme = this.state.oldPreferences.theme;
            await this.props.setPreferences(themePreferences);
            this.changeColorInput();
        }
        colorChanges = {
            buttonsColor: null,
            imageShadowColor: null,
            linkShadowColor: null,
            linkTextColor: null,
            tabTextShadowColor: null,
        }
        document.getElementById("saveconfirm").classList.toggle("active");
        document.getElementById("shadow").classList.toggle("active");
        upload = false; toShade = false;
    }

    comparePreferences() {
        if (JSON.stringify(this.state.oldPreferences) !== JSON.stringify(this.state.preferences))
            document.getElementById("savebox").className = "saveBox active";
        else
            document.getElementById("savebox").className = "saveBox";
        if (document.getElementById("resetconfirmbox").className.includes("active"))
            document.getElementById("resetconfirmbox").classList.toggle("active");
    }
    savePreferences() {
        if (upload && document.getElementById("themeuploadimage").src !== "arrow.webp" && document.getElementById("themecontainer2").className.includes("active")) {
            this.props.savePreferences(upload);
        } else {
            if (document.getElementById("themeuploadimage").src === "arrow.webp" && document.getElementById("themecontainer2").className.includes("active")) {
                var themePreferences = this.state.preferences;
                themePreferences.theme = this.state.oldPreferences.theme;
                this.props.setPreferences(themePreferences);
                this.props.savePreferences(false);
            } else {
                this.props.savePreferences(false);
                document.getElementById("themeuploadimage").src = "arrow.webp";
                uploadImage = false;
            }
        }
        if (document.getElementById("savebox").className.includes("active"))
            document.getElementById("savebox").classList.toggle("active");
        if (document.getElementById("saveconfirm").className.includes("active")) {
            document.getElementById("saveconfirm").classList.toggle("active");
            document.getElementById("shadow").classList.toggle("active");
        }
        colorChanges = {
            buttonsColor: null,
            imageShadowColor: null,
            linkShadowColor: null,
            linkTextColor: null,
            tabTextShadowColor: null,
        }
        upload = false; toShade = false;
    }

    render() {
        return (
            <div>
                <div className="navBar" id="navbar">
                    <p className="navTitle" id="navtitle">Options</p>
                    <div className={this.state.uid !== "default" ? "sideSignIn active" : "sideSignIn"} id="sidesignin" onClick={e => this.props.signIn()}>
                        <div className="rocketContainer">
                            <img src="rocket.webp" className="rocket" id="rocket" draggable={false}></img>
                            <img src="flame.webp" className="flame" id="flame" draggable={false}></img>
                        </div>
                        <div className="rocketBase"></div>
                        <p className="baseSignIn" id="basesignin"><b>Sign In</b> To Google To Unlock All Features</p>
                    </div>
                    <div className={this.state.uid !== "default" ? "optionsImages" : "optionsImages active"}>
                        <img className="optionsImage" src="options.webp"></img>
                    </div>
                    {this.state.user !== "default" ?
                        <div>
                            <div className="importBox" id="importbox" onClick={e => this.openImportLinks()} style={{ pointerEvents: this.state.user !== "default" ? "all" : "none" }}>
                                <p className="importText" id="importtext">Import Your Bookmarks</p>
                                <img className="importImage" src="import.webp" draggable={false}></img>
                            </div>

                            <div className="sideContainer" id="sidecontainershow" style={{ marginTop: "1rem", pointerEvents: this.state.user !== "default" ? "all" : "none" }}>
                                <div className="sideContainerHeader" id="sidecontainerheader1" onClick={e => this.toggleOptions("sidecontainershow")}>
                                    <div className="optionDecor" id="optiondecor1"></div>
                                    <img className="optionImage" id="optionimage1" src="visibility.webp" draggable={false}></img>
                                    <p className="sideHeader">Visibility</p>
                                </div>
                                <div className="sideOptions" id="hideoptions">
                                    <Visibility name="Add Tab Button" hideType="addTab" preference={this.state.preferences.addTab} index="1" user={this.state.user} transitionDelay="" hideElement={this.hideElements.bind(this)} display="block"></Visibility>
                                    <Visibility name="Add Link Button" hideType="addLink" preference={this.state.preferences.addLink} index="2" user={this.state.user} transitionDelay="0.1s" hideElement={this.hideElements.bind(this)} display="block"></Visibility>
                                    <Visibility name="Edit Button" hideType="editBtn" preference={this.state.preferences.editBtn} index="3" user={this.state.user} transitionDelay="0.2s" hideElement={this.hideElements.bind(this)} display="block"></Visibility>
                                    <Visibility name="Remove Button" hideType="removeBtn" preference={this.state.preferences.removeBtn} index="4" user={this.state.user} transitionDelay="0.3s" hideElement={this.hideElements.bind(this)} display="block"></Visibility>
                                    <Visibility name="Link Text" hideType="linkText" preference={this.state.preferences.linkText} index="5" user={this.state.user} transitionDelay="0.4s" hideElement={this.hideElements.bind(this)} display="block"></Visibility>
                                    <Visibility name="Tab Arrows" hideType="tabArrows" preference={this.state.preferences.tabArrows} index="6" user={this.state.user} transitionDelay="0.5s" hideElement={this.hideElements.bind(this)}
                                        display={this.state.numTabs < this.state.displayedTabs || (this.state.numTabs === this.state.displayedTabs && this.state.preferences.addTab) ? "none" : "block"}></Visibility>
                                </div>
                            </div>

                            <div className="sideContainer" id="sidecontainercolor" style={{ pointerEvents: this.state.user !== "default" ? "all" : "none" }}>
                                <div className="sideContainerHeader" id="sidecontainerheader2" onClick={e => this.toggleOptions("sidecontainercolor")}>
                                    <div className="optionDecor" id="optiondecor2"></div>
                                    <img className="optionImage" id="optionimage2" src="colors.webp" draggable={false}></img>
                                    <p className="sideHeader">Colors</p>
                                </div>
                                <div className="sideOptions" id="linkoptions">
                                    <ColorViewer name="Link Text" colorType="linkTextColor" colorChanges={colorChanges} index="1" transitionDelay="" preferences={this.state.preferences.linkTextColor} night={this.state.preferences.night} theme={this.state.preferences.theme}
                                        nightColorHex="C7C7C7" dayColorHex="5D687E" themeColorHex="EBEBEB" setColor={this.setOptionsColor.bind(this)} toggleColorView={this.toggleColorView.bind(this)}
                                        setPreviewColor={this.setPreviewColor.bind(this)} adjustBrightness={this.adjustBrightness.bind(this)} adjustHue={this.adjustHue.bind(this)} display={!this.state.preferences.linkText ? "block" : "none"}></ColorViewer>
                                    <ColorViewer name="Link Shadow" colorType="linkShadowColor" index="2" transitionDelay="0.1s" preferences={this.state.preferences.linkShadowColor} night={this.state.preferences.night} theme={this.state.preferences.theme}
                                        nightColorHex="0E0E0E" dayColorHex="F9FBFD" themeColorHex="000000" setColor={this.setOptionsColor.bind(this)} toggleColorView={this.toggleColorView.bind(this)}
                                        setPreviewColor={this.setPreviewColor.bind(this)} adjustBrightness={this.adjustBrightness.bind(this)} adjustHue={this.adjustHue.bind(this)} display={!this.state.preferences.linkText ? "block" : "none"}></ColorViewer>
                                    <ColorViewer name="Image Shadow" colorType="imageShadowColor" index="3" transitionDelay="0.2s" preferences={this.state.preferences.imageShadowColor} night={this.state.preferences.night} theme={this.state.preferences.theme}
                                        nightColorHex="000000" dayColorHex="B6B6B6" themeColorHex="XXXXXX" setColor={this.setOptionsColor.bind(this)} toggleColorView={this.toggleColorView.bind(this)}
                                        setPreviewColor={this.setPreviewColor.bind(this)} adjustBrightness={this.adjustBrightness.bind(this)} adjustHue={this.adjustHue.bind(this)} display="block"></ColorViewer>
                                    <ColorViewer name="Tab Text Shadow" colorType="tabTextShadowColor" index="4" transitionDelay="0.3s" preferences={this.state.preferences.tabTextShadowColor} night={this.state.preferences.night} theme={this.state.preferences.theme}
                                        nightColorHex="000000" dayColorHex="808080" themeColorHex="XXXXXX" setColor={this.setOptionsColor.bind(this)} toggleColorView={this.toggleColorView.bind(this)}
                                        setPreviewColor={this.setPreviewColor.bind(this)} adjustBrightness={this.adjustBrightness.bind(this)} adjustHue={this.adjustHue.bind(this)} display="block"></ColorViewer>
                                    <ColorViewer name="Buttons" colorType="buttonsColor" index="5" transitionDelay="0.4s" preferences={this.state.preferences.buttonsColor} night={this.state.preferences.night} theme={this.state.preferences.theme}
                                        nightColorHex="313131" dayColorHex="C4D3E9" themeColorHex="XXXXXX" setColor={this.setOptionsColor.bind(this)} toggleColorView={this.toggleColorView.bind(this)}
                                        setPreviewColor={this.setPreviewColor.bind(this)} adjustBrightness={this.adjustBrightness.bind(this)} adjustHue={this.adjustHue.bind(this)}
                                        display={this.state.preferences.addLink && this.state.preferences.editBtn && this.state.preferences.removeBtn ? "none" : "block"}></ColorViewer>
                                </div>
                            </div>

                            <div className="sideContainer" id="sidecontainersize" style={{ pointerEvents: this.state.user !== "default" ? "all" : "none" }}>
                                <div className="sideContainerHeader" id="sidecontainerheader3" onClick={e => this.toggleOptions("sidecontainersize")}>
                                    <div className="optionDecor" id="optiondecor3"></div>
                                    <img className="optionImage" id="optionimage3" src="sizes.webp" draggable={false}></img>
                                    <p className="sideHeader">Sizes</p>
                                </div>
                                <div className="sideOptions" id="hideoptions">
                                    <Sizes name="Grid Width" sizeType="gridWidth" index="1" transitionDelay="" size={this.state.preferences.gridWidth} benchmark={20} resetSize={this.resetSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setOptionSizes.bind(this)} display="block"></Sizes>
                                    <Sizes name="Grid Height" sizeType="gridHeight" index="2" transitionDelay="0.08s" size={this.state.preferences.gridHeight} benchmark={20} resetSize={this.resetSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setOptionSizes.bind(this)} display="block"></Sizes>
                                    <Sizes name="Link Image" sizeType="linkImageSize" index="3" transitionDelay="0.16s" size={this.state.preferences.linkImageSize} benchmark={50} resetSize={this.resetSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setOptionSizes.bind(this)} display="block"></Sizes>
                                    <Sizes name="Link Text" sizeType="linkTextSize" index="4" transitionDelay="0.24s" size={this.state.preferences.linkTextSize} benchmark={50} resetSize={this.resetSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setOptionSizes.bind(this)} display={!this.state.preferences.linkText ? "block" : "none"}></Sizes>
                                    <Sizes name="Tab Text Shadow" sizeType="tabShadowSize" index="5" transitionDelay="0.32s" size={this.state.preferences.tabShadowSize} benchmark={1} resetSize={this.resetSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setOptionSizes.bind(this)} display="block"></Sizes>
                                    <Sizes name="Image Shadow" sizeType="imageShadowSize" index="6" transitionDelay="0.4s" size={this.state.preferences.imageShadowSize} benchmark={20} resetSize={this.resetSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setOptionSizes.bind(this)} display="block"></Sizes>
                                    <Sizes name="Link Shadow" sizeType="linkShadowSize" index="7" transitionDelay="0.48s" size={this.state.preferences.linkShadowSize} benchmark={35} resetSize={this.resetSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setOptionSizes.bind(this)} display="block" display={!this.state.preferences.linkText ? "block" : "none"}></Sizes>
                                </div>
                            </div>

                            <div className="sideContainer" id="sidecontainerthemes" style={{ pointerEvents: this.state.user !== "default" ? "all" : "none" }}>
                                <div className="sideContainerHeader" id="sidecontainerheader4" onClick={e => this.toggleOptions("sidecontainerthemes")}>
                                    <div className="optionDecor" id="optiondecor4"></div>
                                    <img className="optionImage" id="optionimage4" src="themes.webp" draggable={false}></img>
                                    <p className="sideHeader">Themes</p>
                                </div>
                                <div className="sideOptions" id="themeoptions">
                                    <div className={!this.state.preferences.theme ? "themeContainer active" : "themeContainer"}
                                        id="themecontainer1" onClick={e => this.setTheme()}>
                                        <div className="themeSelect"></div>
                                        <p className="themeSelectText">Default</p>
                                    </div>
                                    <div className={this.state.preferences.theme && !this.state.preferences.theme.includes("/default") ? "themeContainer active" : "themeContainer"}
                                        id="themecontainer2">
                                        <div className="themeSelect">
                                            <input onClick={e => this.setUploadTheme(e, false)} type="file" id="addtheme" className="addTheme" accept="image/*"></input>
                                            <img className="themeUploadImage" id="themeuploadimage" src={uploadImage ? uploadImage : this.state.oldPreferences.theme && !this.state.oldPreferences.theme.includes("/default") ?
                                                this.state.oldPreferences.theme : "arrow.webp"} draggable={false}></img>
                                        </div>
                                        <p className="themeSelectText" onClick={e => this.setUploadTheme(e, true)}>Upload</p>
                                    </div>
                                    <div className="themeGrid">
                                        {
                                            this.state.themes.map((each) =>
                                                <img className={this.state.preferences.theme === each.image ? "themeImage active" : "themeImage"} id={each.image} key={each.name}
                                                    onClick={e => this.setTheme(each.image)} src={each.image} draggable={false}></img>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="saveBox" id="savebox" onClick={e => this.savePreferences()}>
                                <p className="saveText">Save Changes</p>
                            </div>

                            <div className={JSON.stringify(this.state.preferences) !== JSON.stringify(this.state.defaultPreferences) ? "resetBox active" : "resetBox"} id="resetbox">
                                <p className="resetPreferences" id="resetpreferences" onClick={e => this.toggleReset()}>Reset Default Settings</p>
                                <div className="resetConfirmBox" id="resetconfirmbox">
                                    <p className="resetConfirm" id="resetconfirm">Are you sure you want to reset all settings?</p>
                                    <button className="resetBtn" onClick={e => this.toggleActive("resetconfirmbox")}><img className="resetCancel" src="cancel.webp" draggable={false}></img></button>
                                    <button className="resetBtn" onClick={e => this.resetPreferences()}><div className="resetCheck"></div></button>
                                </div>
                            </div>

                            <div className="sideNightContainer" id="sidenightcontainer">
                                <p className="sideNightLabel" id="sidelabel">Night Mode</p>
                                <button className={this.state.preferences.night ? "nightContainer active" : "nightContainer"} id="nightmodecontainer" onClick={e => this.nightMode()}
                                    style={{ pointerEvents: this.state.user === "default" || this.state.preferences.theme ? "none" : "all" }}>
                                    <img src="sun.webp" className="nightImg" draggable={false}></img>
                                    <img src="moon.webp" className="nightImg" style={{ marginLeft: "20px" }} draggable={false}></img>
                                    <div className="nightSwitch" id="nightswitch"></div>
                                </button>
                            </div>
                        </div> : <div></div>
                    }
                </div>
                <div className="saveConfirm" id="saveconfirm">
                    <p className="saveConfirmText" id="saveconfirmtext">Would you like to save your changes?</p>
                    <button className="saveConfirmBtn" onClick={e => this.closeSave()}><img className="saveConfirmImg" src="cancel.webp" draggable={false}></img></button>
                    <button className="saveConfirmBtn" onClick={e => this.savePreferences()}><div className="saveCheck"></div></button>
                </div>
            </div>
        );
    }

    async resetPreferences() {
        await this.props.setPreferences(JSON.parse(JSON.stringify(this.state.defaultPreferences)));
        await this.props.savePreferences();

        if (document.getElementById("savebox").className.includes("active"))
            document.getElementById("savebox").classList.toggle("active");

        document.getElementById("colorinput1").value = "5D687E";
        document.getElementById("colorinput2").value = "F9FBFD";
        document.getElementById("colorinput3").value = "B6B6B6";
        document.getElementById("colorinput4").value = "808080";
        document.getElementById("colorinput5").value = "C4D3E9";

        document.getElementById("sizeslider1").value = this.state.defaultPreferences.gridWidth;
        document.getElementById("sizeslider2").value = this.state.defaultPreferences.gridHeight;
        document.getElementById("sizeslider3").value = this.state.defaultPreferences.linkImageSize;
        document.getElementById("sizeslider4").value = this.state.defaultPreferences.linkTextSize;
        document.getElementById("sizeslider5").value = this.state.defaultPreferences.tabShadowSize;
        document.getElementById("sizeslider6").value = this.state.defaultPreferences.imageShadowSize;
        document.getElementById("sizeslider7").value = this.state.defaultPreferences.linkShadowSize;

        colorChanges = {
            buttonsColor: null,
            imageShadowColor: null,
            linkShadowColor: null,
            linkTextColor: null,
            tabTextShadowColor: null,
        }
        this.changeColorInput();
        upload = false; toShade = false;
        document.getElementById("resetconfirmbox").classList.toggle("active");
    }
}