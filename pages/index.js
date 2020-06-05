import React from 'react';
import Head from 'next/head';
import {database} from "../tools/database.js";
import {firebase} from "../tools/config.js"
import AddLink from "../forms/addLink.js"
import AddTab from "../forms/addTab.js"
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
        selectedTab : null,
        links : [],
        profilePic : 
          <div onClick={e => this.signIn()} className="profilePic">
            <p>Sign In</p>
            <img src="black-male-user-symbol.png"></img>
          </div>
      };
  }

  async componentDidMount() {
    this.setState({tabs : await database.getTabs(this.state.uid)})
    this.setState({selectedTab : this.state.tabs[0].name})
    this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
  }

  async get() {
    this.setState({tabs : await database.getTabs(this.state.uid)})
    if (this.state.tabs.length > 0) 
      this.setState({selectedTab : this.state.tabs[0].name}) 
    this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
  }

  async signIn() {
    this.setState({user : await firebase.auth().signInWithPopup(provider)});
    if (this.state.user === "default") {
      this.setState({
        profilePic : 
          <div onClick={e => this.signIn()} className="profilePic">
            <p>Sign In</p>
            <img src="black-male-user-symbol.png"></img>
          </div>
      })
    } else {
      this.setState({profilePic : 
        <div onClick={e => this.signOut()} className="profilePic">
            <p>Sign Out</p>
            <img src={this.state.user.additionalUserInfo.profile.picture}></img>
        </div>,
        uid : this.state.user.additionalUserInfo.profile.id
      })
      this.get();
    }
  }

  async signOut() {
    this.setState({
      user: "default",
      uid: "default",
      profilePic : 
        <div onClick={e => this.signIn()} className="profilePic">
          <p>Sign In</p>
          <img src="black-male-user-symbol.png"></img>
        </div>
    })
    await firebase.auth().signOut();
    this.get();
  }

  async activeBtn(each) {
    this.setState({selectedTab : await each.name});
    this.setState({links : await database.getLinks(this.state.uid, this.state.selectedTab)})
    //Get the active button using a loop
    var btns = document.getElementsByClassName("navBtns");
  }

  render() {
    return (
      <div className="container">
        <Head>
          <title>TabdaT</title>
          <link rel="icon" href="/favicon.ico"/>

          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&display=swap" rel="stylesheet"></link>
        </Head>

        <main>
            <p style={{color:"black"}} className="title">
              <span className="letter">T</span>
              <span className="letter">A</span>
              <span className="letter">B</span>
              <span className="letter">D</span>
              <span className="letter">A</span>
              <span className="letter">T</span>
            </p>

            <div className="bodyBox">
              {this.state.profilePic}

              <input className="searchBar" placeholder="Search for your links here..."></input>
              <br/>
              <div className = "buttonNav">
                  {
                    this.state.tabs.slice(0,4).map( (each) => 
                      <button className="navBtns" style={{color:each.color, borderBottomColor:each.color}} key={key++} 
                          onClick={e => this.activeBtn(each)}>{each.name}
                          <div className="navBtnBottom" style={{background:each.color}}></div></button>
                    )
                  }
              </div>
              <AddTab/>
              <br/>
              <div className="grid">

              { 
                this.state.links.map( (each) =>
                <a style={{textDecoration:"none"}} target="_blank" rel="noopener noreferrer" key={key++} href={each.link}>
                  <img src={each.image} key={key++}></img>
                  <p className="linkNames">{each.name}</p>
                </a>
                )
              }
              </div>
              <br/>
              <div className="addContainer" onClick={e => this.openAddLink()}>
                <div className="addSlider">
                  <img src="plus.png"></img></div>
                  <button className="addLink">Add New Link</button>
              </div>
            </div>
          </main>
          
          <div className="shadow" id="shadow"></div>
          <AddLink userId={this.state.uid} currTab={this.state.selectedTab}/>
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
}

export default Home;
