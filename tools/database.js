import {firebase} from '../tools/config.js'

class Database {

    async getDefaultTabs() {
        var tabs = [];
        await firebase.database().ref('default/Tabs').orderByChild("pos").once('value').then(async function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                tabs.push({
                    name: childSnapshot.val()["name"],
                    color: childSnapshot.val()["color"]
                })
            })
        })
        return tabs;
    }

    async getDefaultLinks(tab) {
        var links = [];
        await firebase.database().ref('default/Links').orderByChild("tab").equalTo(tab).once('value').then(async function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                links.push({
                    name: childSnapshot.val()["name"],
                    link: childSnapshot.val()["link"],
                    image: childSnapshot.val()["image"]
                })
            })
        })
        return links;
    }
}

let database = new Database;
export {database};