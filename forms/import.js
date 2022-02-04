import React from 'react';

var key = 0;

export class Import extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabs: this.props.tabs,
            bookmarks: [],
            suggestions: [],
        }
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            tabs: props.tabs,
            suggestions: props.suggestions,
        }
    }

    openSteps() {
        document.getElementById("openfile").addEventListener('change', async (event) => {
            if (event.target.files.length !== 0) {
                var files = event.target.files,
                    reader = new FileReader();
                var info = document.getElementById("info");
                var bookmarks = [];
                reader.readAsText(files[0])
                reader.onload = function () {
                    info.innerHTML = reader.result;
                    var items = info.getElementsByTagName("dt");
                    for (var i = 1; i < items.length; i++)
                        bookmarks.push({
                            name: items[i].textContent.trim(),
                            link: items[i].innerHTML.substring(9, (items[i].innerHTML.indexOf("add_date=") - 2)),
                        })
                    this.setState({ bookmarks: bookmarks });
                    document.getElementById("bookmarkbox").classList.toggle("focus");
                    document.getElementById("bookmarkbox").classList.toggle("active");
                }.bind(this)
            }
            event.target.value = null;
        })
    }

    selectAll() {
        var checkBoxes = document.getElementsByClassName("bookmarkCheck");
        var checked = 0;
        for (var i = 0; i < checkBoxes.length; i++)
            if (checkBoxes[i].checked) checked++;

        var isEqual = checked === checkBoxes.length;
        for (var i = 0; i < checkBoxes.length; i++)
            checkBoxes[i].checked = isEqual ? false : true;
    }

    async submitForm() {
        var toAdd = [];
        var count = 0;
        var pos = 0;
        var selectedLinks = document.getElementsByClassName("bookmarkCheck");
        var completeLinks = [];
        for (var i = 0; i < selectedLinks.length; i++) {
            if (selectedLinks[i].checked)
                toAdd.push(this.state.bookmarks[i])
        }
        if (toAdd.length === 0) {
            this.closeImport();
        } else {
            for (var i = 0; i < this.state.tabs.length; i++) {
                if (this.state.tabs[i].name === "My Bookmarks")
                    count++;
            }
            if (count === 0) {
                var tab = {
                    name: "My Bookmarks",
                    color: "#828282",
                }
                this.props.addTab(tab, false)
            }
            for (var j = 0; j < toAdd.length; j++) {
                if (toAdd[j].name.includes('/') || toAdd[j].name.includes('$') || toAdd[j].name.includes('.') || toAdd[j].name.includes('[') ||
                    toAdd[j].name.includes(']') || toAdd[j].name.includes('#'))
                    toAdd[j].name = toAdd[j].name.replace(/[\[\]\/\.#\$]/g, " ")

                if (toAdd[j].name.charAt(0).match(/[A-Z]/i)) {
                    toAdd[j].image = "ultafedIgm/" + toAdd[j].name.charAt(0).toUpperCase() + ".png";
                } else {
                    toAdd[j].image = "ultafedIgm/doggo.png";
                }
                for (var k = 0; k < this.state.suggestions.length; k++) {
                    if (toAdd[j].link.includes(this.state.suggestions[k].url)) {
                        toAdd[j].image = this.state.suggestions[k].image;
                        k = this.state.suggestions.length;
                    }
                }

                completeLinks.push({
                    name: toAdd[j].name,
                    link: toAdd[j].link,
                    image: toAdd[j].image,
                    pos: pos++,
                    tab: "My Bookmarks"
                })
            }
            this.props.addLinks(completeLinks);
            this.closeImport();
        }
    }

    switchView() {
        document.getElementById("bookmarkbox").classList.toggle("focus");
        document.getElementById("bookmarkbox").classList.toggle("active");
    }

    closeImport() {
        document.getElementById("bookmarkbox").classList.toggle("active");
        document.getElementById("shadow").classList.toggle("active");
    }

    closeTeach() {
        document.getElementById("bookmarkbox").classList.toggle("focus");
        document.getElementById("shadow").classList.toggle("active");
    }

    render() {
        return (
            <div className="bookmarkBox" id="bookmarkbox">
                <div className="importTeacher" id="importteacher">
                    <h1 className="teachHeader">How To Get Your Bookmarks</h1>
                    <div className="teachHeaderLine"></div>
                    <img type="button" src="cancel.webp" className="bookmarkCancel" onClick={e => this.closeTeach()}></img>
                    <ol className="teachSteps" id="teachsteps">
                        <li className="step">Select the <img className="dots" src="dots.webp"></img> icon (located at the top-right of your browser)
                            and go to <b>Bookmarks {' > '} Bookmark Manager</b></li>
                        <li className="step">Select the <img className="dots" src="dots.webp"></img> icon again (located below the previous icon)
                            and click on <b>Export Bookmarks</b></li>
                        <li className="step">Save your file somewhere you can easily access it again</li>
                        <li className="step">Click the button below and locate the file you saved in the previous step</li>
                    </ol>
                    <div className="importButton">
                        <input className="openFile" id="openfile" onClick={e => this.openSteps()} type="file" accept=".html"></input>
                        <button className="openFileButton">Upload Your Bookmarks</button>
                    </div>
                </div>
                <div className="submitImportContainer" id="submitimportcontainer">
                    <div className="info" id="info" style={{ display: "none" }}></div>
                    <h1 className="bookmarkHead" id="bookmarkhead">Choose which<br />bookmarks to import</h1>
                    <button className="selectAll" id="selectall" style={{display: this.state.bookmarks[0] ? "inline-block" : "none"}} 
                        onClick={e => this.selectAll()}>Select All</button>
                    <button className="confirmBookmark" id="confirmbookmark" style={{display: this.state.bookmarks[0] ? "inline-block" : "none"}} 
                        onClick={e => this.submitForm()}>Confirm</button>
                    {this.state.bookmarks[0] ?
                        <ul className="bookmarkList" id="bookmarklist">
                            {
                                this.state.bookmarks.map((each) =>
                                    <div className="itemContainer" id="itemcontainer" key={key++}>
                                        <label className="bookmarkItem">{each.name}
                                            <input type="checkbox" className="bookmarkCheck" value={each}></input></label>
                                    </div>
                                )
                            }
                        </ul> :
                        <p className="noBookmarks">No bookmarks in this file...</p>
                    }
                    <p className="backButton" id="bookmarkBackButton" onClick={e => this.switchView()}>&#8592;</p>
                    <img type="button" src="cancel.webp" className="bookmarkCancel" onClick={e => this.closeImport()}></img>
                </div>
            </div>
        )
    }
}