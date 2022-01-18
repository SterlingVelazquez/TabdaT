import React from 'react';

var key = 0;

export class Hotbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: this.props.uid,
      trendingLinks: this.props.trendingLinks,
      popularLinks: this.props.popularLinks,
      recentLinks: this.props.recentLinks
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      uid: props.uid,
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
              <img className="hotbarIcon" id="recenttab" src="recent.webp" draggable={false}></img>
              <p className="hotbarIconTooltip" id="recenttooltip">Recent</p>
            </div>
            <div className="hotbarIconWrapper active" id="trendingtab" onClick={e => this.toggleActive("trending")}>
              <img className="hotbarIcon" id="trendingtab" src="top.webp" draggable={false}></img>
              <p className="hotbarIconTooltip" id="trendingtooltip">Trending</p>
            </div>
            <div className="hotbarIconWrapper" id="populartab" onClick={e => this.toggleActive("popular")}>
              <img className="hotbarIcon" id="populartab" src="popular.webp" draggable={false}></img>
              <p className="hotbarIconTooltip" id="populartooltip">Popular</p>
            </div>
          </div>
          <div className="hotbarLinks" id="recentlinks">
            {this.state.recentLinks.length ?
              this.state.recentLinks.map((each) =>
                <a className="hotbarLinkWrapper" href={each.link} target="_blank" rel="noopener noreferrer" key={key++} onClick={e => this.props.updateShortcutCount(each.name)}>
                  <img className="hotbarLink" src={each.image}></img></a>
              ) : <p className="recentPlaceholder">{this.state.uid !== "default" ? <span>your most recent links will show up here</span> : 
                    <span><b onClick={e => this.props.signIn()} style={{cursor: "pointer"}}>sign in</b> to google to unlock this feature</span>}</p>
            }
          </div>
          <div className="hotbarLinks active" id="trendinglinks">
            {
              this.state.trendingLinks.map((each) =>
                <a className="hotbarLinkWrapper" href={each.link} target="_blank" rel="noopener noreferrer" key={key++} onClick={e => this.props.updateShortcutCount(each.name)}>
                  <img className="hotbarLink" src={each.image}></img></a>
              )
            }
          </div>
          <div className="hotbarLinks" id="popularlinks">
            {this.state.popularLinks.length ?
              this.state.popularLinks.map((each) =>
                <a className="hotbarLinkWrapper" href={each.link} target="_blank" rel="noopener noreferrer" key={key++} onClick={e => this.props.updateShortcutCount(each.name)}>
                  <img className="hotbarLink" src={each.image}></img></a>
              ) : <p className="popularPlaceholder">{this.state.uid !== "default" ? <span>your most popular links will show up here</span> : 
                    <span><b onClick={e => this.props.signIn()} style={{cursor: "pointer"}}>sign in</b> to google to unlock this feature</span>}</p>
            }
          </div>
        </div>
      </div>
    );
  }
}