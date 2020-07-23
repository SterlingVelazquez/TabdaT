import React from 'react'
import Head from 'next/head'
import { database } from "../tools/database.js"
import { firebase } from "../tools/config.js"
import { AddLink } from "../forms/addLink.js"
import { AddTab } from "../forms/addTab.js"
import { EditLink } from "../forms/editLink.js"
import { EditTab } from "../forms/editTab.js"
import { Import } from "../forms/import.js"
import { NavBar } from "../forms/navBar.js"
import "./_app.js"

var provider = new firebase.auth.GoogleAuthProvider();
var key = 0;

class Home extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      user: "default",
      uid: "default",
      output: [],
      tabs : [],
      selectedTab : "",
      inputText : "",
      links : [],
      linkIndex : 0,
      tabIndex : 0,
      suggestedTitleIndex: -1,
      suggestedIndex: -1,
      tabToErase: null,
      allLinks : [],
      bookmarks: [],
      preferences: [],
      oldPreferences: [],
      defaultPreferences: {
        addLink: false,
        addTab: false,
        buttonsColor: false,
        editBtn: false,
        gridSize:20,
        imageShadowColor: false,
        imageShadowSize:20,
        linkArrows: false,
        linkImageSize:50,
        linkShadowColor: false,
        linkShadowSize:10,
        linkTextColor: false,
        linkTextSize:50,
        night: false,
        numLinks:10,
        removeBtn: false,
        tabArrows: false,
        tabShadowSize:20,
        tabTextShadowColor: false,
    },
      currTab : {
        name: "",
        color : "",
      },
      selectedLink : { 
        name: "",
        link: "",
        image: "",
      },
      profilePic :
        <div onClick={e => this.signIn()} className="profilePic">
          <p>Sign In</p>
          <img src="black-male.png" id="profilepic"></img>
        </div>
    };
    this.tabCallback = this.tabCallback.bind(this);
    this.linkCallback = this.linkCallback.bind(this);
    this.multipleLinkCallback = this.multipleLinkCallback.bind(this);
    this.editLinkCallback = this.editLinkCallback.bind(this);
    this.editTabCallback = this.editTabCallback.bind(this);
    this.editActive = this.editActive.bind(this);
    this.eraseActive = this.eraseActive.bind(this);
    this.signIn = this.signIn.bind(this);
    this.setPreferences = this.setPreferences.bind(this);
    this.savePreferences = this.savePreferences.bind(this);
  }

  async componentDidMount() {
    firebase.auth().onAuthStateChanged(async function(user) {
      if (user) {
        if (!(document.getElementById("sidesignin").className.includes("active")))
          document.getElementById("sidesignin").classList.toggle("active");
        this.setInitialPreferences(await database.getPreferences(user.uid));
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
          if (this.state.tabs.length !== 0) {
            this.setState({
              selectedTab : this.state.tabs[0].name,
              allLinks: await database.getAllLinks(this.state.uid),
            });
            this.setState({links : await this.getLinks(this.state.tabs[0].name)});
          } else {
            this.setState({allLinks: await database.getAllLinks(this.state.uid)});
            this.setState({links : await this.getLinks([])});
          }
          this.getImages();
        })
      } else {
        this.setState({tabs : await database.getTabs(this.state.uid)})
        if (this.state.tabs.length !== 0) {
          this.setState({
            selectedTab : this.state.tabs[0].name,
            allLinks: await database.getAllLinks(this.state.uid),
          })
          this.setState({links : await this.getLinks(this.state.tabs[0].name)});
        } else {
          this.setState({allLinks: await database.getAllLinks(this.state.uid)})
          this.setState({links : await this.getLinks([])});
        }
        this.getImages();
      }
    }.bind(this))
    this.getKeyPresses();
  }

  async spinAnimation() {
    var links = document.getElementsByClassName("linkBox");
    for (var i = 0; i < links.length; i++)
      links[i].classList.toggle("active")
  }

  async get() {
    this.setState({tabs : await database.getTabs(this.state.uid)})
    if (this.state.tabs.length !== 0) {
      this.setState({
        selectedTab : this.state.tabs[0].name,
        allLinks: await database.getAllLinks(this.state.uid),
        linkIndex: 0,
        tabIndex: 0
      })
      this.setState({links : await this.getLinks(this.state.tabs[0].name)});
      this.getImages();
    } else {
      this.setState({
        allLinks: await database.getAllLinks(this.state.uid),
        linkIndex: 0,
        tabIndex: 0
      })
      this.setState({links : await this.getLinks([])});
      this.getImages();
    }
  }

  async getLinks(selectedTab) {
    var links = [];
    for (var i = 0; i < this.state.allLinks.length; i++) {
      if (selectedTab === this.state.allLinks[i].tab)
        links.push(this.state.allLinks[i])
    }
    return links;
  }

  async getImages() {
    var list = this.state.allLinks;
    var count = 0;
    this.spinAnimation();
    length = document.getElementsByClassName("loader").length;
    if (length > 0)
      for (var i = 0; i < length; i++) {
        document.getElementsByClassName("loader")[i].style.display = "grid"
      }
    for (var i = 0; i < list.length; i++) {
      if (typeof list[i].ref !== "undefined") {
        await firebase.storage().ref(list[i].ref).getDownloadURL().then((res) => {
          list[i].image = res;
          count++;
        })
      }
    }
    if (length > 0)
      for (var i = 0; i < length; i++) {
        document.getElementsByClassName("loader")[i].style.display = "none"
      }
    if (count !== 0)
      this.setState({links: this.state.links})
  }

  async setInitialPreferences(preferences) {
    this.setState({preferences: preferences, oldPreferences: JSON.parse(JSON.stringify(preferences))})
    if (preferences.night && !(document.getElementById("container").className.includes("focus"))) {
      document.getElementById("nightmodecontainer").classList.toggle("active");
      document.getElementById("container").classList.toggle("focus");
      document.getElementById("trashimg").src = "trashNight.png";
      document.getElementById("editimg").src = "editNight.png";
      document.getElementById("saveimg").src = "saveNight.png";
    }
    if (preferences.addTab && document.getElementById("addtabplus").className !== "addTabPlus")
      document.getElementById("addtabplus").classList.toggle("active");
    if (preferences.addLink && document.getElementById("addcontainer").className !== "addContainer active") {
      document.getElementById("addcontainer").classList.toggle("active");
      document.getElementById("erasebox").style.top = "-3rem";
      document.getElementById("editbox").style.top = "-3rem";
      document.getElementById("confirmerase").style.top = "-3rem";
    }
    if (preferences.editBtn && document.getElementById("editbox").className !== "modBox hide") {
      document.getElementById("editbox").classList.toggle("hide");
      document.getElementById("erasebox").style.marginLeft = "-4.1rem"
    }
    if (preferences.removeBtn && document.getElementById("erasebox").className !== "modBox hide") {
      document.getElementById("erasebox").classList.toggle("hide");
      document.getElementById("confirmerase").classList.toggle("hide");
      document.getElementById("editbox").style.marginLeft = "6.2rem";
    }
    if (preferences.tabArrows && document.getElementById("lefttabarrow").className !== "leftTabArrow hide") {
      document.getElementById("lefttabarrow").classList.toggle("hide");
      document.getElementById("righttabarrow").classList.toggle("hide");
    }
    if (preferences.linkArrows && document.getElementById("leftarrow").className !== "leftLinkArrow hide") {
      document.getElementById("leftarrow").classList.toggle("hide");
      document.getElementById("rightarrow").classList.toggle("hide");
    }
    if (JSON.stringify(this.state.preferences) !== JSON.stringify(this.state.defaultPreferences))
      document.getElementById("resetbox").classList.toggle("active");
  }
  async setPreferences(pref) {
    this.setState({preferences: pref})
  }
  savePreferences() {
    firebase.database().ref(this.state.uid + "/Preferences").set(this.state.preferences);
    this.setState({oldPreferences: JSON.parse(JSON.stringify(this.state.preferences))})
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
      if (!(document.getElementById("sidesignin").className.includes("active")))
        document.getElementById("sidesignin").classList.toggle("active");
      this.setState({
        profilePic : 
          <div onClick={e => this.signOut()} className="profilePic">
            <p>Sign Out</p>
            <img src={this.state.user.additionalUserInfo.profile.picture} id="profilepic"></img>
          </div>,
        uid : this.state.user.user.uid,
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
    if (document.getElementById("edittabdiv").className === "addTabDiv active")
      this.openTabEdit(this.state.currTab);
    document.getElementById("sidesignin").classList.toggle("active");
    this.setState({
      user: "default",
      uid: "default",
      profilePic : 
        <div onClick={e => this.signIn()} className="profilePic">
          <p>Sign In</p>
          <img src={document.getElementById("container").className === "container focus" ? "white-male.png" : "black-male.png"} id="profilepic"></img>
        </div>
    })
    this.setPreferences({preferences: JSON.parse(JSON.stringify(this.state.defaultPreferences))})
    this.get();
    await firebase.auth().signOut();
  }

  async setInputText(event) {
    this.setState({inputText: event.target.value}, async function() {
      if (this.state.inputText !== '') {
        this.setState({links: await database.stringSearch(this.state.inputText, JSON.parse(JSON.stringify(this.state.allLinks)), 0.75, false)});
      } else {
        this.setState({links : await this.getLinks(this.state.selectedTab)})
      }
    });
  }

  async updateTabs(each) {
    if (each.name !== this.state.selectedTab) {
      this.setState({
        selectedTab : await each.name,
        links : await this.getLinks(each.name),
        linkIndex: 0,
      });
      this.spinAnimation();
    }
  }

  async getDisplayedLinks(name) {
    var links = [];
    for (var i = this.state.linkIndex * this.state.preferences.numLinks; i < this.state.linkIndex * this.state.preferences.numLinks + this.state.preferences.numLinks; i++) {
      if (typeof this.state.links[i] !== "undefined")
        links.push(this.state.links[i].name)
    }
    if (!(links.includes(name))) {
      await this.changeLinks(1);
      this.getDisplayedLinks(name); 
    }
  }

  tabCallback = async (tab) => {
    if (this.state.tabs.length === 0) {
      tab.pos = 0;
    } else {
      tab.pos = this.state.tabs[this.state.tabs.length - 1].pos + 1;
    }
    await database.addTab(tab, this.state.uid);
    var newTab = this.state.tabs;
    newTab.push(tab);
    this.setState({
      tabs : newTab,
      selectedTab : tab.name,
      links : await this.getLinks(tab.name)
    })
  }

  linkCallback = async (link) => {
    document.getElementById("uploadlinkloader").style.display = "block";
    if (link.tab !== this.state.selectedTab)
      while (link.tab !== this.state.selectedTab)
        await this.switchToNextTab();
    if (this.state.links.length !== 0) {
      link.pos = this.state.links[this.state.links.length - 1].pos + 1;
    } else {
      link.pos = 0;
    }
    await database.addLink(link, this.state.uid);
    if (typeof link.image === "object")
      await firebase.storage().ref(this.state.uid + '/' + link.name).getDownloadURL().then((res) => {
        link.image = res;
      })
    var newLinks = this.state.allLinks;
    newLinks.push(link);
    this.setState({allLinks: newLinks})
    this.setState({links : await this.getLinks(this.state.selectedTab)})
    await this.getDisplayedLinks(link.name);
    this.spinAnimation();
    document.getElementById("uploadlinkloader").style.display = "none";
  }

  multipleLinkCallback = async (links) => {
    document.getElementById("uploadlinkloader").style.display = "block";
    await database.addLinks(links, this.state.uid);
    var newArr = this.state.allLinks;
    for (var i = 0; i < links.length; i++)
      newArr.push(links[i])
    this.setState({
      allLinks: newArr,
      linkIndex: 0
    })
    for (var j = 0; j < this.state.tabs.length; j++) {
      if (this.state.tabs[j].name === links[0].tab) {
        break;
      } else if ((j + 1) % 4 === 0 && j > 0) {
        this.changeTabs(1);
      }
    }
    this.setState({links : await this.getLinks("My Bookmarks")})
    this.spinAnimation();
    document.getElementById("uploadlinkloader").style.display = "none";
  }

  editActive() {
    if (document.getElementById("trashimg").src.includes("cancel"))
      this.eraseActive();
    if (document.getElementById("edittabdiv").className === "addTabDiv active")
      this.openTabEdit(this.state.currTab);
    document.getElementById("editbox").classList.toggle("focus");
    document.getElementById("grid").classList.toggle("focus");
    document.getElementById("buttonnav").classList.toggle("focus");
    if (document.getElementById("editimg").src.includes("edit")) {
      document.getElementById("editimg").src = "cancel.png"
    } else {
      if (document.getElementById("container").className === "container focus") {
        document.getElementById("editimg").src = "editNight.png"
        document.getElementById("trashimg").src = "trashNight.png"
      } else {
        document.getElementById("editimg").src = "edit.png"
        document.getElementById("trashimg").src = "trash.png"
      }
    }
  }

  editLinkCallback = async (link, close) => {
    if (close) {
      this.setState({selectedLink: { 
        name: "",
        link: "",
        image: "",
      }})
    } else {
      document.getElementById("uploadlinkloader").style.display = "block";
      var selectedLink = this.state.selectedLink;
      link.pos = selectedLink.pos;
      await database.editLink(link, this.state.uid, selectedLink.ref, [selectedLink.name]);
      if (typeof link.image === "object")
        await firebase.storage().ref(this.state.uid + '/' + link.name).getDownloadURL().then((res) => {
          link.image = res;
        })
      var newLinks = this.state.allLinks;
      for (var i = 0; i < this.state.allLinks.length; i++) {
        if (selectedLink.name === this.state.allLinks[i].name) {
          newLinks.splice(i, 1, link)
          break;
        }
      }
      this.setState({allLinks: newLinks});
      this.setState({links : await this.getLinks(this.state.selectedTab)});
      document.getElementById("uploadlinkloader").style.display = "none";
    }
  }

  editTabCallback = async (tab, close) => {
    if (close) {
      this.setState({currTab: {
        name: "",
        color: ""
      }})
    } else {
      var currTab = this.state.currTab;
      var allLinks = this.state.allLinks;
      tab.pos = currTab.pos;
      await database.editTab(tab, this.state.uid, currTab.name);
      for (var i = 0; i < allLinks.length; i++)
        if (allLinks[i].tab === currTab.name) {
          allLinks[i].tab = tab.name;
          break;
        }
      var newTabs = this.state.tabs;
      for (var j = 0; j < this.state.tabs.length; j++)
        if (currTab.name === this.state.tabs[j].name) {
          newTabs.splice(j, 1, tab);
          break;
        }
      this.setState({
        tabs : newTabs,
        selectedTab : tab.name,
        allLinks: allLinks,
      })
      this.setState({links : await this.getLinks(tab.name)});
    }
  }

  eraseActive() {
    if (document.getElementById("editimg").src.includes("cancel"))
      this.editActive();
    if (document.getElementById("edittabdiv").className === "addTabDiv active")
      this.openTabEdit(this.state.currTab);
    document.getElementById("erasebox").classList.toggle("active");
    document.getElementById("confirmerase").classList.toggle("active");
    document.getElementById("grid").classList.toggle("active");
    document.getElementById("buttonnav").classList.toggle("active");
    if (document.getElementById("trashimg").src.includes("trash")) {
      document.getElementById("trashimg").src = "cancel.png"
    } else {
      if (document.getElementById("container").className === "container focus") {
        document.getElementById("trashimg").src = "trashNight.png"
        document.getElementById("editimg").src = "editNight.png"
      } else {
        document.getElementById("trashimg").src = "trash.png"
        document.getElementById("editimg").src = "edit.png"
      }
    }
  }

  async confirmErase() {
    document.getElementById("deletelinkloader").style.display = "block";
    var toErase = [];
    var selectedLinks = document.getElementsByClassName("linkCheckBox");
    for (var i = 0; i < selectedLinks.length; i++) {
      if (selectedLinks[i].checked)
        toErase.push({
          name: selectedLinks[i].value,
          ref: selectedLinks[i].name,
        })
    }
    if (toErase.length !== 0) { 
      await database.eraseLinks(this.state.uid, toErase);
      var newArr = this.state.allLinks;
      for (var j = 0; j < toErase.length; j++)
        for (var k = 0; k < this.state.allLinks.length; k++)
          if (toErase[j].name === this.state.allLinks[k].name) {
            newArr.splice(k, 1);
            break;
          }
      this.setState({allLinks: newArr})
      this.setState({links : await this.getLinks(this.state.selectedTab)})
      if (this.state.links.length > 1 && this.state.links.length % this.state.preferences.numLinks === 0)
        this.changeLinks(-1);
      this.spinAnimation();
    } else {
      this.eraseActive();
    }
    document.getElementById("deletelinkloader").style.display = "none";
  }

  async confirmTabBox(e, tab) {
    e.stopPropagation();
    this.setState({tabToErase: tab})
    document.getElementById("taberaseconfirm").classList.toggle("active");
    document.getElementById("shadow").classList.toggle("active");
  }

  async eraseTab(e) {
    document.getElementById("taberaseconfirmbox").classList.toggle("active");
    document.getElementById("taberasedeleting").classList.toggle("active");
    await database.eraseTab(this.state.uid, this.state.tabToErase);
    var links = this.state.allLinks;
    var tabs = this.state.tabs;
    for (var i = 0; i < this.state.allLinks.length; i++)
      if (this.state.allLinks[i].tab === this.state.tabToErase)
        links.splice(i, 1);
    for (var j = 0; j < this.state.tabs.length; j++)
      if (this.state.tabs[j].name === this.state.tabToErase) {
        tabs.splice(j, 1);
        break;
      }
    this.setState({
      tabs: tabs,
      allLinks: links,
    })
    if (this.state.tabToErase === this.state.selectedTab && this.state.tabs.length > 0) {
        this.setState({
          selectedTab: this.state.tabs[0].name,
          links: await this.getLinks(this.state.tabs[0].name)
        })
    } else {
      this.setState({
        links: await this.getLinks(this.state.selectedTab)
      })
    }
    this.confirmTabBox(e, null)
    document.getElementById("taberaseconfirmbox").classList.toggle("active");
    document.getElementById("taberasedeleting").classList.toggle("active");
  }

  async changeTabPos(e, moveFront) {
    var tab = e.dataTransfer.getData("text");
    var name = tab.slice(0, tab.indexOf('/'));
    if (tab.slice(tab.indexOf('/') + 1, tab.length) === "tab" && this.state.user !== "default") {
      if (moveFront && name !== this.state.tabs[0].name) {
        await firebase.database().ref(this.state.uid + '/Tabs/' + name).update({pos: this.state.tabs[0].pos - 1})
        var newArr = this.state.tabs;
        for (var i = 0; i < this.state.tabs.length; i++) {
          if (name === this.state.tabs[i].name) {
            var elem = newArr.splice(i, 1)[0];
            elem.pos = this.state.tabs[0].pos - 1;
            newArr.unshift(elem);
            break;
          }
        }
        if (name === this.state.selectedTab) {
          this.setState({
            tabs: newArr,
            tabIndex: 0,
          })
        } else {
          this.setState({tabs: newArr})
        }
      } else if (!moveFront && name !== this.state.tabs[this.state.tabs.length - 1].name) {
        await firebase.database().ref(this.state.uid + '/Tabs/' + name).update({pos: this.state.tabs[this.state.tabs.length - 1].pos + 1})
        var newArr = this.state.tabs;
        for (var i = 0; i < this.state.tabs.length; i++) {
          if (name === this.state.tabs[i].name) {
            var elem = newArr.splice(i, 1)[0];
            elem.pos = this.state.tabs[this.state.tabs.length - 1].pos + 1;
            newArr.push(elem);
            break;
          }
        }
        if (name === this.state.selectedTab) {
          this.setState({
            tabs: newArr,
            tabIndex: this.state.tabs.length % 4 === 0  && this.state.tabs.length > 0 ? Math.floor(this.state.tabs.length / 4) - 1 : Math.floor(this.state.tabs.length / 4),
          })
        } else {
          this.setState({tabs: newArr})
        }
      }
    }
  }

  async changeLinkPos(e, moveFront) {
    var link = e.dataTransfer.getData("text");
    var name = link.slice(0, link.indexOf('/'));
    if (link.slice(link.indexOf('/') + 1, link.length) === "link" && this.state.user !== "default") {
      if (moveFront && name !== this.state.links[0].name) {
        await firebase.database().ref(this.state.uid + '/Links/' + name).update({pos: this.state.links[0].pos - 1})
        for (var i = 0; i < this.state.allLinks.length; i++) {
          if (name === this.state.allLinks[i].name) {
            var newArr = this.state.allLinks;
            var elem = newArr.splice(i, 1)[0];
            elem.pos = this.state.links[0].pos - 1;
            newArr.unshift(elem);
            this.setState({allLinks: newArr})
            break;
          }
        }
        this.setState({links: await this.getLinks(this.state.selectedTab)})
        this.spinAnimation();
      } else if (!moveFront && name !== this.state.links[this.state.links.length - 1].name) {
        await firebase.database().ref(this.state.uid + '/Links/' + name).update({pos: this.state.links[this.state.links.length - 1].pos + 1})
        for (var i = 0; i < this.state.allLinks.length; i++) {
          if (name === this.state.allLinks[i].name) {
            var newArr = this.state.allLinks;
            var elem = newArr.splice(i, 1)[0];
            elem.pos = this.state.links[this.state.links.length - 1].pos + 1;
            newArr.push(elem);
            this.setState({allLinks: newArr})
            break;
          }
        }
        this.setState({links: await this.getLinks(this.state.selectedTab)})
        this.spinAnimation();
      }
    }
  }

  async switchTabs(e, newTab) {
    var link = e.dataTransfer.getData("text");
    var name = link.slice(0, link.indexOf('/'));
    if (link.slice(link.indexOf('/') + 1, link.length) === "link" && newTab !== this.state.selectedTab && this.state.user !== "default") {
      await firebase.database().ref(this.state.uid + '/Links/' + name).update({tab: newTab});
      for (var i = 0; i < this.state.allLinks.length; i++) {
        if (name === this.state.allLinks[i].name) {
          var update = this.state.allLinks;
          update[i].tab = newTab;
          this.setState({allLinks: update})
          break;
        }
      }
      this.setState({links: await this.getLinks(this.state.selectedTab)})
      this.spinAnimation();
    }
  }

  async changeLinks(num) {
    var max = Math.ceil(this.state.links.length / this.state.preferences.numLinks) - 1;
    var result = this.state.linkIndex + num;
    if (result > max) {
      this.setState({linkIndex : 0})
    } else if (result < 0) {
      this.setState({linkIndex : max})
    } else {
      this.setState({linkIndex : result})
    }
    this.spinAnimation();
  }

  async changeTabs(num) {
    var max = Math.floor(this.state.tabs.length / 4);
    var result;
    if (this.state.tabIndex + num === -1) {
      result = max;
    } else {
      result = Math.abs((this.state.tabIndex + num) % (max + 1));
    }
    if (result === 0) {
      this.setState({
        linkIndex : 0,
        tabIndex : 0,
        selectedTab: this.state.tabs[0].name,
        links: await this.getLinks(this.state.tabs[0].name)
      })
    } else if (result === max) {
      if (this.state.tabs.length % 4 === 0) {
        this.setState({
          linkIndex : 0,
          tabIndex : max,
          selectedTab: [],
          links: await this.getLinks([])
        })
      } else {
        this.setState({
          linkIndex : 0,
          tabIndex : max,
          selectedTab: this.state.tabs[this.state.tabs.length - (this.state.tabs.length % 4)].name,
          links: await this.getLinks(this.state.tabs[this.state.tabs.length - (this.state.tabs.length % 4)].name)
        })
      }
    } else {
      this.setState({
        linkIndex : 0,
        tabIndex : result,
        selectedTab: this.state.tabs[result * 4].name,
        links: await this.getLinks(this.state.tabs[result * 4].name)
      })
    }
    this.spinAnimation();
  }

  async switchToNextTab() {
    for (var i = 0; i < this.state.tabs.length; i++) {
      if (this.state.tabs[i].name === this.state.selectedTab) {
        if (i === this.state.tabs.length - 1) {
          this.setState({
            linkIndex : 0,
            tabIndex : 0,
            selectedTab: this.state.tabs[0].name,
            links: await this.getLinks(this.state.tabs[0].name)
          })
        } else if ((i + 1) % 4 === 0) {
          this.changeTabs(1)
        } else {
          this.setState({
            linkIndex : 0,
            selectedTab: this.state.tabs[i + 1].name,
            links: await this.getLinks(this.state.tabs[i + 1].name)
          })
        }
        break;
      }
    }
    this.spinAnimation();
  }

  async switchToPreviousTab() {
    for (var i = 0; i < this.state.tabs.length; i++) {
      if (this.state.tabs[i].name === this.state.selectedTab) {
        if (i === 0) {
          this.setState({
            linkIndex : 0,
            tabIndex : this.state.tabs.length % 4 !== 0 ? Math.floor(this.state.tabs.length / 4) : Math.floor(this.state.tabs.length / 4) - 1,
            selectedTab: this.state.tabs[this.state.tabs.length - 1].name,
            links: await this.getLinks(this.state.tabs[this.state.tabs.length - 1].name)
          })
        } else if (i % 4 === 0) {
          this.setState({
            linkIndex : 0,
            tabIndex : this.state.tabIndex - 1,
            selectedTab: this.state.tabs[i - 1].name,
            links: await this.getLinks(this.state.tabs[i - 1].name)
          })
        } else {
          this.setState({
            linkIndex : 0,
            selectedTab: this.state.tabs[i - 1].name,
            links: await this.getLinks(this.state.tabs[i - 1].name)
          })
        }
        break;
      }
    }
    this.spinAnimation();
  }

  changeSuggestion(num, isAdd) {
    var suggestions = document.getElementsByClassName("suggestionLink");
    var length = suggestions.length;
    var result = (this.state.suggestedIndex + num) % length;
    if (this.state.suggestedIndex + num === length || this.state.suggestedIndex + num < 0) {
      this.setState({suggestedIndex: -1})
      if (isAdd)
        document.getElementById("addurl").focus();
      else
        document.getElementById("editurl").focus();
    } else {
      this.setState({suggestedIndex: result})
      suggestions[result].focus();
    }
  }

  changeTitleSuggestion(num, isAdd) {
    var suggestions = document.getElementsByClassName("suggestionTitle");
    var length = suggestions.length;
    var result = (this.state.suggestedTitleIndex + num) % length;
    if (this.state.suggestedTitleIndex + num === length || this.state.suggestedTitleIndex + num < 0) {
      this.setState({suggestedTitleIndex: -1})
      if (isAdd)
        document.getElementById("addtitle").focus();
      else
        document.getElementById("edittitle").focus();
    } else {
      this.setState({suggestedTitleIndex: result})
      suggestions[result].focus();
    }
  }

  toggleNightMode() {
    document.getElementById("nightmodecontainer").classList.toggle("active");
    document.getElementById("container").classList.toggle("focus");
    var nightMode = this.state.preferences;
    nightMode.night = document.getElementById("container").className === "container focus";
    this.setState({preferences: nightMode});
    if (document.getElementById("container").className === "container focus") {
      if (!(document.getElementById("trashimg").src.includes("cancel.png")) && !(document.getElementById("editimg").src.includes("cancel.png"))) {
        document.getElementById("trashimg").src = "trashNight.png";
        document.getElementById("editimg").src = "editNight.png";
        document.getElementById("saveimg").src = "saveNight.png";
      }
    } else {
      if (!(document.getElementById("trashimg").src.includes("cancel.png")) && !(document.getElementById("editimg").src.includes("cancel.png"))) {
        document.getElementById("trashimg").src = "trash.png";
        document.getElementById("editimg").src = "edit.png";
        document.getElementById("saveimg").src = "save.png";
      }
    }
  }
  
  toggleSideMenu() {
    document.getElementById("navbar").classList.toggle("active");
    document.getElementById("sidemenubtn").classList.toggle("active");
  }

  render() {
    return (
      <div className="container" id="container">
        <Head>
          <title>TabdaT</title>
          <link rel="icon" href="/favicon.ico"/>

          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&display=swap" rel="stylesheet"></link>
          <script type="text/javascript" src="jscolor.js"></script>
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

            <NavBar signIn={this.signIn.bind(this)} toggleNightMode={this.toggleNightMode.bind(this)} setPreferences={this.setPreferences.bind(this)} user={this.state.user} preferences={this.state.preferences}
              oldPreferences={this.state.oldPreferences} savePreferences={this.savePreferences.bind(this)} uid={this.state.uid} editActive={this.editActive.bind(this)} eraseActive={this.eraseActive.bind(this)}
              defaultPreferences={this.state.defaultPreferences}/>

            {this.state.profilePic}

            <input className="searchBar" id="searchbar" placeholder="Search for your links here..." onChange={e => this.setInputText(e)}></input>
            <br/>
            
            <div className = "buttonNav" id="buttonnav">
              <div className="dropTabBox" id="droptabbox" onDragEnter={e => this.dropTabHover(true)} onDragLeave={e => this.dropTabHover(true)} onDrop={e => this.changeTabPos(e, true)}
                onDragOver={e => e.preventDefault()}>
                <p className="dropTabText">Move <br/> to front</p>
              </div>
              <img className="leftTabArrow" id="lefttabarrow" src="gray-arrow.png" onClick={e => this.changeTabs(-1)}
                style={{
                  display: this.state.tabs.length > 3 ? "block" : "none",
                  left: this.state.tabIndex === this.state.tabs.length / 4 && this.state.tabs.length > 0 ? "-8rem" : "-3rem",
                  top: this.state.tabIndex === this.state.tabs.length / 4 && this.state.tabs.length > 0 ? "-1.8rem" : "-0.4rem",
                }}>
              </img>
              {
                this.state.tabs.slice(this.state.tabIndex * 4, this.state.tabIndex * 4 + 4).map( (each) => 
                  <button className={this.state.selectedTab === each.name ? "navBtns active" : "navBtns"} type="button" style={{borderBottomColor:each.color, 
                    textShadow: this.state.preferences.tabTextShadowColor ? '0 0 ' + (0 + (this.state.preferences.tabShadowSize * 0.1) + "px") + ' #' + this.state.preferences.tabTextShadowColor : 
                    '0 0 ' + (0 + (this.state.preferences.tabShadowSize * 0.1) + "px") + ' #' + (this.state.preferences.night ? "000000" : "808080")}} 
                    key={key++} onClick={e => this.updateTabs(each)} onDrop={e => this.switchTabs(e, each.name)} onDragOver={e => e.preventDefault()}
                    draggable={this.state.user !== "default" ? "true" : "false"} onDragStart={e => this.tabDragStart(e, each)}
                    onDragEnd={e => this.dropTabActive()}>
                    <div className="openTabEdit" id="opentabedit" onClick={e => this.openTabEdit(each)}></div>
                    <img className="trashTab" id="trashtab" onClick={e => this.confirmTabBox(e, each.name)} src="trash.png"></img>
                    <p className="navBtnText" style={{color:each.color}}>{each.name}</p>
                    <div className="navBtnBottom" style={{background:each.color}}></div>
                  </button>
                )
              }
              <img className="rightTabArrow" id="righttabarrow" src="gray-arrow.png" onClick={e => this.changeTabs(1)}
                style={{
                  display: this.state.tabs.length > 3 ? "block" : "none",
                  right: this.state.tabIndex === this.state.tabs.length / 4 && this.state.tabs.length > 0 ? "-8rem" : "-3rem",
                  top: this.state.tabIndex === this.state.tabs.length / 4 && this.state.tabs.length > 0 ? "-1.8rem" : "-0.4rem"
                }}>
              </img>
              <div className="dropTabBox" id="droptabbox2" style={{left:"auto", right:"-11rem", background:!(this.state.preferences.night) ? 
                "linear-gradient(to left, rgb(249, 251, 253) 0%,#b6b9d1 100%)" : "linear-gradient(to left, rgb(14, 14, 14) 0%,rgb(46, 46, 46) 100%)", textAlign:"left"}}
                onDragEnter={e => this.dropTabHover(false)} onDragLeave={e => this.dropTabHover(false)} onDrop={e => this.changeTabPos(e, false)} onDragOver={e => e.preventDefault()}>
                <p className="dropTabText" style={{left:"0.4rem", textAlign:"left"}}>Move <br/> to back</p>
              </div>
            </div>

            <AddTab addTab={this.tabCallback.bind(this)} isUser={this.state.user} tabs={this.state.tabs} tabIndex={this.state.tabIndex} preferences={this.state.preferences}/>
            <EditTab editTab={this.editTabCallback.bind(this)} currTab={this.state.currTab} tabs={this.state.tabs} preferences={this.state.preferences}/>
            <br/>

            <div className="grid" id="grid" style={{width: 400 + (this.state.preferences.gridSize * 20) + "px"}}>
              <div className="dropLinkBox" id="droplinkbox" onDragEnter={e => this.dropLinkHover(true)} onDragLeave={e => this.dropLinkHover(true)} onDrop={e => this.changeLinkPos(e, true)}
                onDragOver={e => e.preventDefault()}>
                <p className="dropLinkText">Move <br/> to front</p>
              </div>
              <img className="leftLinkArrow" id="leftarrow" src="gray-arrow.png" onClick={e => this.changeLinks(-1)}
                style={{display: this.state.links.length > this.state.preferences.numLinks ? "block" : "none"}}></img>
              {
                this.state.links.slice(this.state.linkIndex * this.state.preferences.numLinks, 
                  this.state.linkIndex * this.state.preferences.numLinks + this.state.preferences.numLinks).map( (each) =>
                  <a className="linkBox" style={{textDecoration:"none", width:75 + (this.state.preferences.linkImageSize * 1.5) + "px"}} target="_blank" rel="noopener noreferrer" key={key++} href={each.link} 
                    draggable={this.state.user !== "default" ? "true" : "false"} onDragStart={e => this.linkDragStart(e, each)}
                    onDragEnd={e => this.dropLinkActive()}>
                    <label className="eraseLabel"><input className="linkCheckBox" type="checkbox" value={each.name} name={each.ref}></input></label>
                    <div className="editDiv" id="editdiv" value={each} onClick={e => this.openEditForm(e, each)}>
                      <img src={each.image} key={key++} className="linkImg" style={{boxShadow: this.state.preferences.imageShadowColor ? '0 0 ' + (this.state.preferences.imageShadowSize + "px") + ' #' + 
                        this.state.preferences.imageShadowColor : (this.state.preferences.night ? '0 0 ' + (this.state.preferences.imageShadowSize + "px") + " #4D4D4D" : '0 0 ' + 
                        (this.state.preferences.imageShadowSize + "px") + " #B6B6B6"), width:45 + (this.state.preferences.linkImageSize * 0.9) + "px", height:45 + (this.state.preferences.linkImageSize * 0.9) + "px"}}></img>
                      <p className="linkNames" style={{color: this.state.preferences.linkTextColor ? '#' + this.state.preferences.linkTextColor : (this.state.preferences.night ? "rgb(199, 199, 199)" : 
                        "rgb(82, 86, 92)"), textShadow: this.state.preferences.linkShadowColor ? '0 0 ' + (0 + (this.state.preferences.linkShadowSize * 0.3) + "px")
                        + ' #' + this.state.preferences.linkShadowColor : '0 0 ' + (0 + (this.state.preferences.linkShadowSize * 0.3) + "px") + ' #' + (this.state.preferences.night ? "0E0E0E" : "F9FBFD"), 
                        fontSize: 10 + (this.state.preferences.linkTextSize * 0.08) + "px"}}>{each.name}</p>
                      <div className="loaderDiv" id="loaderdiv">
                        <div className="loader" id="loader">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </div>
                      </div>
                    </div>
                  </a>
                )
              }
              <img className="rightLinkArrow" id="rightarrow" src="gray-arrow.png" onClick={e => this.changeLinks(1)}
                style={{display: this.state.links.length > this.state.preferences.numLinks ? "block" : "none"}}></img>
              <div className="dropLinkBox" id="droplinkbox2" onDragEnter={e => this.dropLinkHover(false)} onDragLeave={e => this.dropLinkHover(false)} onDrop={e => this.changeLinkPos(e, false)} 
                onDragOver={e => e.preventDefault()} style={{left:"auto", right:"-11rem", background: !(this.state.preferences.night) ? 
                "linear-gradient(to left, rgb(249, 251, 253) 0%,#b6b9d1 100%)" : "linear-gradient(to left, rgb(14, 14, 14) 0%,rgb(37, 37, 37) 100%)", textAlign:"left"}}>
                <p className="dropLinkText" style={{left:"0.4rem", textAlign:"left"}}>Move <br/> to back</p>
              </div>
            </div>

            <br/>
            <div className="addContainer" id="addcontainer" style={this.state.user === "default" || this.state.tabs.length === 0 || 
              (this.state.tabIndex === this.state.tabs.length / 4 && this.state.tabs.length > 0) ? 
                {display:"none"} : {display:"inline-flex"}} onClick={e => this.openAddLink()}>
              <div className="addSlider">
                <img src="plus.png"></img>
              </div>
              <button className="addLink" style={{background: this.state.preferences.buttonsColor ? '#' + this.state.preferences.buttonsColor :
                '#' + (this.state.preferences.night ? "313131" : "F9FBFD")}}><b>Add New Link</b></button>
              <p className="uploadLinkLoader" id="uploadlinkloader">
                <span className="linkLoadLetter">U</span>
                <span className="linkLoadLetter">p</span>
                <span className="linkLoadLetter">l</span>
                <span className="linkLoadLetter">o</span>
                <span className="linkLoadLetter">a</span>
                <span className="linkLoadLetter">d</span>
                <span className="linkLoadLetter">i</span>
                <span className="linkLoadLetter">n</span>
                <span className="linkLoadLetter">g</span>
                <span className="linkLoadLetter">.</span>
                <span className="linkLoadLetter">.</span>
                <span className="linkLoadLetter">.</span>
              </p>
              <p className="uploadLinkLoader" id="deletelinkloader">
                <span className="linkLoadLetter">D</span>
                <span className="linkLoadLetter">e</span>
                <span className="linkLoadLetter">l</span>
                <span className="linkLoadLetter">e</span>
                <span className="linkLoadLetter">t</span>
                <span className="linkLoadLetter">i</span>
                <span className="linkLoadLetter">n</span>
                <span className="linkLoadLetter">g</span>
                <span className="linkLoadLetter">.</span>
                <span className="linkLoadLetter">.</span>
                <span className="linkLoadLetter">.</span>
              </p>
            </div>
            <br/>

            <div className="modBox" id="editbox" onClick={e => this.editActive()} style={{display: this.state.user === "default" ? "none" : "inline-table"}}>
              <button className="modBtn" style={{background: this.state.preferences.buttonsColor ? '#' + this.state.preferences.buttonsColor :
                '#' + (this.state.preferences.night ? "313131" : "F9FBFD")}}>
                <img className="modImg" id="editimg" src="edit.png"></img>
                <p className="modTextEdit">Edit</p>
              </button>
              <p className="modText">Choose A Tab/Link</p>
              <p className="modTextClose" onClick={e => this.editActive()}>Close</p>
            </div>

            <div className="modBox" id="erasebox" onClick={e => this.eraseActive()} style={{display: this.state.user === "default" ? "none" : "inline-table"}}>
              <button className="modBtn" style={{background: this.state.preferences.buttonsColor ? '#' + this.state.preferences.buttonsColor :
                '#' + (this.state.preferences.night ? "313131" : "F9FBFD")}}>
                <img className="modImg" id="trashimg" src="trash.png"></img>
                <p className="modTextErase">Remove</p>
              </button>
              <p className="modTextClose" onClick={e => this.eraseActive()}>Close</p>
            </div>

            <div className="modBoxConfirm" id="confirmerase" onClick={e => this.confirmErase()} style={{display: this.state.user === "default" ? "none" : "inline-flex"}}>
              <button className="modBtnConfirm" id="modbtnconfirm" style={{background: this.state.preferences.buttonsColor ? '#' + this.state.preferences.buttonsColor :
                '#' + (this.state.preferences.night ? "313131" : "F9FBFD")}}>
                <div className="modImgConfirm" id="modimgconfirm"></div>
              </button>
              <p className="modTextConfirm" onClick={e => this.confirmErase()}>Confirm</p>
            </div>
          </div>

        </main>

      <div className="tabEraseConfirm" id="taberaseconfirm">
        <div className="tabEraseConfirmBox" id="taberaseconfirmbox">
          <p className="tabEraseConfirmText">Are you sure you want to <span style={{color:"rgb(255, 121, 121)"}}>remove</span> your <b>{this.state.tabToErase}</b> tab and all of its links?</p>
          <button className="tabEraseConfirmBtn" onClick={e => this.confirmTabBox(e, null)}><img className="tabEraseImg" src="cancel.png"></img></button>
          <button className="tabEraseConfirmBtn" onClick={e => this.eraseTab(e)}><div className="tabEraseCheck"></div></button>
        </div>
        <div className="tabEraseDeleting" id="taberasedeleting">
          <p className="tabEraseDeletingText">Deleting...</p>
          <div className="deleteLoader" id="deleteloader">
            <div className="sk-chase" id="deleteloading">
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="shadow" id="shadow"></div>

      <AddLink addLink={this.linkCallback.bind(this)} userId={this.state.uid} currTab={this.state.selectedTab} tabs={this.state.tabs} allLinks={this.state.allLinks}/>
      <EditLink editLink={this.editLinkCallback.bind(this)} currLink={this.state.selectedLink} currTab={this.state.selectedTab} tabs={this.state.tabs} allLinks={this.state.allLinks}/>
      <Import addTab={this.tabCallback.bind(this)} addLinks={this.multipleLinkCallback.bind(this)} tabs={this.state.tabs}/>

    </div>
    )
  }

  openAddLink() {
    document.getElementById("AddFormDiv").classList.toggle("active");
    document.getElementById("shadow").classList.toggle("active");
  }
  openEditForm(e, link) {
    e.preventDefault();
    this.setState({selectedLink: link});
    document.getElementById("EditFormDiv").classList.toggle("active");
    document.getElementById("shadow").classList.toggle("active");
  }
  openTabEdit(each) {
    this.setState({currTab:each})
    document.getElementById("colorpicker2").value = each.color;
    document.getElementById("tabinput2").style.color = each.color;
    document.getElementById("tabinput2").value = each.name;
    document.getElementById("buttonnav").classList.toggle("focus");
    document.getElementById("edittabdiv").classList.toggle("active");
    if (!(document.getElementById("addtabdiv").className.includes("active"))) {
      if (!this.state.preferences.addTab)
        document.getElementById("addtabplus").classList.toggle("active");
      document.getElementById("lefttabarrow").classList.toggle("active");
      document.getElementById("righttabarrow").classList.toggle("active");
    }
  }

  async tabDragStart(e, tab) {
    e.dataTransfer.setData("text", tab.name + '/tab')
    await this.dropTabActive();
  }
  async linkDragStart(e, link) {
    e.dataTransfer.setData("text", link.name + '/link')
    await this.dropLinkActive();
  }
  async dropTabActive() {
    document.getElementById("droptabbox").classList.toggle("active");
    document.getElementById("droptabbox2").classList.toggle("active");
  }
  dropTabHover(isFirst) {
    if (isFirst)
      document.getElementById("droptabbox").classList.toggle("focus");
    else
      document.getElementById("droptabbox2").classList.toggle("focus");
  }
  async dropLinkActive() {
    document.getElementById("droplinkbox").classList.toggle("active");
    document.getElementById("droplinkbox2").classList.toggle("active");
  }
  dropLinkHover(isFirst) {
    if (isFirst)
      document.getElementById("droplinkbox").classList.toggle("focus");
    else
      document.getElementById("droplinkbox2").classList.toggle("focus");
  }


  getKeyPresses() {
    document.addEventListener("keydown", async function(e) {
      if (this.state.user !== "default" && document.activeElement.id === "" && e.keyCode === 78) // N
        this.toggleNightMode();
      if (!e.shiftKey) {
        if (document.getElementById("shadow").className !== "shadow active" && document.getElementsByClassName("addTabDiv active").length === 0 &&
          document.getElementsByClassName("modBox active").length === 0) {
          switch(e.keyCode) {
            case 9: // tab
              e.preventDefault();
              if (this.state.tabs.length > 1)
                this.switchToNextTab();
              break;
            case 27: // esc
              if (document.getElementById("searchbar").value !== "") {
                this.setState({links : await this.getLinks(this.state.selectedTab)})
                document.getElementById("searchbar").value="";
              }
              document.getElementById("searchbar").blur();
              break;
            case 32: // space
              if (document.activeElement.id !== "searchbar") {
                e.preventDefault();
                document.getElementById("searchbar").focus();
              }
              break;
            case 37: // left arrow
              if (document.activeElement.id !== "searchbar" && this.state.links.length > this.state.preferences.numLinks) {
                this.changeLinks(-1)
              }
              break;
            case 39: // right arrow
              if (document.activeElement.id !== "searchbar" && this.state.links.length > this.state.preferences.numLinks) {
                this.changeLinks(1)
              }
              break;
            case 69: //lmao E
              if (document.activeElement.id !== "searchbar" && this.state.user !== "default" && document.getElementById("editbox").className !== "modBox hide")
                this.editActive();
              break;
            case 82: // R
              if (document.activeElement.id !== "searchbar" && this.state.user !== "default" && document.getElementById("erasebox").className !== "modBox hide")
                this.eraseActive();
              break;
            case 76: // L
              if (this.state.user !== "default" && document.activeElement.id === "" && this.state.tabs.length !== 0)
                this.openAddLink();
              break;
            case 77: // M
              if (document.activeElement.id === "")
                this.toggleSideMenu();
              break;
            case 79: // O
              if (document.activeElement.id === "")
                this.toggleSideMenu();
              break;
            case 192: // `
              if (this.state.tabs.length > 1 && document.activeElement.id !== "searchbar")
                this.switchToPreviousTab();
              break;
          }
        } else if (document.getElementById("AddFormDiv").className === "addForm active") {
          if (document.activeElement.id === "addtitle" || document.activeElement.id === "addurl") 
            this.setState({
              suggestedIndex: -1,
              suggestedTitleIndex: -1
            })
          switch(e.keyCode) {
            case 9: // tab
              e.preventDefault();
              if (document.activeElement.id === "") {
                document.getElementById("addtitle").focus();
              } else if (document.activeElement.id === "addtitle") {
                document.getElementById("addurl").focus();
              } else {
                document.getElementById("addurl").blur();
              }
              break;
            case 27: // esc
              if (document.activeElement.id === "addtitle") {
                document.getElementById("addtitle").blur();
              } else if (document.activeElement.id === "addurl") {
                document.getElementById("addurl").blur();
              }
              this.openAddLink();
              break;
            case 38: // up arrow
              if ((document.activeElement.id === "addurl" || document.activeElement.className === "suggestionLink") && document.getElementById("addurl").value !== "")
                this.changeSuggestion(-1, true);
              else if ((document.activeElement.id === "addtitle" || document.activeElement.className === "suggestionTitle") && document.getElementById("addtitle").value !== "")
                this.changeTitleSuggestion(-1, true);
              break;
            case 40: //down arrow
              if ((document.activeElement.id === "addurl" || document.activeElement.className === "suggestionLink") && document.getElementById("addurl").value !== "")
                this.changeSuggestion(1, true);
              else if ((document.activeElement.id === "addtitle" || document.activeElement.className === "suggestionTitle") && document.getElementById("addtitle").value !== "")
                this.changeTitleSuggestion(1, true);
              break;
            case 76: // L
              if (document.activeElement.id === "")
                this.openAddLink();
              break;
          }
        } else if (document.getElementById("EditFormDiv").className === "addForm active") {
          if (document.activeElement.id === "edittitle" || document.activeElement.id === "editurl") 
            this.setState({
              suggestedIndex: -1,
              suggestedTitleIndex: -1
            })
          switch(e.keyCode) {
            case 9: // tab
              e.preventDefault();
              if (document.activeElement.id === "") {
                document.getElementById("edittitle").focus();
              } else if (document.activeElement.id === "edittitle") {
                document.getElementById("editurl").focus();
              } else {
                document.getElementById("editurl").blur();
              }
              break;
            case 27: // esc
              if (document.activeElement.id === "edittitle") {
                document.getElementById("edittitle").blur();
              } else if (document.activeElement.id === "editurl") {
                document.getElementById("editurl").blur();
              }
              this.openEditForm(e, this.selectedLink);
              break;
            case 38: // up arrow
              if ((document.activeElement.id === "editurl" || document.activeElement.className === "suggestionLink") && document.getElementById("editurl").value !== "")
                this.changeSuggestion(-1, false);
              else if ((document.activeElement.id === "edittitle" || document.activeElement.className === "suggestionTitle") && document.getElementById("edittitle").value !== "")
                this.changeTitleSuggestion(-1, false);
              break;
            case 40: //down arrow
              if ((document.activeElement.id === "editurl" || document.activeElement.className === "suggestionLink") && document.getElementById("editurl").value !== "")
                this.changeSuggestion(1, false);
              else if ((document.activeElement.id === "edittitle" || document.activeElement.className === "suggestionTitle") && document.getElementById("edittitle").value !== "")
                this.changeTitleSuggestion(1, false);
              break;
          }
        } else if (document.getElementById("addtabdiv").className === "addTabDiv active") {
          switch(e.keyCode) {
            case 9: // tab
              e.preventDefault();
              if (document.activeElement.id === "") {
                document.getElementById("tabinput").focus();
              } else {
                document.getElementById("tabinput").blur();
              }
              break;
          }
        } else if (document.getElementById("erasebox").className === "modBox active" && document.activeElement.id !== "searchbar") {
          switch(e.keyCode) {
            case 8: // backspace
              this.eraseActive();
              break;
            case 9: // tab
              e.preventDefault();
              if (this.state.tabs.length > 1)
                this.switchToNextTab();
              break;
            case 13: // enter
              this.confirmErase();
              break;
            case 37: // left arrow
              if (this.state.links.length > this.state.preferences.numLinks) {
                this.changeLinks(-1)
              }
              break;
            case 39: // right arrow
              if (this.state.links.length > this.state.preferences.numLinks) {
                this.changeLinks(1)
              }
              break;
            case 49: // 1
              if (document.getElementsByClassName("linkBox").length > 0)
                document.getElementsByClassName("linkCheckBox")[0].checked = !(document.getElementsByClassName("linkCheckBox")[0].checked);
              break;
            case 50: // 2
              if (document.getElementsByClassName("linkBox").length > 1)
                document.getElementsByClassName("linkCheckBox")[1].checked = !(document.getElementsByClassName("linkCheckBox")[1].checked);
              break;
            case 51: // 3
              if (document.getElementsByClassName("linkBox").length > 2)
                document.getElementsByClassName("linkCheckBox")[2].checked = !(document.getElementsByClassName("linkCheckBox")[2].checked);
              break;
            case 52: // 4
              if (document.getElementsByClassName("linkBox").length > 3)
                document.getElementsByClassName("linkCheckBox")[3].checked = !(document.getElementsByClassName("linkCheckBox")[3].checked);
              break;
            case 53: // 5
              if (document.getElementsByClassName("linkBox").length > 4)
                document.getElementsByClassName("linkCheckBox")[4].checked = !(document.getElementsByClassName("linkCheckBox")[4].checked);
              break;
            case 54: // 6
              if (document.getElementsByClassName("linkBox").length > 5)
                document.getElementsByClassName("linkCheckBox")[5].checked = !(document.getElementsByClassName("linkCheckBox")[5].checked);
              break;
            case 55: // 7
              if (document.getElementsByClassName("linkBox").length > 6)
                document.getElementsByClassName("linkCheckBox")[6].checked = !(document.getElementsByClassName("linkCheckBox")[6].checked);
              break;
            case 56: // 8
              if (document.getElementsByClassName("linkBox").length > 7)
                document.getElementsByClassName("linkCheckBox")[7].checked = !(document.getElementsByClassName("linkCheckBox")[7].checked);
              break;
            case 57: // 9
              if (document.getElementsByClassName("linkBox").length > 8)
                document.getElementsByClassName("linkCheckBox")[8].checked = !(document.getElementsByClassName("linkCheckBox")[8].checked);
              break;
            case 58: // 0
              if (document.getElementsByClassName("linkBox").length > 9)
                document.getElementsByClassName("linkCheckBox")[9].checked = !(document.getElementsByClassName("linkCheckBox")[9].checked);
              break;
            case 69: //lmao E
              this.editActive();
              break;
            case 82: // R
              this.eraseActive();
              break;
            case 192: // `
              if (this.state.tabs.length > 1 && document.activeElement.id !== "searchbar")
                this.switchToPreviousTab();
              break;
          }
        }
      } else if (document.getElementById("shadow").className !== "shadow active" && document.getElementsByClassName("addTabDiv active").length === 0 &&
        document.getElementsByClassName("modBox active").length === 0) {
        switch(e.keyCode) {
          case 48: // 0
            if (document.getElementsByClassName("linkBox").length > 9)
              document.getElementsByClassName("linkBox")[9].click();
            break;
          case 49: // 1
            if (document.getElementsByClassName("linkBox").length > 0)
              document.getElementsByClassName("linkBox")[0].click();
            break;
          case 50: // 2
            if (document.getElementsByClassName("linkBox").length > 1)
              document.getElementsByClassName("linkBox")[1].click();
            break;
          case 51: // 3
            if (document.getElementsByClassName("linkBox").length > 2)
              document.getElementsByClassName("linkBox")[2].click();
            break;
          case 52: // 4
            if (document.getElementsByClassName("linkBox").length > 3)
              document.getElementsByClassName("linkBox")[3].click();
            break;
          case 53: // 5
            if (document.getElementsByClassName("linkBox").length > 4)
              document.getElementsByClassName("linkBox")[4].click();
            break;
          case 54: // 6
            if (document.getElementsByClassName("linkBox").length > 5)
              document.getElementsByClassName("linkBox")[5].click();
            break;
          case 55: // 7
            if (document.getElementsByClassName("linkBox").length > 6)
              document.getElementsByClassName("linkBox")[6].click();
            break;
          case 56: // 8
            if (document.getElementsByClassName("linkBox").length > 7)
              document.getElementsByClassName("linkBox")[7].click();
            break;
          case 57: // 9
            if (document.getElementsByClassName("linkBox").length > 8)
              document.getElementsByClassName("linkBox")[8].click();
            break;
        }
      }
    }.bind(this))
  }
}

export default Home;