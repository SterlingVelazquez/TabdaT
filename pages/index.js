import React from 'react';
import Head from 'next/head';
import {database} from "../tools/database.js";
import {firebase} from "../tools/config.js"
import AddLink from "../forms/addLink.js"
import AddTab from "../forms/addTab.js"
import EditLink from "../forms/editLink.js"
import EditTab from "../forms/editTab.js"
import "./_app.js"

var provider = new firebase.auth.GoogleAuthProvider();
var key = 0;

class Home extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
        user: "default",
        uid: "default",
        tabs : [],
        currTab : {
          name: '',
          color : '',
        },
        selectedTab : [],
        inputText : '',
        links : [],
        linkIndex : 0,
        allLinks : [],
        selectedLink : {
          name: '',
          image:'',
          link:'',
          ref:'',
        },
        profilePic :
          <div onClick={e => this.signIn()} className="profilePic">
            <p>Sign In</p>
            <img src="black-male.png" id="profilepic"></img>
          </div>
      }; 
    this.tabCallback = this.tabCallback.bind(this);
    this.linkCallback = this.linkCallback.bind(this);
    this.editLinkCallback = this.editLinkCallback.bind(this);
    this.editTabCallback = this.editTabCallback.bind(this);
  }

  async componentDidMount() {
    firebase.auth().onAuthStateChanged(async function(user) {
      if (user) {
        var preferences = await database.getPreferences(user.uid);
        if (preferences.length !== 0) 
          if (preferences[0].night === 'true' && document.getElementById("container").className === "container") 
            this.toggleNightMode();
        this.setState({
          user:user,
          uid:user.uid,
          profilePic : 
          <div onClick={e => this.signOut()} className="profilePic">
              <p>Sign Out</p>
              <img src={user.photoURL} id="profilepic"></img>
          </div>,
        }, async function() {
          this.setState({tabs : await database.getTabs(this.state.uid)})
          if (this.state.tabs.length !== 0)
            this.setState({selectedTab : this.state.tabs[0].name})
          this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
          this.setState({allLinks: await database.getAllLinks(this.state.uid)})
          this.getImages();
        })
      } else {
        this.setState({tabs : await database.getTabs(this.state.uid)})
        if (this.state.tabs.length !== 0)
          this.setState({selectedTab : this.state.tabs[0].name})
        this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
        this.setState({allLinks: await database.getAllLinks(this.state.uid)})
        this.getImages();
      }
    }.bind(this))
  }

  async get() {
    this.setState({tabs : await database.getTabs(this.state.uid)})
    if (this.state.tabs.length !== 0) 
      this.setState({selectedTab : this.state.tabs[0].name})
    this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
    this.getImages();
  }

  async signIn() {
    this.setState({user : await firebase.auth().signInWithPopup(provider)});
    if (this.state.user === "default") {
      this.setState({
        profilePic : 
          <div onClick={e => this.signIn()} className="profilePic">
            <p>Sign In</p>
            <img src={document.getElementById("container").className === "container focus" ? "white-male.png" : "black-male.png"} id="profilepic"></img>
          </div>,
      })
    } else {
      this.setState({
        profilePic : 
          <div onClick={e => this.signOut()} className="profilePic">
            <p>Sign Out</p>
            <img src={this.state.user.additionalUserInfo.profile.picture} id="profilepic"></img>
          </div>,
        uid : this.state.user.user.uid,
        allLinks : await database.getAllLinks(this.state.uid)
      })
      this.get();
    }
  }

  async signOut() {
    if (document.getElementById("erasebox").className === "modBox active") {
      this.eraseActive();
    } else if (document.getElementById("editbox").className === "modBox focus") {
      this.editActive();
    }
    this.setState({
      user: "default",
      uid: "default",
      profilePic : 
        <div onClick={e => this.signIn()} className="profilePic">
          <p>Sign In</p>
          <img src={document.getElementById("container").className === "container focus" ? "white-male.png" : "black-male.png"} id="profilepic"></img>
        </div>
    })
    await firebase.auth().signOut();
    this.get();
    this.setState({allLinks: await database.getAllLinks(this.state.uid)})
    console.log(document.getElementById("editbox"))
  }

  async setInputText(event) {
    this.setState({inputText: event.target.value}, async function() {
      if (this.state.inputText !== '') {
        this.setState({links: await database.stringSearch(this.state.inputText, this.state.allLinks)});
        this.getImages();
      } else {
        this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
        this.getImages();
      }
    });
  }

  async getImages() {
    var list = this.state.links;
    for (var i = 0; i < list.length; i++) {
      if (typeof list[i].ref !== "undefined") {
        await firebase.storage().ref(list[i].ref).getDownloadURL().then((res) => {
          list[i].image = res;
        })
      }
    }
    this.setState({links: this.state.links})
  }

  async updateTabs(each) {
    this.setState({selectedTab : await each.name})
    this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
    this.getImages();
  }

  tabCallback = async (tab) => {
    tab.pos = this.state.tabs.length;
    await database.addTab(tab, this.state.uid);
    this.setState({tabs : await database.getTabs(this.state.uid)})
    this.setState({selectedTab : tab.name})
    this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
    this.getImages();
  }

  linkCallback = async (link) => {
    link.pos = this.state.links.length;
    link.tab = this.state.selectedTab;
    await database.addLink(link, this.state.uid);
    this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
    this.setState({allLinks: await database.getAllLinks(this.state.uid)})
    this.getImages();
  }

  editActive() {
    if (document.getElementById("trashimg").src.includes("cancel"))
      this.eraseActive();
    document.getElementById("editbox").classList.toggle("focus");
    document.getElementById("grid").classList.toggle("focus");
    document.getElementById("buttonnav").classList.toggle("focus");
    if (document.getElementById("editimg").src.includes("edit")) {
      document.getElementById("editimg").src = "cancel.png"
    } else {
      document.getElementById("editimg").src = "edit.png"
    }
  }

  editLinkCallback = async (link) => {
    link.tab = this.state.selectedTab;
    await database.editLink(link, this.state.uid, this.state.selectedLink.ref, [this.state.selectedLink.name]);
    this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
    this.setState({allLinks: await database.getAllLinks(this.state.uid)})
    this.getImages();
  }

  editTabCallback = async (tab) => {
    tab.pos = this.state.currTab.pos;
    await database.editTab(tab, this.state.uid, this.state.currTab.name);
    this.setState({tabs : await database.getTabs(this.state.uid)})
    this.setState({selectedTab : tab.name})
    this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
    this.getImages();
  }

  eraseActive() {
    if (document.getElementById("editimg").src.includes("cancel"))
      this.editActive();
    if (document.getElementById("edittabdiv").className === "addTabDiv active")
      this.openTabEdit(this.state.currTab);
    document.getElementById("erasebox").classList.toggle("active");
    document.getElementById("grid").classList.toggle("active");
    document.getElementById("buttonnav").classList.toggle("active");
    if (document.getElementById("trashimg").src.includes("trash")) {
      document.getElementById("trashimg").src = "cancel.png"
    } else {
      document.getElementById("trashimg").src = "trash.png"
    }
  }

  async confirmErase(e) {
    e.stopPropagation();
    var toErase = [];
    var selectedLinks = document.getElementsByClassName("linkCheckBox");
    for (var i = 0; i < selectedLinks.length; i++) {
      if (selectedLinks[i].checked)
        toErase.push(selectedLinks[i].value)
    }
    if (toErase.length !== 0) 
      await database.eraseLinks(this.state.uid, toErase);
    this.get();
    this.setState({allLinks: await database.getAllLinks(this.state.uid)})
    this.eraseActive();
  }

  async eraseTab(e, tab) {
    e.stopPropagation();
    await database.eraseTab(this.state.uid, tab);
    this.get();
  }

  async changeLinks(num) {
    var max = Math.ceil(this.state.links.length / 10) - 1;
    var result = this.state.linkIndex + num;
    if (result > max) {
      this.setState({linkIndex : 0})
    } else if (result < 0) {
      this.setState({linkIndex : max})
    } else {
      this.setState({linkIndex : result})
    }
  }

  toggleNightMode() {
    document.getElementById("nightmodecontainer").classList.toggle("active");
    document.getElementById("container").classList.toggle("focus");
    if (document.getElementById("container").className === "container focus") {
      if (this.state.user === "default")
        document.getElementById("profilepic").src = "white-male.png"
      firebase.database().ref(this.state.uid + '/Preferences/NightMode').update({night: "true"})
    } else {
      if (this.state.user === "default")
        document.getElementById("profilepic").src = "black-male.png"
      firebase.database().ref(this.state.uid + '/Preferences/NightMode').update({night: "false"})
    }
  }

  render() {
    return (
      <div className="container" id="container">
        <Head>
          <title>TabdaT</title>
          <link rel="icon" href="/favicon.ico"/>

          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&display=swap" rel="stylesheet"></link>
          <script src="https://kit.fontawesome.com/3499f6733d.js" crossorigin="anonymous"></script>
        </Head>

        <main>
            <p style={{color:"black"}} className="title">
              <span className="letter">T</span>
              <span className="letter">ɑ</span>
              <span className="letter">b</span>
              <span className="letter">d</span>
              <span className="letter">ɒ</span>
              <span className="letter">T</span>
            </p>

            <div className="bodyBox">
              {this.state.profilePic}

              <div className="modBox" id="editbox" onClick={e => this.editActive()} style={{display: this.state.user === "default" ? "none" : "block"}}>
                <button className="modBtn">
                  <img className="modImg" id="editimg" src="edit.png"></img>
                  <p className="modText">Choose A Tab/Link</p>
                </button>
              </div>

              <div className="modBox" id="erasebox" onClick={e => this.eraseActive()} style={{display: this.state.user === "default" ? "none" : "block", top:"155px"}}>
                <button className="modBtn">
                  <img className="modImg" id="trashimg" src="trash.png"></img>
                  <p className="modText" onClick={e => this.confirmErase(e)}>Confirm</p>
                </button>
              </div>

              <input className="searchBar" placeholder="Search for your links here..." onChange={e => this.setInputText(e)}></input>
              <br/>
              <div className = "buttonNav" id="buttonnav">
                {
                  this.state.tabs.slice(0,4).map( (each) => 
                    <button className={this.state.selectedTab === each.name ? "navBtns active" : "navBtns"} type="button" 
                      style={{borderBottomColor:each.color}} key={key++} onClick={e => this.updateTabs(each)}>
                      <div className="openTabEdit" id="opentabedit" onClick={e => this.openTabEdit(each)}></div>
                      <img className="trashTab" id="trashtab" onClick={e => this.eraseTab(e, each.name)} src="trash.png"></img>
                      <p className="navBtnText" style={{color:each.color}}>{each.name}</p>
                      <div className="navBtnBottom" style={{background:each.color}}></div>
                    </button>
                  )
                }
              </div>
              <AddTab addTab={this.tabCallback.bind(this)} isUser={this.state.user} numTabs={this.state.tabs.length}/>
              <EditTab editTab={this.editTabCallback.bind(this)} currTab={this.state.currTab}/>
              <br/>

              <div className="grid" id="grid">
              <img className="leftLinkArrow" id="leftarrow" src="gray-arrow.png" onClick={e => this.changeLinks(-1)}
                style={{display: this.state.links.length > 10 ? "block" : "none"}}></img>
              {
                this.state.links.slice(this.state.linkIndex * 10, this.state.linkIndex * 10 + 10).map( (each) =>
                  <a className="linkBox" style={{textDecoration:"none"}} target="_blank" rel="noopener noreferrer" key={key++} href={each.link}>
                    <input className="linkCheckBox" type="checkbox" value={each.name} name="link"></input>
                    <div className="editDiv" id="editdiv" onClick={e => this.openEditForm(e, each)}>
                      <img src={each.image} key={key++} className="linkImg"></img>
                      <p className="linkNames">{each.name}</p>
                    </div>
                  </a>
                )
              }
              <img className="rightLinkArrow" id="rightarrow" src="gray-arrow.png" onClick={e => this.changeLinks(1)}
                style={{display: this.state.links.length > 10 ? "block" : "none"}}></img>
              </div>
              
              <br/>
              <div className="addContainer" style={this.state.user === "default" || this.state.tabs.length === 0 ? 
                {display:"none"} : {display:"inline-flex"}} onClick={e => this.openAddLink()}>
                <div className="addSlider">
                  <img src="plus.png"></img>
                </div>
                <button className="addLink">Add New Link</button>
              </div>
            </div>

            <footer>
              <button className="nightContainer" id="nightmodecontainer" onClick={e => this.toggleNightMode()} >
                <img src="sun.png" className="nightImg"></img>
                <img src="moon.png" className="nightImg" style={{marginLeft:"20px"}}></img>
                <div className="nightSwitch" id="nightswitch"></div>
              </button>
            </footer>

          </main>

          <div className="shadow" id="shadow"></div>

          <AddLink addLink={this.linkCallback.bind(this)} userId={this.state.uid} currTab={this.state.selectedTab}/>
          <EditLink editLink={this.editLinkCallback.bind(this)} currLink={this.state.selectedLink}/>

        </div>
    )
  }

  openAddLink() {
    document.getElementById("AddFormDiv").style.top = "calc(50% - 230px)";
    document.getElementById("AddFormDiv").style.opacity = "1";
    document.getElementById("AddFormDiv").style.boxShadow = "0 0 20px rgb(246, 247, 253)";
    document.getElementById("shadow").style.opacity = "0.4";
    document.getElementById("shadow").style.height = "100%";
  }

  openEditForm(e, link) {
    e.preventDefault();
    this.setState({selectedLink: link});
    document.getElementById("EditFormDiv").style.top = "calc(50% - 230px)";
    document.getElementById("EditFormDiv").style.opacity = "1";
    document.getElementById("EditFormDiv").style.boxShadow = "0 0 20px rgb(246, 247, 253)";
    document.getElementById("shadow").style.opacity = "0.4";
    document.getElementById("shadow").style.height = "100%";
  }

  openTabEdit(each) {
    this.setState({currTab:each})
    document.getElementById("colorpicker2").value = each.color;
    document.getElementById("tabinput2").style.color = each.color;
    document.getElementById("tabinput2").value = each.name;
    document.getElementById("buttonnav").classList.toggle("focus");
    document.getElementById("edittabdiv").classList.toggle("active");
    document.getElementById("addtabplus").classList.toggle("active");
    document.getElementById("tabinput2").classList.toggle("active");
    document.getElementById("colorpicker2").classList.toggle("active");
    document.getElementById("tabcancel2").classList.toggle("active");
    document.getElementById("tabsubmit2").classList.toggle("active");
  }
}

export default Home;