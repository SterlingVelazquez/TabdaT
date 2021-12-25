import React from 'react';

var key = 0;

export class Hotbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      uid: this.props.userId,
      trendingLinks: this.props.trendingLinks,
      popularLinks: this.props.popularLinks,
      recentLinks: this.props.recentLinks
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      user: props.user,
      uid: props.userId,
      trendingLinks: props.trendingLinks,
      popularLinks: props.popularLinks,
      recentLinks: props.recentLinks
    }
  }

  toggleActive(elem) {
    if (!document.getElementById(elem + "links").className.includes("active")) {
      var elements = document.getElementsByClassName("hotbarLinks");
      for (var i = 0; i < elements.length; i++)
        if (elements[i].className.includes("active")) {
          elements[i].classList.toggle("active");
          document.getElementsByClassName("hotbarIconWrapper")[i].classList.toggle("active");
        }
      document.getElementById(elem + "links").classList.toggle("active");
      document.getElementById(elem + "tab").classList.toggle("active");
    }
  }

  render() {
    return (
      <div className="hotbarContainer">
        <div className="hotbar trending">
          <div className="hotbarIcons">
            <div className="hotbarIconWrapper" id="recenttab" onClick={e => this.toggleActive("recent")}>
              <img className="hotbarIcon" id="recenttab" src="recent.png" draggable={false}></img>
              <p className="hotbarIconTooltip" id="recenttooltip">Recent</p>
            </div>
            <div className="hotbarIconWrapper active" id="trendingtab" onClick={e => this.toggleActive("trending")}>
              <img className="hotbarIcon" id="trendingtab" src="top.png" draggable={false}></img>
              <p className="hotbarIconTooltip" id="trendingtooltip">Trending</p>
            </div>
            <div className="hotbarIconWrapper" id="populartab" onClick={e => this.toggleActive("popular")}>
              <img className="hotbarIcon" id="populartab" src="popular.png" draggable={false}></img>
              <p className="hotbarIconTooltip" id="populartooltip">Popular</p>
            </div>
          </div>
          <div className="hotbarLinks" id="recentlinks">
            {
              this.state.recentLinks.map((each) =>
                <a href={each.link} target="_blank" rel="noopener noreferrer" key={key++} onClick={e => this.props.updateShortcutCount(each.name)}>
                  <img className="hotbarLink" src={each.image}></img></a>
              )
            }
          </div>
          <div className="hotbarLinks active" id="trendinglinks">
            {
              this.state.trendingLinks.map((each) =>
                <a href={each.link} target="_blank" rel="noopener noreferrer" key={key++} onClick={e => this.props.updateShortcutCount(each.name)}>
                  <img className="hotbarLink" src={each.image}></img></a>
              )
            }
          </div>
          <div className="hotbarLinks" id="popularlinks">
            {
              this.state.popularLinks.map((each) =>
                <a href={each.link} target="_blank" rel="noopener noreferrer" key={key++} onClick={e => this.props.updateShortcutCount(each.name)}>
                  <img className="hotbarLink" src={each.image}></img></a>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}