import React from 'react';
import { EditLink } from '../forms/editLink';

export class LinkContextMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: this.props.uid,
            link: this.props.link,
            preferences: this.props.preferences
        };
    }

    static getDerivedStateFromProps(props) {
        return {
            uid: props.uid,
            link: props.link,
            preferences: props.preferences
        }
    }

    eraseLink(e) {
        e.stopPropagation();
        document.getElementById("linkcontextmenuwrapper").classList.toggle("erase");
    }
    openWindow(link) {
        window.open(link, '_blank','location=1, status=1, scrollbars=1, resizable=1, directories=1, toolbar=1, titlebar=1');
    }
    copyToClipboard(text) {
        navigator.clipboard.writeText(text);
    }

    render() {
        return (
            <div className="linkContextMenu" id="linkcontextmenu" onContextMenu={e => e.preventDefault()}>
                <div className="linkContextMenuWrapper" id="linkcontextmenuwrapper" onContextMenu={e => e.preventDefault()}>
                    <div className="linkContextMenuContainer">
                        {this.state.uid !== "default" ?
                            <div className="linkContextMenuOptions">
                                <button className="linkContextMenuButton">
                                    <p className="linkContextMenuButtonText" onClick={e => this.props.editLink(e, this.state.link)}>Edit</p>
                                </button>
                                <button className="linkContextMenuButton">
                                    <p className="linkContextMenuButtonText" onClick={e => this.eraseLink(e)}>Erase</p>
                                </button>
                            </div>
                            : <div />
                        }

                        <div className="linkContextMenuOptions">
                            <div className="linkContextMenuOption">
                                <p className="linkContextMenuOptionText" onClick={e => this.openWindow(this.state.link.link)}>Open in New Window</p>
                            </div>
                            <div className="linkContextMenuOption">
                                <p className="linkContextMenuOptionText" onClick={e => this.openWindow(this.state.link.image)}>Open Image in New Tab</p>
                            </div>
                        </div>

                        <div className="linkContextMenuDivider"></div>

                        <div className="linkContextMenuOptions">
                            <div className="linkContextMenuOption">
                                <p className="linkContextMenuOptionText" onClick={e => this.copyToClipboard(this.state.link.link)}>Copy Link Address</p>
                            </div>
                            <div className="linkContextMenuOption">
                                <p className="linkContextMenuOptionText" onClick={e => this.copyToClipboard(this.state.link.image)}>Copy Image Address</p>
                            </div>
                        </div>
                    </div>

                    <div className="linkContextMenuErase" id="linkcontextmenuerase">
                        <p className="linkContextMenuEraseHeader">Are you sure you want to erase this link?</p>
                        <img className="linkContextMenuEraseCancel" src="cancel.webp" onClick={e => this.eraseLink(e)}></img>
                        <div className="linkContextMenuCheckmarkContainer" onClick={e => this.props.eraseLink(this.state.link)}>
                            <div className="linkContextMenuCheckmark"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}