import React from 'react';
import Head from 'next/head';
import {database} from "../tools/database.js";
import {firebase} from "../tools/config.js"
import AddLink from "../forms/addLink.js"
import AddTab from "../forms/addTab.js"
import "./_app.js"

var provider = new firebase.auth.GoogleAuthProvider();
var key=0;

class Home extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
        user: null,
        uid: null,
        tabs : [],
        selectedTab : null,
        links : [],
        profilePic : <div onClick={e => this.signIn()} className="profilePic">
                        <p>Sign In</p>
                        <img src="black-male-user-symbol.png"></img>
                     </div>
      };
  }

  async componentDidMount() {
    this.setState({tabs : await database.getDefaultTabs()})
    this.setState({selectedTab : this.state.tabs[0].name})
    this.setState({links : await database.getDefaultLinks(this.state.selectedTab)})
  }

  async signIn() {
    this.state.user = await firebase.auth().signInWithPopup(provider);
    if (this.state.user === null) {
      this.setState({profilePic : 
                      <div onClick={e => this.signIn()} className="profilePic">
                          <p>Sign In</p>
                          <img src="black-male-user-symbol.png"></img>
                      </div>})
    } else {
      this.setState({profilePic : 
        <div onClick={e => this.signOut()} className="profilePic">
            <p>Sign Out</p>
            <img src={this.state.user.additionalUserInfo.profile.picture}></img>
        </div>,
        uid : this.state.user.additionalUserInfo.profile.email
      })
    }
  }

  async signOut() {
    this.setState({user: null})
    this.setState({profilePic : 
      <div onClick={e => this.signIn()} className="profilePic">
          <p>Sign In</p>
          <img src="black-male-user-symbol.png"></img>
      </div>})
    await firebase.auth().signOut();
  }

  async activeBtn(each) {
    this.setState({selectedTab : await each.name});
    this.setState({links : await database.getDefaultLinks(this.state.selectedTab)})
    //Get the active button using a loop
    var btns = document.getElementsByClassName("navBtns");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function() {
        console.log("hello")
          var current = document.getElementsByClassName("active");
          if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
          } else {
            btns[0].class = "navBtns active";
          }
          this.className = "navBtns active";
      });
  }}

  render() {
    return (
      <div className="container">
        <Head>
          <title>TabdaT</title>
          <link rel="icon" href="/favicon.ico"/>

          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&display=swap" rel="stylesheet"></link>
          <script src="https://cdn.jsdelivr.net/npm/@jaames/iro"></script>
        </Head>

        <main>
            <p style={{color:"black"}} className="title">
              TabdaT
            </p>

            {this.state.profilePic}

            <input className="searchBar" placeholder="Search for your links here..."></input>

            <div className = "buttonNav">
                {
                  this.state.tabs.slice(0,4).map( (each) => 
                    <button className="navBtns" key={key++} onClick={e => this.activeBtn(each)}>{each.name}</button>
                  )
                }
                <img className="addTabPlus" src="plus.png" onClick={e => this.openAddTab()}></img>
                <AddTab/>
            </div>

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

            <div className="addContainer" onClick={e => this.openAddLink()}>
              <div className="addSlider">
                <img src="plus.png"></img></div>
                <button className="addLink">Add New Link</button>
            </div>

        </main>

        <footer> TVTech </footer>
        
        <div className="shadow" id="shadow"></div>
        <AddLink userId={this.state.uid}/>
      </div>
    )
  }

  openAddLink() {
    document.getElementById("AddFormDiv").style.height = "390px";
    document.getElementById("AddFormDiv").style.opacity = "1";
    document.getElementById("shadow").style.opacity = "0.4";
    document.getElementById("shadow").style.height = "100%";
  }

  openAddTab() {
    document.getElementById("AddTabDiv").style.width = "250px";
    document.getElementById("AddTabDiv").style.height = "auto";
    document.getElementById("AddTabDiv").style.opacity = "1";
    document.getElementById("shadow").style.opacity = "0.4";
    document.getElementById("shadow").style.height = "100%";
  }
}

export default Home;
