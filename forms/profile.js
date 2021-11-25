import React from 'react';
import { database } from "../tools/database.js";
var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };
const emailTest = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            user: this.props.user,
            email: null,
            message: null,
        };
    }

    static getDerivedStateFromProps(props) {
        return {
            user : props.user,
        }
    }

    async checkSignIn() {  if (this.state.user === "default") this.props.signIn();  }
    async checkSignOut() {  if (this.state.user !== "default") this.props.signOut();  }

    async profileActive() {
        if (this.state.user === "default") {
            this.props.signIn();
        } else {
            document.getElementById("profilewrapper").classList.toggle("active");
        }
    }

    async viewContactForm() { document.getElementById("profilewrapper").classList.toggle("contact"); }
    async setEmail(event) { this.setState({email: event.target.value}); }
    async setMessage(event) { this.setState({message: event.target.value}); }

    async cancelContactForm() {
        if (this.state.message !== null && this.state.message.trim().length > 0) {
            document.getElementById("shadow").classList.toggle("active");
            document.getElementById("contactconfirm").classList.toggle("active");
        } else {
            document.getElementById("profilewrapper").classList.toggle("contact");
        }
    }
    async closeConfirm() {
        document.getElementById("shadow").classList.toggle("active");
        document.getElementById("contactconfirm").classList.toggle("active") 
    }
    async confirmCancel() {
        document.getElementById("shadow").classList.toggle("active");
        document.getElementById("contactconfirm").classList.toggle("active");
        document.getElementById("contactform").reset();
        document.getElementById("profilewrapper").classList.toggle("contact");
        document.getElementById("emailerror").className = "emailError";
        this.setState({message: null});
    }

    async submitContactForm(e) {
        e.preventDefault();
        var currEmail = this.state.email !== null ? this.state.email : this.state.user.email;
        if (emailTest.test(currEmail.toLowerCase())) {
            document.getElementById("emailerror").className = "emailError";
            document.getElementById("contactform").classList.toggle("hide");
            document.getElementById("contacttext").classList.toggle("hide");
            document.getElementById("contactbutton1").classList.toggle("hide");
            document.getElementById("contactbutton2").classList.toggle("hide");
            document.getElementById("loadercontact").classList.toggle("active");
            document.getElementById("loadercontactdiv").classList.toggle("active");
            Email.send({ 
                SecureToken: "730fe256-e76c-4515-be74-418c5debadf7", 
                To: 'sterlingvelazquez@tabdat.app', 
                From: "sterlingvelazquez@tabdat.app", 
                Subject: "Message from - " + this.state.user.displayName, 
                Body: "<html><p>Email: " + currEmail + "</p></br><p>" + this.state.message + "</p></br></br></html>", 
            }) 
            .then(function (message) {
                document.getElementById("loadercontact").classList.toggle("active");
                document.getElementById("loadercontactdiv").classList.toggle("active");
                document.getElementById("contactcheck").classList.toggle("active");
                for (var i = 0; i < 8; i++) 
                    document.getElementsByClassName("contactCheckLine")[i].classList.toggle("active");
                document.getElementById("submitcontacttext").classList.toggle("active");
                document.getElementById("aftercontacttext").classList.toggle("active");
                document.getElementById("submitcontactcancel").classList.toggle("active");
                setTimeout(function(){ document.getElementById("profilewrapper").classList.toggle("contact")}, 2800);
            }) 
        } else {
            document.getElementById("emailerror").className = "emailError active";
        }
    }

    async viewShortcuts() { document.getElementById("profilewrapper").classList.toggle("shortcut"); }

    render() {
        return (
            <div>
                <div className="profileWrapper" id="profilewrapper">
                    <div className="profileRelative" id="profilerelative">
                        <div className="profileDiv" id="profilediv">
                            <img src={this.state.user === "default" ? "black-male.png" : this.state.user.photoURL} className="profilePic" id="profilepic" 
                                draggable="false" onClick={e => this.profileActive()}></img>
                            <p className="signInText active" id="signintext" onClick={e => this.checkSignIn()}>Sign In</p>
                            <p className="signOutText" id="signouttext" onClick={e => this.checkSignOut()}>Sign Out</p>
                            <ul className="profileList">
                                <li className="profileOption" id="profileoption1" onClick={e => this.viewContactForm()}>
                                    <img className="profileIcon" id="profileicon1" src="message.png"></img>
                                    <p className="profileText" id="profiletext1">Contact</p>
                                </li>
                                <li className="profileOption" id="profileoption2" onClick={e => this.viewShortcuts()}>
                                    <img className="profileIcon" id="profileicon2" src="keyboard.png"></img>
                                    <p className="profileText" id="profiletext2">Shortcuts</p>
                                </li>
                            </ul>
                        </div>
                        <div className="contactDiv" id="contactdiv">
                            <p className="contactText" id="contacttext">Questions? Feedback? Comments? I'm here to listen.</p>
                            <form className="contactForm" id="contactform" onSubmit={e => this.submitContactForm(e)}>
                                <p className="contactLabel">Preferred Email Address</p>
                                <input className="contactEmail" id="contactemail" defaultValue={this.state.user.email} onInput={e => this.setEmail(e)} required></input>
                                <p className="emailError" id="emailerror">Invalid Email</p>
                                <p className="contactLabel">Message</p>
                                <textarea className="contactMessage" id="contactmessage" onInput={e => this.setMessage(e)} required></textarea>
                                <br/>
                                <button type="submit" className="contactButton" id="contactbutton1">Submit</button>
                                <button type="button" className="contactButton" id="contactbutton2" onClick={e => this.cancelContactForm()}>Cancel</button>
                            </form>
                            <div className="submitContactDiv" id="submitcontactdiv">
                                <div className="loaderContactDiv" id="loadercontactdiv">
                                    <div className="loaderContact" id="loadercontact">
                                        <div className="dotContact"></div>
                                        <div className="dotContact"></div>
                                        <div className="dotContact"></div>
                                        <div className="dotContact"></div>
                                    </div>
                                </div>
                                <div className="contactCheck" id="contactcheck"></div>
                                <div className="contactCheckEffects">
                                    <div className="contactCheckLine"></div>
                                    <div className="contactCheckLine"></div>
                                    <div className="contactCheckLine"></div>
                                    <div className="contactCheckLine"></div>
                                    <div className="contactCheckLine"></div>
                                    <div className="contactCheckLine"></div>
                                    <div className="contactCheckLine"></div>
                                    <div className="contactCheckLine"></div>
                                </div>
                                <p className="submitContactText" id="submitcontacttext"><b>Message Sent!</b></p>
                                <p className="afterContactText" id="aftercontacttext">Please allow a few minutes before attempting to send further messages.</p>
                                <img className="submitContactCancel" id="submitcontactcancel" src="cancel.png" onClick={e => this.viewContactForm()}></img>
                            </div>
                        </div>
                        <div className="shortcutDiv" id="shortcutdiv">
                            <div className="shortcutHeader">
                                <p className="shortcutHeaderText">Keyboard Shortcuts</p>
                                <img className="shortcutCancel" src="cancel.png" onClick={e => this.viewShortcuts()}></img>
                            </div>
                            <div className="shortcutContainer">
                                <ul className="keyboardList">
                                    <li className="keyboard"><kbd>TAB</kbd></li>
                                    <li className="keyboard"><kbd>`</kbd></li>
                                    <li className="keyboard"><kbd>M</kbd>&nbsp;or&nbsp;<kbd>O</kbd></li>
                                    <li className="keyboard"><kbd>P</kbd></li>
                                    <li className="keyboard"><kbd>L</kbd></li>
                                    <li className="keyboard"><kbd>E</kbd></li>
                                    <li className="keyboard"><kbd>R</kbd></li>
                                    <li className="keyboard"><kbd>SPACE</kbd></li>
                                    <li className="keyboard"><kbd>ESC</kbd></li>
                                    <li className="keyboard"><kbd>SHIFT</kbd> + <kbd>1</kbd></li>
                                </ul>
                                <ul className="shortcutList">
                                    <li className="shortcut">Next Tab</li>
                                    <li className="shortcut">Previous Tab</li>
                                    <li className="shortcut">Opens / Closes Menu</li>
                                    <li className="shortcut">Opens / Closes Profile</li>
                                    <li className="shortcut">Add Link</li>
                                    <li className="shortcut">Edit Mode</li>
                                    <li className="shortcut">Remove Mode</li>
                                    <li className="shortcut">Enter Search Bar</li>
                                    <li className="shortcut">Exit Search Bar</li>
                                    <li className="shortcut">Opens First Link<br/>(2 opens second link, etc.)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="saveConfirm" id="contactconfirm">
                    <p className="saveConfirmText" id="contactconfirmtext">Are you sure you want to discard your message?</p>
                    <button className="saveConfirmBtn" onClick={e => this.closeConfirm()}><img className="saveConfirmImg" src="cancel.png"></img></button>
                    <button className="saveConfirmBtn" onClick={e => this.confirmCancel()}><div className="saveCheck"></div></button>
                </div>
            </div>
        );
    }
}
