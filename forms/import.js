import React from 'react';

var key=0;

export class Import extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            tabs : this.props.tabs,
            bookmarks : [],
        }
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            tabs : props.tabs,
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
                    this.setState({bookmarks: bookmarks});
                    document.getElementById("bookmarkbox").classList.toggle("focus");
                    document.getElementById("bookmarkbox").classList.toggle("active");
                }.bind(this)
            }
            event.target.value = null;
        })
    }

    selectAll() {
        var checked = document.getElementsByClassName("bookmarkCheck");
        for (var i = 0; i < checked.length; i++) {
            checked[i].checked = !checked[i].checked;
        }
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
                completeLinks.push({
                    name: toAdd[j].name,
                    link: toAdd[j].link,
                    image: toAdd[j].name.charAt(0).match(/[A-Z]/i) ? "ultafedIgm/" + toAdd[j].name.charAt(0).toUpperCase() + ".png" : "ultafedIgm/doggo.png",
                    pos: pos++,
                    tab: "My Bookmarks"
                })
            }
            this.props.addLinks(completeLinks);
            this.closeImport();
        }
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
                    <img type="button" src="cancel.png" className="bookmarkCancel" onClick={e => this.closeTeach()}></img>
                    <ol className="teachSteps" id="teachsteps">
                        <li className="step">Select the <img className="dots" src="dots.png"></img> icon (located at the top-right of your browser) 
                            and go to <b>Bookmarks {' > '} Bookmark Manager</b></li>
                        <li className="step">Select the <img className="dots" src="dots.png"></img> icon again (located below the previous icon) 
                            and click on <b>Export Bookmarks</b></li>
                        <li className="step">Save your file somewhere you can easily access it again</li>
                        <li className="step">Click the button below and locate the file you saved in the previous step</li>
                    </ol>
                    <input className="openFile" id="openfile" onClick={e => this.openSteps()} type="file" accept=".html"></input>
                    <button className="openFileButton">Upload Your Bookmark File</button>
                </div>
                <div className="submitImportContainer" id="submitimportcontainer">
                    <div className="info" id="info" style={{display:"none"}}></div>
                    <h1 className="bookmarkHead" id="bookmarkhead">Choose which bookmarks to import</h1>
                    <button className="selectAll" id="selectall" onClick={e => this.selectAll()}>Select All</button>
                    <button className="confirmBookmark" id="confirmbookmark" onClick={e => this.submitForm()}>Confirm</button>
                    <ul className="bookmarkList" id="bookmarklist">
                        {
                            this.state.bookmarks.map( (each) => 
                                <div className="itemContainer" id="itemcontainer" key={key++}>
                                    <label className="bookmarkItem">{each.name}
                                    <input type="checkbox" className="bookmarkCheck" value={each}></input></label>
                                </div>
                            )
                        }
                    </ul>
                    <img type="button" src="cancel.png" className="bookmarkCancel" onClick={e => this.closeImport()}></img>
                </div>
            </div>
        )
    }
}