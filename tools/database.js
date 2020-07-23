import {firebase} from '../tools/config.js'
import 'firebase/storage'

class Database {

    async getPreferences(user) {
        var preferences = [];
        await firebase.database().ref(user + '/Preferences').once('value').then(async function(snapshot) {
            if (snapshot.exists()) {
                preferences.push({
                    addLink: snapshot.val()["addLink"],
                    addTab: snapshot.val()["addTab"],
                    buttonsColor: snapshot.val()["buttonsColor"],
                    editBtn: snapshot.val()["editBtn"],
                    gridSize: snapshot.val()["gridSize"],
                    imageShadowColor: snapshot.val()["imageShadowColor"],
                    imageShadowSize: snapshot.val()["imageShadowSize"],
                    linkArrows: snapshot.val()["linkArrows"],
                    linkImageSize: snapshot.val()["linkImageSize"],
                    linkShadowColor: snapshot.val()["linkShadowColor"],
                    linkShadowSize: snapshot.val()["linkShadowSize"],
                    linkTextColor: snapshot.val()["linkTextColor"],
                    linkTextSize: snapshot.val()["linkTextSize"],
                    night: snapshot.val()["night"],
                    numLinks: snapshot.val()["numLinks"],
                    removeBtn: snapshot.val()["removeBtn"],
                    tabArrows: snapshot.val()["tabArrows"],
                    tabShadowSize: snapshot.val()["tabShadowSize"],
                    tabTextShadowColor: snapshot.val()["tabTextShadowColor"],
                })
            } else {
                preferences.push({
                    addLink: false,
                    addTab: false,
                    buttonsColor: false,
                    editBtn: false,
                    gridSize:20,
                    imageShadowColor: false,
                    imageShadowSize:20,
                    linkArrows: false,
                    linkImageSize:50,
                    linkShadowColor: false,
                    linkShadowSize:10,
                    linkTextColor: false,
                    linkTextSize:50,
                    night: false,
                    numLinks:10,
                    removeBtn: false,
                    tabArrows: false,
                    tabShadowSize:20,
                    tabTextShadowColor: false,
                })
                firebase.database().ref(user + '/Preferences').set(preferences[0]);
            }
        })
        return preferences[0];
    }

    async getTabs(user) {
        var tabs = [];
        await firebase.database().ref(user + '/Tabs').orderByChild("pos").once('value').then(async function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                tabs.push({
                    name: childSnapshot.val()["name"],
                    color: childSnapshot.val()["color"],
                    pos: childSnapshot.val()["pos"]
                })
            })
        })
        return tabs;
    }

    async getAllLinks(user, tab) {
        var isEmpty = true;
        await firebase.database().ref(user).once('value', function(snapshot) {
            if (snapshot.hasChild('Links')) {
                isEmpty = false;
            }
        })
        var links = [];
        if (!isEmpty) {
            await firebase.database().ref(user + '/Links').orderByChild("pos").once('value').then(async function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    links.push({
                        name: childSnapshot.val()["name"],
                        link: childSnapshot.val()["link"],
                        image: childSnapshot.val()["image"],
                        tab: childSnapshot.val()["tab"],
                        ref: childSnapshot.val()["ref"],
                        pos: childSnapshot.val()["pos"]
                    })
                })
            })
        }
        return links;
    }

    stringSearch(input, links, distance, isURL) {
        var result = links;

        for (var i = 0; i < links.length; i++) {
            if (isURL)
                var name = links[i].url;
            else
                var name = links[i].name;
            links[i].dist = this.editDistance(input.toUpperCase(), name.toUpperCase());

            if (name.toUpperCase().includes(input.toUpperCase())) {
                links[i].dist = 0.0;
            }
        }

        result = links.filter(function (a) { return a.dist < distance});
        links.sort(function (a, b) {
            return a.dist - b.dist
        })
        return result;
    }

    editDistance(str1, str2) {
        var T =  Array(str1.length + 1).fill(0).map(x => Array(str1.length + 1).fill(0));

        for (var i=0; i <= str1.length; i++) {
            T[0][i] = i;
        }
    
        for (i=0; i <= str1.length; i++) {
            T[i][0] = i;
        }
    
       var m = str1.length;
       var n = str1.length;
       for (i = 1; i <= m; i++) {
           for (var j = 1; j <= n; j++) {
               if (str1.charAt(i-1)===str2.charAt(j-1)) {
                   T[i][j] = T[i-1][j-1];
               } else {
                   T[i][j] = 1 + Math.min(T[i][j-1], Math.min(T[i-1][j], T[i-1][j-1]));
               }
            }
       }
    
       return T[str1.length][str1.length] / str1.length;
    }

    async addTab(tab, uid) {
        await firebase.database().ref(uid + '/Tabs' + '/' + tab.name).set(tab);
    }

    async addLink(link, uid) {
        if (typeof link.image === "object") {
            await firebase.storage().ref(uid).child(link.name).put(link.image).then(async res => {
                link.ref = uid + '/' + link.name;
                await firebase.database().ref(uid + '/Links/' + link.name).set(link);
            })
        } else {
            await firebase.database().ref(uid + '/Links/' + link.name).set(link);
        }
    }

    async addLinks(links, uid) {
        for (var i = 0; i < links.length; i++) {
            await firebase.database().ref(uid + '/Links/' + links[i].name).set(links[i]);
        }
    }

    async editLink(link, uid, ref, name) {
       if (typeof link.image === "object") {
            await this.eraseLinks(uid, [{name: name, ref: ref}]);
            await firebase.storage().ref(uid).child(link.name).put(link.image).then(async res => {
                link.ref = uid + '/' + link.name;
                await firebase.database().ref(uid + '/Links/' + link.name).set(link);
            })
        } else if (typeof ref === "string") {
            if (typeof link.ref === "undefined")
                await firebase.storage().ref(uid).child(name[0]).delete();
            await firebase.database().ref(uid + '/Links/' + name[0]).remove();
            await firebase.database().ref(uid + '/Links/' + link.name).set(link);
        } else {
            await this.eraseLinks(uid, [{name: name, ref: ref}]);
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
            if (links[i].ref !== "" && typeof links[i].ref !== "undefined")
                await firebase.storage().ref(uid + '/' + links[i].name).delete();
            await firebase.database().ref(uid + '/Links/' + links[i].name).remove();
        }
    }

    async eraseTab(uid, tab) {
        var links = [];
        await firebase.database().ref(uid + '/Links').orderByChild("tab").equalTo(tab).once('value').then(async function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                links.push({
                    name: childSnapshot.val()["name"],
                    ref: childSnapshot.val()["ref"]
                })
            })
        })
        for (var i = 0; i < links.length; i++) {
            if (typeof links[i].ref !== "undefined")
                await firebase.storage().ref(uid + '/' + links[i].name).delete();
            await firebase.database().ref(uid + '/Links/' + links[i].name).remove();
        }
        await firebase.database().ref(uid + '/Tabs/' + tab).remove();
    }
}

let database = new Database;
export {database};