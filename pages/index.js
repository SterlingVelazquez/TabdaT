import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import {database} from "../tools/database.js";
import "./_app.js"

var key=0;
//This is a comment
class Home extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
        tabs : ["Financial", "Medical", "Legal", "Auto", 'Personal'],
        links : database
      };
  }

  activeBtn() {
    //Get the active button using a loop
    var btns = document.getElementsByClassName("btns");
    for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
        var current = document.getElementsByClassName("active");
        if (current.length > 0) {
          console.log("bye")
          current[0].className = current[0].className.replace(" active", "");
        } else {
          console.log("hello")
          btns[0].class = "btns active";
        }
        this.className = "btns active";
    });
  }}

  render(){
    return (
      <div className="container">
        <Head>
          <title>TabdaT</title>
          <link rel="icon" href="/favicon.ico"/>

          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap" rel="stylesheet"></link>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&display=swap" rel="stylesheet"></link>
          <script src="https://kit.fontawesome.com/84e39d63f3.js" crossOrigin="anonymous"></script>
        </Head>

        <main>
          <p className="title">
            TabdaT
          </p>

          <input placeholder="Search for your links here..."></input>

          <div className = "buttonNav">
              {
                this.state.tabs.slice(0,4).map( (each) => 
                  <button className="btns" key={key++} onClick={e => this.activeBtn()}>{each}</button>
                )
              }
              <i className="fas fa-plus"></i>
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

          <button className="addLink">Add New Link</button>
          </div>
		  <br>
		  /*<!-- <div>
			<table id=testTable>
				<tr>
					<td>THIS IS A TEST CELL</td>
				</tr>
			</table>
		  </div> -->*/
        </main>

        <footer> TVTech </footer>

        <style jsx global>{`
          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    )
  }
}

export default Home;
