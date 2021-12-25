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
    upload = false;

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

    hideAddTab() {
        this.props.checkAddTab(false);
        var hidePreferences = this.state.preferences;
        hidePreferences.addTab = !hidePreferences.addTab;
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }
    hideAddLink() {
        var hidePreferences = this.state.preferences;
        hidePreferences.addLink = !hidePreferences.addLink;
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }
    hideEditBtn() {
        if (document.getElementById("buttonnav").className.includes("edit"))
            this.props.editActive();
        var hidePreferences = this.state.preferences;
        hidePreferences.editBtn = !hidePreferences.editBtn;
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }
    hideLinkText() {
        var hidePreferences = this.state.preferences;
        hidePreferences.linkText = !hidePreferences.linkText;
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }
    hideRemoveBtn() {
        if (document.getElementById("buttonnav").className.includes("erase"))
            this.props.eraseActive();
        var hidePreferences = this.state.preferences;
        hidePreferences.removeBtn = !hidePreferences.removeBtn;
        this.props.setPreferences(hidePreferences);
        this.comparePreferences();
    }
    hideTabArrows() {
        this.props.checkAddTab(true);
        var hidePreferences = this.state.preferences;
        hidePreferences.tabArrows = !hidePreferences.tabArrows;
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
                colorPreferences.linkTextColor = toSet ? newColor : (colorChanges.linkTextColor !== null && !noSave ? colorChanges.linkTextColor : this.state.oldPreferences.linkTextColor);
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
                colorPreferences.linkShadowColor = toSet ? newColor : (colorChanges.linkShadowColor !== null && !noSave ? colorChanges.linkShadowColor : this.state.oldPreferences.linkShadowColor);
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
        if (document.getElementById("defaultcolor3").style.opacity !== "0.5" || !(["000000", "B6B6B6"].includes(newColor)) || !toSet) {
            if ((toSet && newColor !== this.state.preferences.imageShadowColor) ||
                (!toSet && this.state.oldPreferences.imageShadowColor !== this.state.preferences.imageShadowColor)) {
                var colorPreferences = this.state.preferences;
                colorPreferences.imageShadowColor = toSet ? newColor : (colorChanges.imageShadowColor !== null && !noSave ? colorChanges.imageShadowColor : this.state.oldPreferences.imageShadowColor);
                this.props.setPreferences(colorPreferences);
                document.getElementById("colorinput3").value = toSet ? newColor : (this.state.oldPreferences.imageShadowColor ? this.state.oldPreferences.imageShadowColor :
                    (document.getElementById("container").className.includes("active") ? "000000" : "B6B6B6"));
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
                colorPreferences.tabTextShadowColor = toSet ? newColor : (colorChanges.tabTextShadowColor !== null && !noSave ? colorChanges.tabTextShadowColor : this.state.oldPreferences.tabTextShadowColor);
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
                colorPreferences.buttonsColor = toSet ? newColor : (colorChanges.buttonsColor !== null && !noSave ? colorChanges.buttonsColor : this.state.oldPreferences.buttonsColor);
                this.props.setPreferences(colorPreferences);
                document.getElementById("colorinput5").value = toSet ? newColor : (this.state.oldPreferences.buttonsColor ? this.state.oldPreferences.buttonsColor :
                    (document.getElementById("container").className.includes("active") ? "313131" : "F9FBFD"));
                this.comparePreferences();
            }
            if (!isPreview && toSet)
                colorChanges.buttonsColor = newColor;
        }
    }
    setDefaultLinkTextColor() {
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
        delete (parts[0]);
        for (var i = 1; i <= 3; ++i) {
            parts[i] = parseInt(parts[i]).toString(16);
            if (parts[i].length == 1) parts[i] = '0' + parts[i];
        }
        return (parts.join('')).toUpperCase();
    }


    updateSlideNum(input, number) {
        document.getElementById(number).innerHTML = document.getElementById(input).value;
    }
    setGridWidth(toSave, id) {
        var newValue = parseInt(document.getElementById(id).value);
        if (newValue !== this.state.preferences.gridWidth && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.gridWidth = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.gridWidth = this.state.oldPreferences.gridWidth;
            this.props.setPreferences(sizePreferences);
            document.getElementById(id).value = this.state.oldPreferences.gridWidth;
        }
    }
    setGridHeight(toSave, id) {
        var newValue = parseInt(document.getElementById(id).value);
        if (newValue !== this.state.preferences.gridHeight && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.gridHeight = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.gridHeight = this.state.oldPreferences.gridHeight;
            this.props.setPreferences(sizePreferences);
            document.getElementById(id).value = this.state.oldPreferences.gridHeight;
        }
    }
    setLinkImageSize(toSave, id) {
        var newValue = parseInt(document.getElementById(id).value);
        if (newValue !== this.state.preferences.linkImageSize && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkImageSize = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkImageSize = this.state.oldPreferences.linkImageSize;
            this.props.setPreferences(sizePreferences);
            document.getElementById(id).value = this.state.oldPreferences.linkImageSize;
        }
    }
    setLinkTextSize(toSave, id) {
        var newValue = parseInt(document.getElementById(id).value);
        if (newValue !== this.state.preferences.linkTextSize && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkTextSize = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkTextSize = this.state.oldPreferences.linkTextSize;
            this.props.setPreferences(sizePreferences);
            document.getElementById(id).value = this.state.oldPreferences.linkTextSize;
        }
    }
    setTabShadowSize(toSave, id) {
        var newValue = parseInt(document.getElementById(id).value);
        if (newValue !== this.state.preferences.tabShadowSize && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.tabShadowSize = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.tabShadowSize = this.state.oldPreferences.tabShadowSize;
            this.props.setPreferences(sizePreferences);
            document.getElementById(id).value = this.state.oldPreferences.tabShadowSize;
        }
    }
    setImageShadowSize(toSave, id) {
        var newValue = parseInt(document.getElementById(id).value);
        if (newValue !== this.state.preferences.imageShadowSize && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.imageShadowSize = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.imageShadowSize = this.state.oldPreferences.imageShadowSize;
            this.props.setPreferences(sizePreferences);
            document.getElementById(id).value = this.state.oldPreferences.imageShadowSize;
        }
    }
    setLinkShadowSize(toSave, id) {
        var newValue = parseInt(document.getElementById(id).value);
        if (newValue !== this.state.preferences.linkShadowSize && toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkShadowSize = newValue;
            this.props.setPreferences(sizePreferences);
            this.comparePreferences();
        } else if (!toSave) {
            var sizePreferences = this.state.preferences;
            sizePreferences.linkShadowSize = this.state.oldPreferences.linkShadowSize;
            this.props.setPreferences(sizePreferences);
            document.getElementById(id).value = this.state.oldPreferences.linkShadowSize;
        }
    }
    resetGridWidth(id) {
        var sizePreferences = this.state.preferences;
        sizePreferences.gridWidth = 20;
        this.props.setPreferences(sizePreferences);
        document.getElementById(id).value = 20;
        this.comparePreferences();
    }
    resetGridHeight(id) {
        var sizePreferences = this.state.preferences;
        sizePreferences.gridHeight = 20;
        this.props.setPreferences(sizePreferences);
        document.getElementById(id).value = 20;
        this.comparePreferences();
    }
    resetLinkImageSize(id) {
        var sizePreferences = this.state.preferences;
        sizePreferences.linkImageSize = 50;
        this.props.setPreferences(sizePreferences);
        document.getElementById(id).value = 50;
        this.comparePreferences();
    }
    resetLinkTextSize(id) {
        var sizePreferences = this.state.preferences;
        sizePreferences.linkTextSize = 50;
        this.props.setPreferences(sizePreferences);
        document.getElementById(id).value = 50;
        this.comparePreferences();
    }
    resetTabShadowSize(id) {
        var sizePreferences = this.state.preferences;
        sizePreferences.tabShadowSize = 1;
        this.props.setPreferences(sizePreferences);
        document.getElementById(id).value = 1;
        this.comparePreferences();
    }
    resetImageShadowSize(id) {
        var sizePreferences = this.state.preferences;
        sizePreferences.imageShadowSize = 20;
        this.props.setPreferences(sizePreferences);
        document.getElementById(id).value = 20;
        this.comparePreferences();
    }
    resetLinkShadowSize(id) {
        var sizePreferences = this.state.preferences;
        sizePreferences.linkShadowSize = 10;
        this.props.setPreferences(sizePreferences);
        document.getElementById(id).value = 10;
        this.comparePreferences();
    }

    toggleActiveImage(id, isChosen) {
        if (isChosen) {
            if (document.getElementById("themecontainer1").className.includes("active"))
                document.getElementById("themecontainer1").classList.toggle("active")
            else if (document.getElementById("themecontainer2").className.includes("active"))
                document.getElementById("themecontainer2").classList.toggle("active")
        } else if (id === "themecontainer1" && !(document.getElementById("themecontainer1").className.includes("active"))) {
            if (document.getElementById("themecontainer2").className.includes("active"))
                document.getElementById("themecontainer2").classList.toggle("active")
            document.getElementById(id).classList.toggle("active");
        } else if (id === "themecontainer2" && !(document.getElementById("themecontainer2").className.includes("active"))) {
            if (!(document.getElementById("themeuploadimage").src.includes("arrow.png"))) {
                var themePreferences = this.state.preferences;
                themePreferences.theme = document.getElementById("themeuploadimage").src;
                this.props.setPreferences(themePreferences);
            }
            else if (document.getElementById("themecontainer1").className.includes("active"))
                document.getElementById("themecontainer1").classList.toggle("active")
            document.getElementById(id).classList.toggle("active");
        }
        this.comparePreferences();
    }
    setDefaultTheme() {
        if (!(document.getElementById("themecontainer1").className.includes("active"))) {
            var themePreferences = this.state.preferences;
            themePreferences.theme = false;
            this.props.setPreferences(themePreferences);
            this.toggleActiveImage("themecontainer1", false);
        }
    }
    setChosenTheme(id) {
        if (this.state.preferences.theme !== id) {
            var themePreferences = this.state.preferences;
            themePreferences.theme = id;
            this.props.setPreferences(themePreferences);
            this.toggleActiveImage(id, true)
        }
    }
    setUploadTheme(event) {
        event.stopPropagation();
        document.getElementById("addtheme").addEventListener('change', async (event) => {
            if (event.target.files.length !== 0) {
                var files = event.target.files, reader = new FileReader();
                reader.onload = function () {
                    document.getElementById("themeuploadimage").src = reader.result;
                    var themePreferences = this.state.preferences;
                    themePreferences.theme = reader.result;
                    this.props.setPreferences(themePreferences);
                    if (!(document.getElementById("themecontainer2").className.includes("active"))) {
                        if (document.getElementById("themecontainer1").className.includes("active"))
                            document.getElementById("themecontainer1").classList.toggle("active")
                        document.getElementById("themecontainer2").classList.toggle("active");
                    }
                    this.comparePreferences();
                }.bind(this)
                upload = files[0];
                reader.readAsDataURL(files[0]);
            }
        })
    }
    closeThemes() {
        if (!this.state.preferences.theme) {
            this.toggleActiveImage("themecontainer1");
            document.getElementById("themeuploadimage").src = "arrow.png";
        } else if (this.state.preferences.theme.includes("https://i.pinimg.com/")) {
            this.toggleActiveImage(this.state.preferences.theme, true);
            document.getElementById("themeuploadimage").src = "arrow.png";
        } else {
            if (!(document.getElementById("themecontainer2").className.includes("active"))) {
                if (document.getElementsByClassName("themeImage active").length > 0)
                    document.getElementsByClassName("themeImage active")[0].classList.toggle("active")
                else if (document.getElementById("themecontainer1").className.includes("active"))
                    document.getElementById("themecontainer1").classList.toggle("active")
                document.getElementById("themecontainer2").classList.toggle("active");
            }
            document.getElementById("themeuploadimage").src = this.state.preferences.theme;
        }
    }

    async nightMode() {
        if (!(this.state.preferences.theme)) {
            this.props.toggleNightMode();
            this.comparePreferences();
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
        if (this.state.preferences.linkText !== this.state.oldPreferences.linkText)
            this.hideLinkText();
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
        if (this.state.preferences.gridWidth !== this.state.oldPreferences.gridWidth)
            this.setGridWidth(false, "sizeslider1");
        if (this.state.preferences.gridHeight !== this.state.oldPreferences.gridHeight)
            this.setGridHeight(false, "sizeslider2");
        if (this.state.preferences.linkImageSize !== this.state.oldPreferences.linkImageSize)
            this.setLinkImageSize(false, "sizeslider3");
        if (this.state.preferences.linkTextSize !== this.state.oldPreferences.linkTextSize)
            this.setLinkTextSize(false, "sizeslider4");
        if (this.state.preferences.tabShadowSize !== this.state.oldPreferences.tabShadowSize)
            this.setTabShadowSize(false, "sizeslider5");
        if (this.state.preferences.imageShadowSize !== this.state.oldPreferences.imageShadowSize)
            this.setImageShadowSize(false, "sizeslider6");
        if (this.state.preferences.linkShadowSize !== this.state.oldPreferences.linkShadowSize)
            this.setLinkShadowSize(false, "sizeslider7");
        if (this.state.preferences.theme !== this.state.oldPreferences.theme) {
            var themePreferences = this.state.preferences;
            themePreferences.theme = this.state.oldPreferences.theme;
            this.props.setPreferences(themePreferences);
            this.closeThemes();
        }
        document.getElementById("saveconfirm").classList.toggle("active");
        document.getElementById("shadow").classList.toggle("active");
        upload = false;
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
        if (upload && document.getElementById("themeuploadimage").src !== "arrow.png" && document.getElementById("themecontainer2").className.includes("active")) {
            this.props.savePreferences(upload);
        } else {
            if (document.getElementById("themeuploadimage").src === "arrow.png" && document.getElementById("themecontainer2").className.includes("active")) {
                var themePreferences = this.state.preferences;
                themePreferences.theme = this.state.oldPreferences.theme;
                this.props.setPreferences(themePreferences);
                this.props.savePreferences(false);
                this.closeThemes();
            } else {
                this.props.savePreferences(false);
                document.getElementById("themeuploadimage").src = "arrow.png";
            }
        }
        if (document.getElementById("savebox").className.includes("active"))
            document.getElementById("savebox").classList.toggle("active");
        if (document.getElementById("saveconfirm").className.includes("active")) {
            document.getElementById("saveconfirm").classList.toggle("active");
            document.getElementById("shadow").classList.toggle("active");
        }
        upload = false;
    }

    render() {
        return (
            <div>
                <div className="navBar" id="navbar">
                    <p className="navTitle" id="navtitle">Options</p>
                    <div className={this.state.uid !== "default" ? "sideSignIn active" : "sideSignIn"} id="sidesignin" onClick={e => this.props.signIn()}>
                        <div className="rocketContainer">
                            <img src="rocket.png" className="rocket" id="rocket" draggable={false}></img>
                            <img src="flame.png" className="flame" id="flame" draggable={false}></img>
                        </div>
                        <div className="rocketBase"></div>
                        <p className="baseSignIn" id="basesignin"><b>Sign In</b> To Google To Unlock All Features</p>
                    </div>
                    { this.state.user !== "default" ?
                        <div>
                            <div className="importBox" id="importbox" onClick={e => this.openImportLinks()} style={{ pointerEvents: this.state.user !== "default" ? "all" : "none" }}>
                                <p className="importText" id="importtext">Import Your Bookmarks</p>
                                <img className="importImage" src="import.png" draggable={false}></img>
                            </div>

                            <div className="sideContainer" id="sidecontainershow" style={{ marginTop: "1rem", pointerEvents: this.state.user !== "default" ? "all" : "none" }}>
                                <div className="sideContainerHeader" id="sidecontainerheader1" onClick={e => this.toggleOptions("sidecontainershow")}>
                                    <div className="optionDecor" id="optiondecor1"></div>
                                    <img className="optionImage" id="optionimage1" src="visibility.png" draggable={false}></img>
                                    <p className="sideHeader">Visibility</p>
                                </div>
                                <div className="sideOptions" id="hideoptions">
                                    <Visibility name="Add Tab Button" preference={this.state.preferences.addTab} index="1" user={this.state.user} transitionDelay="" hideElement={this.hideAddTab.bind(this)} display="block"></Visibility>
                                    <Visibility name="Add Link Button" preference={this.state.preferences.addLink} index="2" user={this.state.user} transitionDelay="0.1s" hideElement={this.hideAddLink.bind(this)} display="block"></Visibility>
                                    <Visibility name="Edit Button" preference={this.state.preferences.editBtn} index="3" user={this.state.user} transitionDelay="0.2s" hideElement={this.hideEditBtn.bind(this)} display="block"></Visibility>
                                    <Visibility name="Remove Button" preference={this.state.preferences.removeBtn} index="4" user={this.state.user} transitionDelay="0.3s" hideElement={this.hideRemoveBtn.bind(this)} display="block"></Visibility>
                                    <Visibility name="Link Text" preference={this.state.preferences.linkText} index="5" user={this.state.user} transitionDelay="0.4s" hideElement={this.hideLinkText.bind(this)} display="block"></Visibility>
                                    <Visibility name="Tab Arrows" preference={this.state.preferences.tabArrows} index="6" user={this.state.user} transitionDelay="0.5s" hideElement={this.hideTabArrows.bind(this)}
                                        display={this.state.numTabs < this.state.displayedTabs || (this.state.numTabs === this.state.displayedTabs && this.state.preferences.addTab) ? "none" : "block"}></Visibility>
                                </div>
                            </div>

                            <div className="sideContainer" id="sidecontainercolor" style={{ pointerEvents: this.state.user !== "default" ? "all" : "none" }}>
                                <div className="sideContainerHeader" id="sidecontainerheader2" onClick={e => this.toggleOptions("sidecontainercolor")}>
                                    <div className="optionDecor" id="optiondecor2"></div>
                                    <img className="optionImage" id="optionimage2" src="colors.png" draggable={false}></img>
                                    <p className="sideHeader">Colors</p>
                                </div>
                                <div className="sideOptions" id="linkoptions">
                                    <ColorViewer name="Link Text" index="1" transitionDelay="" preferences={this.state.preferences.linkTextColor} night={this.state.preferences.night}
                                        nightColor="rgb(199, 199, 199)" dayColor="rgb(93, 104, 126)" nightColorHex="#C7C7C7" dayColorHex="#5D687E" setColor={this.setLinkTextColor.bind(this)}
                                        setDefaultColor={this.setDefaultLinkTextColor.bind(this)} toggleColorView={this.toggleColorView.bind(this)} setInputColor={this.setInputColor.bind(this)}
                                        setPreviewColor={this.setPreviewColor.bind(this)} adjustBrightness={this.adjustBrightness.bind(this)} adjustHue={this.adjustHue.bind(this)}
                                        display={!this.state.preferences.linkText ? "block" : "none"}></ColorViewer>
                                    <ColorViewer name="Link Shadow" index="2" transitionDelay="0.1s" preferences={this.state.preferences.linkShadowColor} night={this.state.preferences.night}
                                        nightColor="rgb(14, 14, 14)" dayColor="rgb(249, 251, 253)" nightColorHex="#0E0E0E" dayColorHex="#F9FBFD" setColor={this.setLinkShadowColor.bind(this)}
                                        setDefaultColor={this.setDefaultLinkShadowColor.bind(this)} toggleColorView={this.toggleColorView.bind(this)} setInputColor={this.setInputColor.bind(this)}
                                        setPreviewColor={this.setPreviewColor.bind(this)} adjustBrightness={this.adjustBrightness.bind(this)} adjustHue={this.adjustHue.bind(this)} display="block"
                                        display={!this.state.preferences.linkText ? "block" : "none"}></ColorViewer>
                                    <ColorViewer name="Image Shadow" index="3" transitionDelay="0.2s" preferences={this.state.preferences.imageShadowColor} night={this.state.preferences.night}
                                        nightColor="rgb(0, 0, 0)" dayColor="rgb(182, 182, 182)" nightColorHex="#000000" dayColorHex="#B6B6B6" setColor={this.setImageShadowColor.bind(this)}
                                        setDefaultColor={this.setDefaultImageShadowColor.bind(this)} toggleColorView={this.toggleColorView.bind(this)} setInputColor={this.setInputColor.bind(this)}
                                        setPreviewColor={this.setPreviewColor.bind(this)} adjustBrightness={this.adjustBrightness.bind(this)} adjustHue={this.adjustHue.bind(this)} display="block"></ColorViewer>
                                    <ColorViewer name="Tab Text Shadow" index="4" transitionDelay="0.3s" preferences={this.state.preferences.tabTextShadowColor} night={this.state.preferences.night}
                                        nightColor="rgb(0, 0, 0)" dayColor="rgb(128, 128, 128)" nightColorHex="#000000" dayColorHex="#808080" setColor={this.setTabTextShadowColor.bind(this)}
                                        setDefaultColor={this.setDefaultTabTextShadowColor.bind(this)} toggleColorView={this.toggleColorView.bind(this)} setInputColor={this.setInputColor.bind(this)}
                                        setPreviewColor={this.setPreviewColor.bind(this)} adjustBrightness={this.adjustBrightness.bind(this)} adjustHue={this.adjustHue.bind(this)} display="block"></ColorViewer>
                                    <ColorViewer name="Buttons" index="5" transitionDelay="0.4s" preferences={this.state.preferences.buttonsColor} night={this.state.preferences.night}
                                        nightColor="rgb(49, 49, 49)" dayColor="rgb(196, 211, 233)" nightColorHex="#313131" dayColorHex="#C4D3E9" setColor={this.setButtonsColor.bind(this)}
                                        setDefaultColor={this.setDefaultButtonsColor.bind(this)} toggleColorView={this.toggleColorView.bind(this)} setInputColor={this.setInputColor.bind(this)}
                                        setPreviewColor={this.setPreviewColor.bind(this)} adjustBrightness={this.adjustBrightness.bind(this)} adjustHue={this.adjustHue.bind(this)}
                                        display={this.state.preferences.addLink && this.state.preferences.editBtn && this.state.preferences.removeBtn ? "none" : "block"}></ColorViewer>
                                </div>
                            </div>

                            <div className="sideContainer" id="sidecontainersize" style={{ pointerEvents: this.state.user !== "default" ? "all" : "none" }}>
                                <div className="sideContainerHeader" id="sidecontainerheader3" onClick={e => this.toggleOptions("sidecontainersize")}>
                                    <div className="optionDecor" id="optiondecor3"></div>
                                    <img className="optionImage" id="optionimage3" src="sizes.png" draggable={false}></img>
                                    <p className="sideHeader">Sizes</p>
                                </div>
                                <div className="sideOptions" id="hideoptions">
                                    <Sizes name="Grid Width" index="1" transitionDelay="" size={this.state.preferences.gridWidth} benchmark={20} resetSize={this.resetGridWidth.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setGridWidth.bind(this)} display="block"></Sizes>
                                    <Sizes name="Grid Height" index="2" transitionDelay="0.08s" size={this.state.preferences.gridHeight} benchmark={20} resetSize={this.resetGridHeight.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setGridHeight.bind(this)} display="block"></Sizes>
                                    <Sizes name="Link Image" index="3" transitionDelay="0.16s" size={this.state.preferences.linkImageSize} benchmark={50} resetSize={this.resetLinkImageSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setLinkImageSize.bind(this)} display="block"></Sizes>
                                    <Sizes name="Link Text" index="4" transitionDelay="0.24s" size={this.state.preferences.linkTextSize} benchmark={50} resetSize={this.resetLinkTextSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setLinkTextSize.bind(this)} display={!this.state.preferences.linkText ? "block" : "none"}></Sizes>
                                    <Sizes name="Tab Text Shadow" index="5" transitionDelay="0.32s" size={this.state.preferences.tabShadowSize} benchmark={1} resetSize={this.resetTabShadowSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setTabShadowSize.bind(this)} display="block"></Sizes>
                                    <Sizes name="Image Shadow" index="6" transitionDelay="0.4s" size={this.state.preferences.imageShadowSize} benchmark={20} resetSize={this.resetImageShadowSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setImageShadowSize.bind(this)} display="block"></Sizes>
                                    <Sizes name="Link Shadow" index="7" transitionDelay="0.48s" size={this.state.preferences.linkShadowSize} benchmark={10} resetSize={this.resetLinkShadowSize.bind(this)}
                                        updateSlideNum={this.updateSlideNum.bind(this)} setSize={this.setLinkShadowSize.bind(this)} display="block" display={!this.state.preferences.linkText ? "block" : "none"}></Sizes>
                                </div>
                            </div>

                            <div className="sideContainer" id="sidecontainerthemes" style={{ pointerEvents: this.state.user !== "default" ? "all" : "none" }}>
                                <div className="sideContainerHeader" id="sidecontainerheader4" onClick={e => this.toggleOptions("sidecontainerthemes")}>
                                    <div className="optionDecor" id="optiondecor4"></div>
                                    <img className="optionImage" id="optionimage4" src="themes.png" draggable={false}></img>
                                    <p className="sideHeader">Themes</p>
                                </div>
                                <div className="sideOptions" id="themeoptions">
                                    <div className={!this.state.preferences.theme ? "themeContainer active" : "themeContainer"}
                                        id="themecontainer1" onClick={e => this.setDefaultTheme()}>
                                        <div className="themeSelect"></div>
                                        <p className="themeSelectText">Default</p>
                                    </div>
                                    <div className={this.state.preferences.theme && this.state.preferences.theme.includes("ThemeUltafedIgm") ? "themeContainer active" : "themeContainer"}
                                        id="themecontainer2" onClick={e => this.toggleActiveImage("themecontainer2", false)}>
                                        <div className="themeSelect">
                                            <input onClick={e => this.setUploadTheme(e)} type="file" id="addtheme" className="addTheme" accept="image/*"></input>
                                            <img className="themeUploadImage" id="themeuploadimage" src={this.state.preferences.theme && this.state.preferences.theme.includes("ThemeUltafedIgm") ?
                                                this.state.preferences.theme : "arrow.png"} draggable={false}></img>
                                        </div>
                                        <p className="themeSelectText">Upload</p>
                                    </div>
                                    <div className="themeGrid">
                                        {
                                            this.state.themes.map((each) =>
                                                <img className={this.state.preferences.theme === each.image ? "themeImage active" : "themeImage"} id={each.image} key={each.name}
                                                    onClick={e => this.setChosenTheme(each.image)} src={each.image} draggable={false}></img>
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
                                    <button className="resetBtn" onClick={e => this.toggleActive("resetconfirmbox")}><img className="resetCancel" src="cancel.png" draggable={false}></img></button>
                                    <button className="resetBtn" onClick={e => this.resetPreferences()}><div className="resetCheck"></div></button>
                                </div>
                            </div>

                            <div className="sideNightContainer" id="sidenightcontainer">
                                <p className="sideNightLabel" id="sidelabel">Night Mode</p>
                                <button className={this.state.preferences.night ? "nightContainer active" : "nightContainer"} id="nightmodecontainer" onClick={e => this.nightMode()}
                                    style={{ pointerEvents: this.state.user === "default" || this.state.preferences.theme ? "none" : "all" }}>
                                    <img src="sun.png" className="nightImg" draggable={false}></img>
                                    <img src="moon.png" className="nightImg" style={{ marginLeft: "20px" }} draggable={false}></img>
                                    <div className="nightSwitch" id="nightswitch"></div>
                                </button>
                            </div>
                        </div> : <div></div>
                    }
                </div>
                <div className="saveConfirm" id="saveconfirm">
                    <p className="saveConfirmText" id="saveconfirmtext">Would you like to save your changes?</p>
                    <button className="saveConfirmBtn" onClick={e => this.closeSave()}><img className="saveConfirmImg" src="cancel.png" draggable={false}></img></button>
                    <button className="saveConfirmBtn" onClick={e => this.savePreferences()}><div className="saveCheck"></div></button>
                </div>
            </div>
        );
    }

    async resetPreferences() {
        if (JSON.stringify(this.state.preferences) !== JSON.stringify(this.state.defaultPreferences)) {
            await this.props.setPreferences(JSON.parse(JSON.stringify(this.state.defaultPreferences)));
            await this.props.savePreferences();

            if (document.getElementById("container").className === "container night")
                this.props.toggleNightMode();

            if (document.getElementById("savebox").className.includes("active"))
                document.getElementById("savebox").classList.toggle("active");

            document.getElementById("colorinput1").value = document.getElementById("container").className.includes("active") ? "C7C7C7" : "5D687E";
            document.getElementById("colorinput2").value = document.getElementById("container").className.includes("active") ? "0E0E0E" : "F9FBFD";
            document.getElementById("colorinput3").value = document.getElementById("container").className.includes("active") ? "000000" : "B6B6B6";
            document.getElementById("colorinput4").value = document.getElementById("container").className.includes("active") ? "000000" : "808080";
            document.getElementById("colorinput5").value = document.getElementById("container").className.includes("active") ? "313131" : "C4D3E9";

            document.getElementById("sizeslider1").value = this.state.defaultPreferences.gridWidth;
            document.getElementById("sizeslider2").value = this.state.defaultPreferences.gridHeight;
            document.getElementById("sizeslider3").value = this.state.defaultPreferences.linkImageSize;
            document.getElementById("sizeslider4").value = this.state.defaultPreferences.linkTextSize;
            document.getElementById("sizeslider5").value = this.state.defaultPreferences.tabShadowSize;
            document.getElementById("sizeslider6").value = this.state.defaultPreferences.imageShadowSize;
            document.getElementById("sizeslider7").value = this.state.defaultPreferences.linkShadowSize;
        }
        document.getElementById("resetconfirmbox").classList.toggle("active");
    }
}