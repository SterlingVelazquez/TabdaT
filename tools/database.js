import {firebase} from '../tools/config.js'
import 'firebase/storage'

class Database {

    async getTabs(user) {
        var tabs = [];
        await firebase.database().ref(user + '/Tabs').orderByChild("pos").once('value').then(async function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                tabs.push({
                    name: childSnapshot.val()["name"],
                    color: childSnapshot.val()["color"],
                    pos: childSnapshot.val()["color"]
                })
            })
        })
        return tabs;
    }

    async getLinks(user, tab) {
        var isEmpty = true;
        await firebase.database().ref(user).once('value', function(snapshot) {
            if (snapshot.hasChild('Links')) {
                isEmpty = false;
            }
        })
        var links = [];
        if (!isEmpty) {
            await firebase.database().ref(user + '/Links').orderByChild("tab").equalTo(tab).once('value').then(async function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    links.push({
                        name: childSnapshot.val()["name"],
                        link: childSnapshot.val()["link"],
                        image: childSnapshot.val()["image"],
                        ref: childSnapshot.val()["ref"],
                    })
                })
            })
        }
        return links;
    }

    async addTab(tab, uid) {
        await firebase.database().ref(uid + '/Tabs' + '/' + tab.name).set(tab);
    }

    async addLink(link, uid) {
        if (typeof link.image === "object") {
            await firebase.storage().ref(uid).child(link.name).put(link.image).then(async res => {
                link.ref = uid + '/' + link.name;
                console.log(link.ref)
                await firebase.database().ref(uid + '/Links/' + link.name).set(link);
            })
        } else {
            await firebase.database().ref(uid + '/Links/' + link.name).set(link);
        }
    }

    async editLink(link, uid, ref, name) {
        if (typeof link.image === "object") {
            await this.eraseLinks(uid, name);
            await firebase.storage().ref(uid).child(link.name).put(link.image).then(async res => {
                link.ref = uid + '/' + link.name;
                await firebase.database().ref(uid + '/Links/' + link.name).set(link);
            })
        } else if (!(link.image.includes('ultafedIgm/'))) {
            link.ref = ref;
            await firebase.database().ref(uid + '/Links/' + name).remove();
            await firebase.database().ref(uid + '/Links/' + link.name).set(link);
        } else {
            await this.eraseLinks(uid, name);
            await firebase.database().ref(uid + '/Links/' + link.name).set(link);
        }
    }

    async editTab(tab, uid, currTab) {
        await firebase.database().ref(uid + '/Links').orderByChild("tab").equalTo(currTab).once('value').then(async function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                childSnapshot.ref.update({tab: tab.name})
            })
        })
        await firebase.database().ref(uid + '/Tabs/' + currTab).remove();
        await this.addTab(tab, uid)
    }

    async eraseLinks(uid, links) {
        for (var i = 0; i < links.length; i++) {
            await firebase.storage().ref(uid + '/' + links[i]).delete().then((res) => {
                //Success
            }).catch(function () {
                console.log("Deleted File")
            })
            await firebase.database().ref(uid + '/Links/' + links[i]).remove();
        }
    }

    async eraseTab(uid, tab) {
        var links = [];
        await firebase.database().ref(uid + '/Links').orderByChild("tab").equalTo(tab).once('value').then(async function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                links.push({
                    name: childSnapshot.val()["name"],
                })
            })
        })
        for (var i = 0; i < links.length; i++) {
            await firebase.storage().ref(uid + '/' + links[i].name).delete().then((res) => {
                //Success
            }).catch(function () {
                console.log("Deleted File")
            })
            await firebase.database().ref(uid + '/Links/' + links[i].name).remove();
        }
        await firebase.database().ref(uid + '/Tabs/' + tab).remove();
    }
}

let database = new Database;
export {database};