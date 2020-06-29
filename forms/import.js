import React from 'react';

var key=0;

class Import extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            tabs : this.props.tabs,
            bookmarks : this.props.bookmarks,
        }
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            tabs : props.tabs,
            bookmarks : props.bookmarks
        }
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
            toAdd.push(this.props.bookmarks[i])
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
                if (toAdd[j][0].includes('/') || toAdd[j][0].includes('$') || toAdd[j][0].includes('.') || toAdd[j][0].includes('[') || 
                    toAdd[j][0].includes(']') || toAdd[j][0].includes('#'))
                    toAdd[j][0] = toAdd[j][0].replace(/[\[\]\/\.#\$]/g, " ")
                completeLinks.push({
                    name: toAdd[j][0],
                    link: toAdd[j][1],
                    image: toAdd[j][0].charAt(0).match(/[A-Z]/i) ? "ultafedIgm/" + toAdd[j][0].charAt(0).toUpperCase() + ".png" : "ultafedIgm/doggo.png",
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
        document.getElementById("shadow").style.opacity = "0";
        document.getElementById("shadow").style.height = "0";
    }

    render() {
        return (
            <div className="bookmarkBox" id="bookmarkbox">
                <h1 className="bookmarkHead" id="bookmarkhead">Choose which bookmarks to import</h1>
                <button className="selectAll" id="selectall" onClick={e => this.selectAll()}>Select All</button>
                <button className="confirmBookmark" id="confirmbookmark" onClick={e => this.submitForm()}>Confirm</button>
                <ul className="bookmarkList" id="bookmarklist">
                    {
                        this.state.bookmarks.map( (each) => 
                            <div className="itemContainer" id="itemcontainer" key={key++}>
                                <label className="bookmarkItem">{each[0]}
                                <input type="checkbox" className="bookmarkCheck" value={each}></input></label>
                            </div>
                        )
                    }
                </ul>
                <img type="button" src="cancel.png" className="bookmarkCancel" onClick={e => this.closeImport()}></img>
            </div>
        )
    }
}

export default Import;