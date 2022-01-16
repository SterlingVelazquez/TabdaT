import React from 'react'
import Head from 'next/head'
import { database } from "../tools/database.js"
import { firebase } from "../tools/config.js"
import { Profile } from "../forms/profile.js"
import { AddLink } from "../forms/addLink.js"
import { AddTab } from "../forms/addTab.js"
import { EditLink } from "../forms/editLink.js"
import { EditTab } from "../forms/editTab.js"
import { Import } from "../forms/import.js"
import { NavBar } from "../forms/navBar.js"
import { Hotbar } from "../react/hotbar.js"
import "./_app.js"

var provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});
var key = 0;
var resize
var doneLoading = false;
var firstLoad = true;
const defaultPreferences = {
  addLink: false,
  addTab: false,
  buttonsColor: false,
  editBtn: false,
  gridWidth: 20,
  gridHeight: 20,
  imageShadowColor: false,
  imageShadowSize: 20,
  linkImageSize: 50,
  linkShadowColor: false,
  linkShadowSize: 35,
  linkText: false,
  linkTextColor: false,
  linkTextSize: 50,
  night: false,
  removeBtn: false,
  tabArrows: false,
  tabShadowSize: 1,
  tabTextShadowColor: false,
  theme: false,
}

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: "default",
      uid: "default",
      output: [],
      tabs: [],
      numTabs: 4,
      selectedTab: "",
      inputText: "",
      links: [],
      trendingLinks: [],
      recentLinks: [],
      popularLinks: [],
      tabIndex: 0,
      suggestedTitleIndex: -1,
      suggestedIndex: -1,
      tabToErase: null,
      allLinks: [],
      bookmarks: [],
      preferences: [],
      oldPreferences: [],
      suggestions: [],
      themes: [],
      currTab: {
        name: "",
        color: "",
      },
      selectedLink: {
        name: "",
        link: "",
        image: "",
      }
    };
    this.tabCallback = this.tabCallback.bind(this);
    this.linkCallback = this.linkCallback.bind(this);
    this.multipleLinkCallback = this.multipleLinkCallback.bind(this);
    this.editLinkCallback = this.editLinkCallback.bind(this);
    this.editTabCallback = this.editTabCallback.bind(this);
    this.editActive = this.editActive.bind(this);
    this.eraseActive = this.eraseActive.bind(this);
    this.openAddTab = this.openAddTab.bind(this);
    this.checkAddTab = this.checkAddTab.bind(this);
    this.closeActiveEdit = this.closeActiveEdit.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.setPreferences = this.setPreferences.bind(this);
    this.savePreferences = this.savePreferences.bind(this);
    this.updateShortcutCount = this.updateShortcutCount.bind(this);
  }

  async UNSAFE_componentWillMount() {
    firebase.auth().onAuthStateChanged(async function (user) {
      await this.get(user);
      if (firstLoad) document.getElementById("title").classList.toggle("hide");
      firstLoad = false;
      this.getKeyPresses();
      this.getResizeTabs();
    }.bind(this))
  }

  async get(user) {
    var uid = user ? user.uid : "default";
    var preferences = await database.getPreferences(uid, defaultPreferences);
    var tabs = await database.getTabs(uid);
    var allLinks = await database.getAllLinks(uid);
    doneLoading = true;
    this.setState({
      user: user ? user : "default",
      uid: uid,
      preferences: preferences,
      oldPreferences: JSON.parse(JSON.stringify(preferences)),
      tabs: tabs,
      numTabs: 550 + (preferences.gridWidth * 20) > window.innerWidth * 0.8 ? Math.floor(window.innerWidth * 0.8 / 220) : Math.floor((550 + (preferences.gridWidth * 20)) / 220),
      selectedTab: tabs.length !== 0 ? tabs[0].name : "",
      allLinks: allLinks,
      links: tabs.length !== 0 ? await this.getLinks(tabs[0].name, allLinks) : await this.getLinks([], allLinks),
      trendingLinks: await database.getTrendingLinks(),
      popularLinks: user ? await this.getShortcutLinks(true, allLinks) : [],
      recentLinks: user ? await this.getShortcutLinks(false, allLinks) : [],
      suggestions: user ? await database.getSuggestions() : [],
      themes: user ? await database.getThemes() : [],
    })
  }

  async signIn() {
    firebase.auth().signInWithPopup(provider).then((user) => {
      if (user) this.get(user.user)
    })
  }

  async signOut() {
    if (document.getElementById("addtabdiv").className.includes("active"))
      this.openAddTab();
    if (document.getElementById("buttonnav").className.includes("erase"))
      this.eraseActive();
    else if (document.getElementById("buttonnav").className.includes("edit"))
      this.editActive();
    if (document.getElementById("savebox").className.includes("active"))
      document.getElementById("savebox").classList.toggle("active");
    if (document.getElementById("profilewrapper").className.includes("active"))
      document.getElementById("profilewrapper").classList.toggle("active");
    this.setState({
      user: "default",
      uid: "default",
    })
    await firebase.auth().signOut();
    this.setPreferences({ preferences: JSON.parse(JSON.stringify(defaultPreferences)) });
    this.get();
    if (document.getElementById("container").className.includes("night"))
      this.toggleNightMode();
  }

  async spinAnimation() {
    var links = document.getElementsByClassName("linkBox");
    for (var i = 0; i < links.length; i++)
      links[i].classList.toggle("active")
  }

  async getLinks(selectedTab, allLinks) {
    if (typeof allLinks === "undefined")
      allLinks = this.state.allLinks;
    var links = [];
    for (var i = 0; i < allLinks.length; i++) {
      if (selectedTab === allLinks[i].tab)
        links.push(allLinks[i])
    }
    return links;
  }

  async getShortcutLinks(isPopular, allLinks) {
    var shortcutLinks = [];
    var newLinks = allLinks.slice(0);
    newLinks.sort(function (a, b) {
      return isPopular ? b.clicks - a.clicks : b.time - a.time
    })
    for (var i = 0; i < newLinks.length && shortcutLinks.length < 5; i++) {
      if (isPopular) {
        if (typeof newLinks[i].clicks !== "undefined" && newLinks[i].clicks !== 0)
          shortcutLinks.push(newLinks[i])
      } else {
        if (typeof newLinks[i].time !== "undefined")
          shortcutLinks.push(newLinks[i])
      }
    }
    return shortcutLinks;
  }
  async updateShortcutCount(linkName) {
    for (var i = 0; i < this.state.allLinks.length; i++)
      if (document.getElementById("buttonnav").className === "buttonNav" && this.state.allLinks[i].name === linkName) {
        var count = typeof this.state.allLinks[i].clicks !== "undefined" ? this.state.allLinks[i].clicks + 1 : 1;
        var time = Date.now();
        var newLinks = this.state.allLinks.slice(0);
        newLinks[i].clicks = count;
        newLinks[i].time = time;
        this.setState({
          allLinks: newLinks,
          popularLinks: await this.getShortcutLinks(true, newLinks),
          recentLinks: await this.getShortcutLinks(false, newLinks),
        })
        firebase.database().ref(this.state.uid + '/Links/' + linkName + '/clicks').set(count);
        firebase.database().ref(this.state.uid + '/Links/' + linkName + '/time').set(time);
        break;
      }
  }

  async setDefaultPreferences() {
    if (preferences.editBtn && document.getElementById("editbox").className !== "modContainer hide") {
      document.getElementById("editbox").classList.toggle("hide");
    }
    if (preferences.removeBtn && document.getElementById("erasebox").className !== "modContainer hide") {
      document.getElementById("erasebox").classList.toggle("hide");
      document.getElementById("confirmerase").classList.toggle("hide");
    }
    if (preferences.tabArrows && document.getElementById("lefttabarrow").className !== "leftTabArrow hide") {
      document.getElementById("lefttabarrow").classList.toggle("hide");
      document.getElementById("righttabarrow").classList.toggle("hide");
    }
    if (preferences.linkArrows && document.getElementById("leftarrow").className !== "leftLinkArrow hide") {
      document.getElementById("leftarrow").classList.toggle("hide");
      document.getElementById("rightarrow").classList.toggle("hide");
    }
    if (JSON.stringify(this.state.preferences) !== JSON.stringify(defaultPreferences))
      document.getElementById("resetbox").classList.toggle("active");
  }
  async setPreferences(pref) {
    this.setState({
      numTabs: 550 + (pref.gridWidth * 20) > window.innerWidth * 0.8 ? Math.floor(window.innerWidth * 0.8 / 220) : Math.floor((550 + (pref.gridWidth * 20)) / 220),
      preferences: pref,
    })
  }
  savePreferences(isUpload) {
    database.setPreferences(isUpload, this.state.preferences, this.state.oldPreferences, this.state.uid)
    this.setState({ oldPreferences: JSON.parse(JSON.stringify(this.state.preferences)) })
  }
  checkAddTab(isArrows) {
    if (document.getElementById("addtabdiv").className.includes("active"))
      this.openAddTab();
    var max = Math.floor(this.state.tabs.length / this.state.numTabs);
    if ((!isArrows && !this.state.preferences.addTab && this.state.tabIndex === max && this.state.tabs.length % this.state.numTabs === 0) ||
      (isArrows && !this.state.preferences.tabArrows && this.state.tabIndex === max && this.state.tabs.length % this.state.numTabs === 0))
      this.changeTabs(-1);
  }

  async setInputText(event) {
    this.setState({ inputText: event.target.value }, async function () {
      if (this.state.inputText !== '') {
        this.setState({ links: await database.stringSearch(this.state.inputText, JSON.parse(JSON.stringify(this.state.allLinks)), 0.75, false) });
      } else {
        this.setState({ links: await this.getLinks(this.state.selectedTab) })
      }
    });
  }

  async updateTabs(e, each) {
    e.stopPropagation();
    if (each.name !== this.state.selectedTab) {
      this.setState({
        selectedTab: await each.name,
        links: await this.getLinks(each.name),
        linkIndex: 0,
      });
      this.spinAnimation();
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
      tabs: newTab,
      selectedTab: tab.name,
      links: await this.getLinks(tab.name)
    })
  }

  linkCallback = async (link) => {
    document.getElementById("uploadlinkloader").classList.toggle("active");
    while (link.tab !== this.state.selectedTab)
      await this.switchToNextTab();
    if (this.state.links.length !== 0) {
      link.pos = this.state.links[this.state.links.length - 1].pos + 1;
    } else {
      link.pos = 0;
    }
    if (typeof link.image === "object") {
      await firebase.storage().ref(this.state.uid).child(link.name).put(link.image);
      await firebase.storage().ref(this.state.uid).child(link.name).getDownloadURL().then((res) => { link.image = res })
    }
    await database.addLinks([link], this.state.uid);
    var newLinks = this.state.allLinks;
    newLinks.push(link);
    this.setState({ allLinks: newLinks })
    this.setState({ links: await this.getLinks(this.state.selectedTab) })
    this.spinAnimation();
    document.getElementById("uploadlinkloader").classList.toggle("active");
  }

  multipleLinkCallback = async (links) => {
    document.getElementById("uploadlinkloader").classList.toggle("active");
    await database.addLinks(links, this.state.uid);
    var newArr = this.state.allLinks;
    for (var i = 0; i < links.length; i++)
      newArr.push(links[i])
    this.setState({
      allLinks: newArr,
      linkIndex: 0
    })
    while (this.state.selectedTab !== "My Bookmarks")
      await this.switchToNextTab();
    this.setState({ links: await this.getLinks("My Bookmarks") })
    this.spinAnimation();
    document.getElementById("uploadlinkloader").classList.toggle("active");
  }

  editActive() {
    if (document.getElementById("buttonnav").className.includes("erase"))
      this.eraseActive();
    document.getElementById("buttonnav").classList.toggle("edit");
    document.getElementById("grid").classList.toggle("edit");

    if (document.getElementById("buttonnav").className.includes("edit")) {
      document.getElementById("editimg").src = "cancel.png";
      document.getElementById("trashimg").src = "trash.png";
    } else {
      document.getElementById("editimg").src = "edit.png";
      this.openTabEdit(null, true, null);
    }
  }

  editLinkCallback = async (link, close) => {
    if (close) {
      this.setState({
        selectedLink: {
          name: "",
          link: "",
          image: "",
        }
      })
    } else {
      document.getElementById("uploadlinkloader").classList.toggle("active");
      var selectedLink = this.state.selectedLink;
      link.pos = selectedLink.pos;
      await database.editLink(link, this.state.uid, selectedLink);
      var newLinks = this.state.allLinks;
      for (var i = 0; i < this.state.allLinks.length; i++) {
        if (selectedLink.name === this.state.allLinks[i].name) {
          newLinks.splice(i, 1, link)
          break;
        }
      }
      this.setState({ allLinks: newLinks });
      this.setState({ links: await this.getLinks(this.state.selectedTab) });
      document.getElementById("uploadlinkloader").classList.toggle("active");
    }
  }

  editTabCallback = async (tab, currTab) => {
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
      tabs: newTabs,
      selectedTab: tab.name,
      allLinks: allLinks,
    })
    this.setState({ links: await this.getLinks(tab.name) });
  }

  eraseActive() {
    if (document.getElementById("buttonnav").className.includes("edit"))
      this.editActive();
    document.getElementById("grid").classList.toggle("erase");
    document.getElementById("buttonnav").classList.toggle("erase");
    document.getElementById("confirmerase").classList.toggle("active");
    if (document.getElementById("buttonnav").className.includes("erase")) {
      document.getElementById("trashimg").src = "cancel.png"
      document.getElementById("editimg").src = "edit.png"
    } else {
      document.getElementById("trashimg").src = "trash.png"
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
          image: selectedLinks[i].name,
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
      this.setState({
        allLinks: newArr,
        links: await this.getLinks(this.state.selectedTab, newArr)
      })
      this.spinAnimation();
    } else {
      this.eraseActive();
    }
    document.getElementById("deletelinkloader").style.display = "none";
  }

  async confirmTabBox(e, tab) {
    e.stopPropagation();
    this.setState({ tabToErase: tab })
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
      allLinks: links
    })
    if (this.state.tabToErase === this.state.selectedTab && this.state.tabs.length > 0) {
      this.setState({
        linkIndex: 0,
        tabIndex: 0,
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
        firebase.database().ref(this.state.uid + '/Tabs/' + name).update({ pos: this.state.tabs[0].pos - 1 })
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
          this.setState({ tabs: newArr })
        }
      } else if (!moveFront && name !== this.state.tabs[this.state.tabs.length - 1].name) {
        firebase.database().ref(this.state.uid + '/Tabs/' + name).update({ pos: this.state.tabs[this.state.tabs.length - 1].pos + 1 })
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
            tabIndex: this.state.tabs.length % this.state.numTabs === 0 && this.state.tabs.length > 0 ? Math.floor(this.state.tabs.length / this.state.numTabs) - 1 : Math.floor(this.state.tabs.length / this.state.numTabs),
          })
        } else {
          this.setState({ tabs: newArr })
        }
      }
    }
  }

  async changeLinkPos(e, moveFront) {
    var link = e.dataTransfer.getData("text");
    var name = link.slice(0, link.indexOf('/'));
    if (link.slice(link.indexOf('/') + 1, link.length) === "link" && this.state.user !== "default") {
      if (moveFront && name !== this.state.links[0].name) {
        firebase.database().ref(this.state.uid + '/Links/' + name).update({ pos: this.state.links[0].pos - 1 })
        for (var i = 0; i < this.state.allLinks.length; i++) {
          if (name === this.state.allLinks[i].name) {
            var newArr = this.state.allLinks;
            var elem = newArr.splice(i, 1)[0];
            elem.pos = this.state.links[0].pos - 1;
            newArr.unshift(elem);
            this.setState({ allLinks: newArr })
            break;
          }
        }
        this.setState({ links: await this.getLinks(this.state.selectedTab) })
        this.spinAnimation();
      } else if (!moveFront && name !== this.state.links[this.state.links.length - 1].name) {
        firebase.database().ref(this.state.uid + '/Links/' + name).update({ pos: this.state.links[this.state.links.length - 1].pos + 1 })
        for (var i = 0; i < this.state.allLinks.length; i++) {
          if (name === this.state.allLinks[i].name) {
            var newArr = this.state.allLinks;
            var elem = newArr.splice(i, 1)[0];
            elem.pos = this.state.links[this.state.links.length - 1].pos + 1;
            newArr.push(elem);
            this.setState({ allLinks: newArr })
            break;
          }
        }
        this.setState({ links: await this.getLinks(this.state.selectedTab) })
        this.spinAnimation();
      }
    }
  }

  async switchTabs(e, newTab) {
    var link = e.dataTransfer.getData("text");
    var name = link.slice(0, link.indexOf('/'));
    if (link.slice(link.indexOf('/') + 1, link.length) === "link" && newTab !== this.state.selectedTab && this.state.user !== "default") {
      firebase.database().ref(this.state.uid + '/Links/' + name).update({ tab: newTab });
      for (var i = 0; i < this.state.allLinks.length; i++) {
        if (name === this.state.allLinks[i].name) {
          var update = this.state.allLinks;
          update[i].tab = newTab;
          this.setState({ allLinks: update })
          break;
        }
      }
      this.setState({ links: await this.getLinks(this.state.selectedTab) })
      this.spinAnimation();
    }
  }

  async changeTabs(num) {
    this.closeActiveEdit();
    var max = Math.floor(this.state.tabs.length / this.state.numTabs);
    var result = (this.state.tabIndex + num) % (max + 1);
    if (document.getElementById("buttonnav").className.includes("erase"))
      document.getElementById("confirmerase").className = "modBoxConfirm active";

    if (result === max) {
      if (this.state.tabs.length % this.state.numTabs === 0 && this.state.preferences.addTab) {
        this.setState({
          linkIndex: 0,
          tabIndex: 0,
          selectedTab: this.state.tabs[0].name,
          links: await this.getLinks(this.state.tabs[0].name)
        })
      } else {
        if (this.state.tabs.length % this.state.numTabs === 0)
          document.getElementById("confirmerase").className = "modBoxConfirm";
        this.setState({
          linkIndex: 0,
          tabIndex: max,
          selectedTab: this.state.tabs.length % this.state.numTabs === 0 ? [] : this.state.tabs[this.state.tabs.length - (this.state.tabs.length % this.state.numTabs)].name,
          links: this.state.tabs.length % this.state.numTabs === 0 ? await this.getLinks([]) : await this.getLinks(this.state.tabs[this.state.tabs.length - (this.state.tabs.length % this.state.numTabs)].name)
        })
      }
    } else if (result === -1) {
      if (this.state.tabs.length % this.state.numTabs === 0 && this.state.preferences.addTab) {
        this.setState({
          linkIndex: 0,
          tabIndex: max - 1,
          selectedTab: this.state.tabs[this.state.tabs.length - this.state.numTabs].name,
          links: await this.getLinks(this.state.tabs[this.state.tabs.length - this.state.numTabs].name)
        })
      } else {
        if (this.state.tabs.length % this.state.numTabs === 0)
          document.getElementById("confirmerase").className = "modBoxConfirm";
        this.setState({
          linkIndex: 0,
          tabIndex: max,
          selectedTab: this.state.tabs.length % this.state.numTabs === 0 ? [] : this.state.tabs[this.state.tabs.length - (this.state.tabs.length % this.state.numTabs)].name,
          links: this.state.tabs.length % this.state.numTabs === 0 ? await this.getLinks([]) : await this.getLinks(this.state.tabs[this.state.tabs.length - (this.state.tabs.length % this.state.numTabs)].name)
        })
      }
    } else {
      this.setState({
        linkIndex: 0,
        tabIndex: result,
        selectedTab: this.state.tabs[result * this.state.numTabs].name,
        links: await this.getLinks(this.state.tabs[result * this.state.numTabs].name)
      })
    }

    if (!((result === max || result === -1) && this.state.tabs.length % this.state.numTabs === 0 && this.state.preferences.addTab))
      this.spinAnimation();
  }

  async switchToNextTab() {
    for (var i = 0; i < this.state.tabs.length; i++) {
      if (this.state.tabs[i].name === this.state.selectedTab) {
        if (i === this.state.tabs.length - 1) {
          this.setState({
            linkIndex: 0,
            tabIndex: 0,
            selectedTab: this.state.tabs[0].name,
            links: await this.getLinks(this.state.tabs[0].name)
          })
        } else if ((i + 1) % this.state.numTabs === 0) {
          this.changeTabs(1)
        } else {
          this.setState({
            linkIndex: 0,
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
            linkIndex: 0,
            tabIndex: this.state.tabs.length % this.state.numTabs !== 0 ? Math.floor(this.state.tabs.length / this.state.numTabs) : Math.floor(this.state.tabs.length / this.state.numTabs) - 1,
            selectedTab: this.state.tabs[this.state.tabs.length - 1].name,
            links: await this.getLinks(this.state.tabs[this.state.tabs.length - 1].name)
          })
        } else if (i % this.state.numTabs === 0) {
          this.setState({
            linkIndex: 0,
            tabIndex: this.state.tabIndex - 1,
            selectedTab: this.state.tabs[i - 1].name,
            links: await this.getLinks(this.state.tabs[i - 1].name)
          })
        } else {
          this.setState({
            linkIndex: 0,
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
      this.setState({ suggestedIndex: -1 })
      if (isAdd)
        document.getElementById("addurl").focus();
      else
        document.getElementById("editurl").focus();
    } else {
      this.setState({ suggestedIndex: result })
      suggestions[result].focus();
    }
  }

  changeTitleSuggestion(num, isAdd) {
    var suggestions = document.getElementsByClassName("suggestionTitle");
    var length = suggestions.length;
    var result = (this.state.suggestedTitleIndex + num) % length;
    if (this.state.suggestedTitleIndex + num === length || this.state.suggestedTitleIndex + num < 0) {
      this.setState({ suggestedTitleIndex: -1 })
      if (isAdd)
        document.getElementById("addtitle").focus();
      else
        document.getElementById("edittitle").focus();
    } else {
      this.setState({ suggestedTitleIndex: result })
      suggestions[result].focus();
    }
  }

  toggleNightMode() {
    if (!this.state.preferences.theme) {
      var nightMode = this.state.preferences;
      nightMode.night = !this.state.preferences.night;
      this.setState({ preferences: nightMode });
    }
  }

  render() {
    return (
      <div className={this.state.preferences.theme ? "container themes" : (this.state.preferences.night ? "container night" : "container")} id="container">
        <Head>
          <title>TabdaT</title>
          <link rel="icon" href="/favicon.ico" />

          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&display=swap" rel="stylesheet"></link>
          <link rel="stylesheet" href="https://use.typekit.net/efk1ogl.css"></link>
          <script src="https://smtpjs.com/v3/smtp.js"></script>
        </Head>

        <div className="title" id="title">
          <div className="titleWrapper">
            <div className="titleLetters">
              <span className="letter">t</span>
              <span className="letter">a</span>
              <span className="letter">b</span>
              <span className="letter">d</span>
              <span className="letter">a</span>
              <span className="letter">t</span>
            </div>
            <div className="titleLoader" id="titleloader">
              <div className="titleLoadingDot" /><div className="titleLoadingDot" /><div className="titleLoadingDot" /><div className="titleLoadingDot" /><div className="titleLoadingDot" />
              <div className="titleLoadingDot" /><div className="titleLoadingDot" /><div className="titleLoadingDot" /><div className="titleLoadingDot" /><div className="titleLoadingDot" />
            </div>
          </div>
        </div>

        {doneLoading ?
          <div>
            <Profile user={this.state.user} signIn={this.signIn.bind(this)} signOut={this.signOut.bind(this)} />

            <img className="theme" id="theme" src={this.state.preferences.theme ? this.state.preferences.theme : ""} style={{ display: this.state.preferences.theme ? "block" : "none" }} draggable={false} />

            <main>

              <div className="sideMenuBtn" id="sidemenubtn" onClick={e => this.toggleSideMenu()}>
                <div className="cancelBar"></div>
                <div className="cancelBar"></div>
                <div className="cancelBar"></div>
              </div>

              <NavBar signIn={this.signIn.bind(this)} toggleNightMode={this.toggleNightMode.bind(this)} setPreferences={this.setPreferences.bind(this)} user={this.state.user} preferences={this.state.preferences}
                oldPreferences={this.state.oldPreferences} savePreferences={this.savePreferences.bind(this)} uid={this.state.uid} editActive={this.editActive.bind(this)} eraseActive={this.eraseActive.bind(this)}
                defaultPreferences={defaultPreferences} checkAddTab={this.checkAddTab.bind(this)} numTabs={this.state.tabs.length} displayedTabs={this.state.numTabs} themes={this.state.themes} />

              <Hotbar uid={this.state.uid} trendingLinks={this.state.trendingLinks} popularLinks={this.state.popularLinks} recentLinks={this.state.recentLinks} updateShortcutCount={this.updateShortcutCount.bind(this)}></Hotbar>

              <input className="searchBar" id="searchbar" placeholder="Search your bookmarks..." onChange={e => this.setInputText(e)}></input>
              <br />

              <div className="gridWrapper" id="gridwrapper" style={{ width: 550 + (this.state.preferences.gridWidth * 20) + "px" }}>
                <div className="buttonNav" id="buttonnav">
                  <img className={this.state.preferences.tabArrows || (this.state.preferences.addTab && this.state.tabs.length === this.state.numTabs) || (this.state.tabs.length < this.state.numTabs) ? "leftTabArrow hide" : "leftTabArrow"}
                    id="lefttabarrow" src="gray-arrow.png" onClick={e => this.changeTabs(-1)} draggable={false}>
                  </img>
                  {
                    this.state.tabs.slice(this.state.tabIndex * this.state.numTabs, this.state.tabIndex * this.state.numTabs + this.state.numTabs).map((each) =>
                      <div className="editTabWrapper" onClick={e => this.openTabEdit(e, false, each)}>
                        <div className={this.state.selectedTab === each.name ? "navBtnWrapper active" : "navBtnWrapper"}>
                          <button className="navBtns" type="button" style={{
                            borderColor: each.color,
                            textShadow: this.state.preferences.tabTextShadowColor ? '0 0 ' + (-1 + (this.state.preferences.tabShadowSize * 0.1) + "px") + ' #' + this.state.preferences.tabTextShadowColor :
                              '0 0 ' + (-1 + (this.state.preferences.tabShadowSize * 0.1) + "px") + (this.state.preferences.theme ? "transparent" : this.state.preferences.night ? "#000000" : "#808080")
                          }}
                            key={key++} onClick={e => this.updateTabs(e, each)} onDrop={e => this.switchTabs(e, each.name)} onDragOver={e => e.preventDefault()}
                          // draggable={this.state.user !== "default" ? "true" : "false"} onDragStart={e => this.tabDragStart(e, each)}
                          //onDragEnd={e => this.dropTabActive()}
                          >
                            <img className="trashTab" id="trashtab" onClick={e => this.confirmTabBox(e, each.name)} draggable={false} src="trash.png"></img>
                            <a className="navBtnText"><span className="navBtnTxtWrapper" style={{ color: each.color }}>{each.name}</span></a>
                          </button>
                          <div className="tabThemeBlur" />
                        </div>
                        {
                          this.state.user === "default" ? <div></div> :
                            <EditTab editTab={this.editTabCallback.bind(this)} closeActiveEdit={this.closeActiveEdit.bind(this)} currTab={each} tabs={this.state.tabs} preferences={this.state.preferences}
                              lastIndex={Math.floor(this.state.tabs.length / this.state.numTabs)} />
                        }
                      </div>
                    )
                  }
                  {
                    this.state.user === "default" ? <div></div> :
                      <AddTab addTab={this.tabCallback.bind(this)} isUser={this.state.user} tabs={this.state.tabs} tabIndex={this.state.tabIndex} preferences={this.state.preferences} openAddTab={this.openAddTab.bind(this)} displayedTabs={this.state.numTabs} />
                  }
                  <img className={this.state.preferences.tabArrows || (this.state.preferences.addTab && this.state.tabs.length === this.state.numTabs) || (this.state.tabs.length < this.state.numTabs) ? "rightTabArrow hide" : "rightTabArrow"}
                    id="righttabarrow" src="gray-arrow.png" onClick={e => this.changeTabs(1)} draggable={false}>
                  </img>
                </div>
                <br />

                <div className="grid" id="grid" style={{
                  gridTemplateRows: !this.state.preferences.linkText ? "repeat(auto-fill," + (60 + (this.state.preferences.linkImageSize * 0.9) + (65 + this.state.preferences.linkTextSize * 0.4)) + "px)" :
                    "repeat(auto-fill," + (90 + (this.state.preferences.linkImageSize * 0.9)) + "px)", height: `calc(${this.state.preferences.gridHeight}vh + 230px)`,
                  gridTemplateColumns: "repeat(auto-fill, " + (100 + (this.state.preferences.linkImageSize) + "px")
                }}>
                  <div className="dropLinkBox" id="droplinkbox" onDragEnter={e => this.dropLinkHover(true)} onDragLeave={e => this.dropLinkHover(true)} onDrop={e => this.changeLinkPos(e, true)}
                    onDragOver={e => e.preventDefault()}>
                    <p className="dropLinkText">Move <br /> to front</p>
                  </div>
                  {
                    this.state.links.map((each) =>
                      <a className="linkBox" style={{ textDecoration: "none", width: 100 + (this.state.preferences.linkImageSize * 1.5) + "px" }}
                        target="_blank" rel="noopener noreferrer" href={each.link} draggable={this.state.user !== "default" ? "true" : "false"} onDragStart={e => this.linkDragStart(e, each)}
                        onDragEnd={e => this.dropLinkActive()} onClick={e => this.updateShortcutCount(each.name)}>
                        <label className="eraseLabel"><input className="linkCheckBox" type="checkbox" value={each.name} name={each.image}></input></label>
                        <div className="editDiv" id="editdiv" value={each} onClick={e => this.openEditForm(e, each)}>
                          <img src={each.image} key={key++} className="linkImg" draggable={false} style={{
                            boxShadow: this.state.preferences.imageShadowColor ? '0 0 ' + (-1 + this.state.preferences.imageShadowSize + "px") + ' #' + this.state.preferences.imageShadowColor :
                              this.state.preferences.theme ? '0 0 ' + (-1 + this.state.preferences.imageShadowSize + "px") + "transparent" :
                                this.state.preferences.night ? '0 0 ' + (-1 + this.state.preferences.imageShadowSize + "px") + " #000000" :
                                  '0 0 ' + (-1 + this.state.preferences.imageShadowSize + "px") + " #B6B6B6",
                            width: 65 + (this.state.preferences.linkImageSize * 0.9) + "px"
                          }}></img>
                          <p className="linkNames" style={{
                            display: this.state.preferences.linkText ? "none" : "-webkit-box",
                            color: this.state.preferences.linkTextColor ? '#' + this.state.preferences.linkTextColor : this.state.preferences.theme ? "#EBEBEB" : this.state.preferences.night ? "#C7C7C7" : "#5D687E",
                            textShadow: this.state.preferences.linkShadowColor ? '0 0 ' + (-1 + (this.state.preferences.linkShadowSize * 0.3) + "px") + ' #' + this.state.preferences.linkShadowColor :
                              '0 0 ' + (-1 + (this.state.preferences.linkShadowSize * 0.3) + "px") + ' #' + (this.state.preferences.theme ? "000000" : this.state.preferences.night ? "0E0E0E" : "F9FBFD"),
                            fontSize: 13 + (this.state.preferences.linkTextSize * 0.08) + "px", maxHeight: 40 + (this.state.preferences.linkTextSize * 0.25) + "px"
                          }}>{each.name}</p>
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
                  {
                    this.state.user === "default" ? <div></div> : <div>
                      <div className="addLinkGridWrapper" style={{
                        width: 100 + (this.state.preferences.linkImageSize * 1.5) + "px", display: this.state.user === "default" || this.state.tabs.length === 0 ||
                          (this.state.tabIndex === this.state.tabs.length / this.state.numTabs && this.state.tabs.length > 0) || this.state.preferences.addLink ? "none" : "inline-block"
                      }}>
                        <div className="addLinkGrid" id="addlinkgrid" style={{ width: 70 + (this.state.preferences.linkImageSize * 0.9) + "px", height: 70 + (this.state.preferences.linkImageSize * 0.9) + "px" }} onClick={e => this.openAddLink()}>
                          <img key={key++} className="addLinkGridImage" src="plus.png" draggable={false}></img>
                        </div>
                      </div>
                    </div>
                  }
                  <div className="dropLinkBox" id="droplinkbox2" onDragEnter={e => this.dropLinkHover(false)} onDragLeave={e => this.dropLinkHover(false)} onDrop={e => this.changeLinkPos(e, false)}
                    onDragOver={e => e.preventDefault()} style={{
                      left: "auto", right: "-11rem", background: !(this.state.preferences.night || this.state.preferences.theme) ?
                        "linear-gradient(to left, rgb(249, 251, 253) 0%,#b6b9d1 100%)" : (this.state.preferences.theme ? "linear-gradient(to left, rgba(14, 14, 14, 0) 0%, rgba(14, 14, 14, 0.69) 50%, rgba(37, 37, 37, 0.89)" :
                          "linear-gradient(to left, rgba(14, 14, 14, 0) 0%,rgb(37, 37, 37) 100%)"), textAlign: "left"
                    }}>
                    <p className="dropLinkText" style={{ left: "0.4rem", textAlign: "left" }}>Move <br /> to back</p>
                  </div>
                </div>
                <br />
                <div className="asd"></div>
                {
                  this.state.user === "default" ? <div></div> : <div>
                    <div className="buttonWrapper" style={{ width: 550 + (this.state.preferences.gridWidth * 20) + "px" }}>
                      <p className="uploadLinkLoader" id="uploadlinkloader">
                        {['U', 'p', 'l', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'].map((each) => <span className="linkLoadLetter" key={key++}>{each}</span>)}
                      </p>

                      <p className="uploadLinkLoader" id="deletelinkloader">
                        {['D', 'e', 'l', 'e', 't', 'i', 'n', 'g', '.', '.', '.'].map((each) => <span className="linkLoadLetter" key={key++}>{each}</span>)}
                      </p>

                      <div className={!(this.state.preferences.addLink) && this.state.user !== "default" && this.state.tabs.length !== 0 &&
                        !(this.state.tabIndex === this.state.tabs.length / this.state.numTabs && this.state.tabs.length > 0) ? "modContainer" : "modContainer hide"} id="addcontainer" onClick={e => this.openAddLink()}
                        style={{ background: this.state.preferences.buttonsColor ? '#' + this.state.preferences.buttonsColor : this.state.preferences.theme ? "transparent" : (this.state.preferences.night ? "#313131" : "#C4D3E9") }}>
                        <img className="modContainerImage" src="plus.png" draggable={false}></img>
                      </div>

                      <div className={!(this.state.preferences.editBtn) && this.state.user !== "default" && this.state.tabs.length !== 0 &&
                        !(this.state.tabIndex === this.state.tabs.length / this.state.numTabs && this.state.tabs.length > 0) ? "modContainer" : "modContainer hide"} id="editbox" onClick={e => this.editActive()}
                        style={{ background: this.state.preferences.buttonsColor ? '#' + this.state.preferences.buttonsColor : this.state.preferences.theme ? "transparent" : (this.state.preferences.night ? "#313131" : "#C4D3E9") }}>
                        <img className="modContainerImage" id="editimg" src="edit.png" draggable={false}></img>
                      </div>

                      <div className={!(this.state.preferences.removeBtn) && this.state.user !== "default" && this.state.tabs.length !== 0 &&
                        !(this.state.tabIndex === this.state.tabs.length / this.state.numTabs && this.state.tabs.length > 0) ? "modContainer" : "modContainer hide"} id="erasebox" onClick={e => this.eraseActive()}
                        style={{ background: this.state.preferences.buttonsColor ? '#' + this.state.preferences.buttonsColor : this.state.preferences.theme ? "transparent" : (this.state.preferences.night ? "#313131" : "#C4D3E9") }}>
                        <img className="modContainerImage" id="trashimg" src="trash.png" draggable={false}></img>
                      </div>

                      <div className="modBoxConfirm" id="confirmerase" onClick={e => this.confirmErase()}
                        style={{ background: this.state.preferences.buttonsColor ? '#' + this.state.preferences.buttonsColor : this.state.preferences.theme ? "transparent" : (this.state.preferences.night ? "#313131" : "#C4D3E9") }}>
                        <div className="modImgConfirm" id="modimgconfirm"></div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </main>

            {
              this.state.user === "default" ? <div></div> : <div>
                <div className="tabEraseConfirm" id="taberaseconfirm">
                  <div className="tabEraseConfirmBox" id="taberaseconfirmbox">
                    <p className="tabEraseConfirmText">Are you sure you want to <span style={{ color: "rgb(255, 121, 121)" }}>remove</span> your <b>{this.state.tabToErase}</b> tab and all of its links?</p>
                    <button className="tabEraseConfirmBtn" onClick={e => this.confirmTabBox(e, null)}><img className="tabEraseImg" src="cancel.png" draggable={false}></img></button>
                    <button className="tabEraseConfirmBtn" onClick={e => this.eraseTab(e)}><div className="tabEraseCheck"></div></button>
                  </div>
                  <div className="tabEraseDeleting" id="taberasedeleting">
                    <p className="tabEraseDeletingText">Deleting...</p>
                    <div className="deleteLoader" id="deleteloader">
                      <div className="sk-chase" id="deleteloading">
                        <div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="shadow" id="shadow"></div>

                <AddLink addLink={this.linkCallback.bind(this)} userId={this.state.uid} currTab={this.state.selectedTab} tabs={this.state.tabs} allLinks={this.state.allLinks} suggestions={this.state.suggestions} />
                <EditLink editLink={this.editLinkCallback.bind(this)} currLink={this.state.selectedLink} currTab={this.state.selectedTab} tabs={this.state.tabs} allLinks={this.state.allLinks} suggestions={this.state.suggestions} />
                <Import addTab={this.tabCallback.bind(this)} addLinks={this.multipleLinkCallback.bind(this)} tabs={this.state.tabs} suggestions={this.state.suggestions} />
              </div>
            } </div> :
          <div className="placeholder"></div>
        }
      </div>
    )
  }

  openAddLink() {
    if (this.state.user !== "default") {
      if (document.getElementById("buttonnav").className.includes("edit"))
        this.editActive();
      else if (document.getElementById("buttonnav").className.includes("erase"))
        this.eraseActive();
      document.getElementById("AddFormDiv").classList.toggle("active");
      document.getElementById("shadow").classList.toggle("active");
    }
  }
  openEditForm(e, link) {
    if (this.state.user !== "default") {
      e.preventDefault();
      this.setState({ selectedLink: link });
      document.getElementById("EditFormDiv").classList.toggle("active");
      document.getElementById("shadow").classList.toggle("active");
    }
  }
  openAddTab() {
    if (this.state.user !== "default") {
      if (document.getElementById("buttonnav").className.includes("edit"))
        this.editActive();
      else if (document.getElementById("buttonnav").className.includes("erase"))
        this.eraseActive();
      document.getElementById("addtabdiv").classList.toggle("active");
      document.getElementById("taberrmsg").style.display = "none";
      document.getElementById("titletaberrmsg").style.display = "none";
      document.getElementById("addtabform").reset();

      if (!this.state.preferences.addTab)
        document.getElementById("addtabplus").classList.toggle("active");
      document.getElementById("lefttabarrow").classList.toggle("active");
      document.getElementById("righttabarrow").classList.toggle("active");
    }
  }
  openTabEdit(e, isClosing, tab) {
    if (this.state.user !== "default") {
      this.closeActiveEdit();
      if (!isClosing) {
        e.target.classList.toggle("active");
        if (document.getElementById("addtabdiv").className.includes("active")) {
          document.getElementById("addtabdiv").classList.toggle("active");
          document.getElementById("lefttabarrow").classList.toggle("active");
          document.getElementById("righttabarrow").classList.toggle("active");
        }
      }
    }
  }
  closeActiveEdit() {
    var editTabs = document.getElementsByClassName("editTabWrapper");
    for (var i = 0; i < editTabs.length; i++) {
      if (editTabs[i].className.includes("active"))
        editTabs[i].classList.toggle("active");
    }
  }
  toggleSideMenu() {
    document.getElementById("navbar").classList.toggle("active");
    document.getElementById("sidemenubtn").classList.toggle("active");
    if (this.state.user !== "default") {
      if (document.getElementById("resetconfirmbox").className.includes("active"))
        document.getElementById("resetconfirmbox").classList.toggle("active");
      if (document.getElementById("savebox").className.includes("active") && !document.getElementById("navbar").className.includes("active")) {
        document.getElementById("savebox").classList.toggle("active");
        document.getElementById("saveconfirm").classList.toggle("active");
        document.getElementById("shadow").classList.toggle("active");
      }
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
    document.addEventListener("keydown", async function (e) {
      if (this.state.user !== "default" && document.activeElement.id === "" && e.keyCode === 78) // N
        this.toggleNightMode();
      if (!e.altKey && this.state.user !== "default") {
        if (!document.getElementById("shadow").className.includes("active") && document.getElementsByClassName("editTabWrapper active").length === 0 &&
          !(document.activeElement.id.includes("contact")) && !(document.activeElement.id.includes("color")) && !document.getElementById("addtabdiv").className.includes("active")) {
          switch (e.keyCode) {
            case 9: // tab
              e.preventDefault();
              if (this.state.tabs.length > 1)
                this.switchToNextTab();
              break;
            case 27: // esc
              if (document.getElementById("searchbar").value !== "") {
                this.setState({ links: await this.getLinks(this.state.selectedTab) })
                document.getElementById("searchbar").value = "";
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
              if (document.activeElement.id === "" && this.state.tabs.length >= this.state.numTabs)
                this.changeTabs(-1);
              break;
            case 39: // right arrow
              if (document.activeElement.id === "" && this.state.tabs.length >= this.state.numTabs)
                this.changeTabs(1);
              break;
            case 69: //lmao E
              if (document.activeElement.id !== "searchbar" && this.state.user !== "default" && !this.state.preferences.editBtn)
                this.editActive();
              break;
            case 76: // L
              if (this.state.user !== "default" && document.activeElement.id === "" && this.state.tabs.length !== 0)
                this.openAddLink();
              break;
            case 77: // M
              if (document.activeElement.id !== "searchbar")
                this.toggleSideMenu();
              break;
            case 79: // O
              if (document.activeElement.id !== "searchbar")
                this.toggleSideMenu();
              break;
            case 80: // P
              if (this.state.user !== "default" && document.activeElement.id === "") {
                if (document.getElementById("profilewrapper").className.includes("active"))
                  document.getElementById("profilewrapper").className = "profileWrapper";
                else
                  document.getElementById("profilewrapper").className = "profileWrapper active";
              }
              break;
            case 82: // R
              if (document.activeElement.id !== "searchbar" && this.state.user !== "default" && !this.state.preferences.removeBtn)
                this.eraseActive();
              break;
            case 84: // T
              if (document.activeElement.id !== "searchbar" && this.state.user !== "default" && !this.state.preferences.addTab &&
                (this.state.tabIndex >= Math.floor(this.state.tabs.length / this.state.numTabs)))
                this.openAddTab();
              break;
            case 192: // `
              if (this.state.tabs.length > 1 && document.activeElement.id !== "searchbar")
                this.switchToPreviousTab();
              break;
          }
        } else if (document.getElementById("AddFormDiv").className.includes("active")) {
          if (document.activeElement.id === "addtitle" || document.activeElement.id === "addurl")
            this.setState({
              suggestedIndex: -1,
              suggestedTitleIndex: -1
            })
          switch (e.keyCode) {
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
        } else if (document.getElementById("EditFormDiv").className.includes("active")) {
          if (document.activeElement.id === "edittitle" || document.activeElement.id === "editurl")
            this.setState({
              suggestedIndex: -1,
              suggestedTitleIndex: -1
            })
          switch (e.keyCode) {
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
        } else if (document.getElementById("addtabdiv").className.includes("active")) {
          switch (e.keyCode) {
            case 9: // tab
              e.preventDefault();
              if (document.activeElement.id === "") {
                document.getElementById("tabinput").focus();
              } else {
                document.getElementById("tabinput").blur();
              }
              break;
          }
        } else if (document.activeElement.id.includes("contact")) {
          switch (e.keyCode) {
            case 9: // tab
              e.preventDefault();
              break;
          }
        }
      } else if (this.state.user !== "default") {
        if (!document.getElementById("shadow").className.includes("active") && document.getElementsByClassName("editTabWrapper active").length === 0 &&
          !(document.activeElement.id.includes("contact")) && !document.getElementById("addtabdiv").className.includes("active")) {
          switch (e.keyCode) {
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
      }
    }.bind(this))
  }

  getResizeTabs() {
    window.addEventListener("resize", async function (e) {
      clearTimeout(resize);
      resize = setTimeout(this.doResize(), 100);
    }.bind(this))
  }
  doResize() {
    this.setState({ numTabs: 550 + (this.state.preferences.gridWidth * 20) > window.innerWidth * 0.8 ? Math.floor(window.innerWidth * 0.8 / 220) : Math.floor((550 + (this.state.preferences.gridWidth * 20)) / 220) });
  }
}

/*
                  <div className="dropTabBox" id="droptabbox2" style={{
                    left: "auto", right: "-11rem", background: !(this.state.preferences.night || this.state.preferences.theme) ?
                      "linear-gradient(to left, rgb(249, 251, 253) 0%,#b6b9d1 100%)" : (this.state.preferences.theme ? "linear-gradient(to left, rgba(14, 14, 14, 0) 0%, rgba(14, 14, 14, 0.616) 50%," +
                        "rgb(46, 46, 46) 100%)" : "linear-gradient(to left, rgb(14, 14, 14) 0%,rgb(46, 46, 46) 100%)"), textAlign: "left"
                  }}
                    onDragEnter={e => this.dropTabHover(false)} onDragLeave={e => this.dropTabHover(false)} onDrop={e => this.changeTabPos(e, false)} onDragOver={e => e.preventDefault()}>
                    <p className="dropTabText" style={{ left: "0.4rem", textAlign: "left" }}>Move <br /> to back</p>
                  </div>

                  <div className="dropTabBox" id="droptabbox" onDragEnter={e => this.dropTabHover(true)} onDragLeave={e => this.dropTabHover(true)} onDrop={e => this.changeTabPos(e, true)}
                    onDragOver={e => e.preventDefault()}>
                    <p className="dropTabText">Move <br /> to front</p>
                  </div>

*/

export default Home;