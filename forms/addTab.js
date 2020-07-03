import React from 'react';

export class AddTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            name : "", 
            color : "#000000",
            user: this.props.isUser,
            tabs: this.props.tabs,
            numTabs: this.props.tabs.length,
            tabIndex: this.props.tabIndex,
        };
        this.submitForm = this.submitForm.bind(this);
    }

    static getDerivedStateFromProps(props) {
        return {
            user : props.isUser,
            tabs: props.tabs,
            numTabs: props.tabs.length,
            tabIndex: props.tabIndex,
        }
    }

    setName(event) {
        var count = 0;
        this.setState({name: event.target.value});
        if (event.target.value.includes('/') || event.target.value.includes('.') || event.target.value.includes('#') || event.target.value.includes('$')
            || event.target.value.includes('[') || event.target.value.includes(']')) {
            document.getElementById("taberrmsg").style.display = "block";
        } else {
            document.getElementById("taberrmsg").style.display = "none";
        }
        for (var i = 0; i < this.state.tabs.length; i++) {
            if (event.target.value === this.state.tabs[i].name)
                count++;
        }
        if (count !== 0) {
            document.getElementById("titletaberrmsg").style.display = "block";
        } else {
            document.getElementById("titletaberrmsg").style.display = "none";
        }
    }
    async setColor() {
        this.setState({color: await document.getElementById("colorpicker").value})
    }

    async submitForm(event) {
        event.preventDefault();
        var newTab = ({
            name: this.state.name,
            color: this.state.color,
        });
        if (newTab.name.includes('/') || newTab.name.includes('.') || newTab.name.includes('#') || newTab.name.includes('$')
            || newTab.name.includes('[') || newTab.name.includes(']')) {
            document.getElementById("taberrmsg").style.display = "block";
        } else {
            var count = 0;
            for (var i = 0; i < this.state.tabs.length; i++) {
                if (newTab.name === this.state.tabs[i].name)
                    count++;
            }
            if (count !== 0) {
                document.getElementById("titletaberrmsg").style.display = "block";
            } else {
                this.props.addTab(newTab, false);
                this.viewTab();
            }
        }
    }

    viewTab() {
        document.getElementById("addtabdiv").classList.toggle("active");
        document.getElementById("taberrmsg").style.display = "none";
        document.getElementById("titletaberrmsg").style.display = "none";
        document.getElementById("addtabform").reset();
        if (!(document.getElementById("edittabdiv").className.includes("active"))) {
            document.getElementById("addtabplus").classList.toggle("active");
            document.getElementById("lefttabarrow").classList.toggle("active");
            document.getElementById("righttabarrow").classList.toggle("active");
          }
        window.formOpen = false;
        if (document.getElementById("container").className === "container focus") {
            this.setState({color:"#9C9C9C"})
        } else {
            this.setState({color:"#000000"})
        }
    }

    render () {
        return (
            <div className="addTabDiv" id="addtabdiv" style={this.state.user === "default" ? {display:"none"} : {display:"inline-flex"}}>
                <img className="addTabPlus active" id="addtabplus" src="plus.png" onClick={e => this.viewTab()}
                    style={{marginLeft: this.state.numTabs % 4 === 0 ? "-8px" : "60px", display: this.state.tabIndex < Math.floor(this.state.numTabs / 4) ? "none" : "block"}}></img>
                <form className="addTabForm" id="addtabform" onSubmit={this.submitForm}>
                    <p className="tabErrMsg" id="taberrmsg">Can't contain: . [ ] # $ /</p>
                    <p className="tabErrMsg" id="titletaberrmsg" style={{left:"3.5rem"}}>Name taken</p>
                    <input className="tabInput" id="tabinput" type="text" placeholder="Tab Name" onChange={e => this.setName(e)} style={{color:this.state.color}} required></input>
                    <input className="colorPicker" id="colorpicker" onChange={e => this.setColor()} type="color"></input>
                    <button className="tabCancel" id="tabcancel" type="button" onClick={e => this.viewTab()}>Cancel</button>
                    <button className="tabSubmit" id="tabsubmit" type="submit">Submit</button>
                </form>
            </div>
        );
    }
}