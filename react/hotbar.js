import React from 'react';
import { database } from "../tools/database.js";

var key = 0;

export class Hotbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            user: this.props.user,
            uid : this.props.userId,
        };
    }

    static getDerivedStateFromProps(props) {
        return {
            user: props.user,
            uid : props.userId,
        }
    }

    render () {
        return (
            <div className="hotbarContainer">
              <div className="hotbar">
                <div className="hotbarIcons">
                  <img className="hotbarIcon" id="recenttab" src="recent.png"></img>
                  <img className="hotbarIcon active" id="trendingtab" src="top.png"></img>
                  <img className="hotbarIcon" id="populartab" src="popular.png"></img>
                </div>
                <div className="hotbarLinks">
                  <img className="hotbarLink" id="recentlink" src="ultafedIgm/A.png"></img>
                  <img className="hotbarLink" id="trendinglink" src="ultafedIgm/A.png"></img>
                  <img className="hotbarLink" id="popularlink" src="ultafedIgm/A.png"></img>
                  <img className="hotbarLink" id="popularlink" src="ultafedIgm/A.png"></img>
                  <img className="hotbarLink" id="popularlink" src="ultafedIgm/A.png"></img>
                </div>
              </div>
            </div>
        );
    }
}