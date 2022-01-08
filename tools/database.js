import { firebase } from '../tools/config.js'
import { suggestions } from "../tools/suggestions.js"
import 'firebase/storage'

class Database {

    async imageUploads() {
        var gifs = ['REBEL8', 'PALACE', 'Lexus', 'JUNGLES', 'Hack The Box'];
        var allThemes = ['Japan Animation', 'Hills', 'Japan', 'Mountains', 'Bridge', 'Cityscape', 'Dark Forest', 'Dusk', 'Fence', 'Flares', 'Gas Station', 'Lake', 'Orange Tree', 'Ski Rink', 'Snow', 'Tunnel', 'Underwater', 'Wave'];
        var pngthemes = ['Hills', 'Japan', 'Mountains'];
        var count = 0;
        for (var i = 0; i < suggestions.length; i++) {
            await firebase.storage().ref('default/Logos/' + suggestions[i].name + (gifs.includes(suggestions[i].name) ? '.gif' : '.webp')).getDownloadURL().then((res) => {
                firebase.database().ref("default/Suggestions/" + suggestions[i].name).set({
                    name: suggestions[i].name,
                    url: suggestions[i].url,
                    image: res
                });
            })
            console.log(++count)
        }
         for (var j = 0; j < allThemes.length; j++) {
            await firebase.storage().ref('default/Themes/' + allThemes[j] + (j === 0 ? '.gif' : pngthemes.includes(allThemes[j]) ? '.png' : '.jpg')).getDownloadURL().then((res) => {
                firebase.database().ref("default/Themes/" + allThemes[j]).set({
                    name: allThemes[j],
                    image: res
                });
            })
            console.log(++count)
        }
    }

    async getPreferences(user, defaults) {
        var preferences = [];
        await firebase.database().ref(user + '/Preferences').once('value').then(async function (snapshot) {
            if (snapshot.exists()) {
                preferences.push({
                    addLink: snapshot.val()["addLink"],
                    addTab: snapshot.val()["addTab"],
                    buttonsColor: snapshot.val()["buttonsColor"],
                    editBtn: snapshot.val()["editBtn"],
                    gridWidth: snapshot.val()["gridWidth"],
                    gridHeight: snapshot.val()["gridHeight"],
                    imageShadowColor: snapshot.val()["imageShadowColor"],
                    imageShadowSize: snapshot.val()["imageShadowSize"],
                    linkImageSize: snapshot.val()["linkImageSize"],
                    linkShadowColor: snapshot.val()["linkShadowColor"],
                    linkShadowSize: snapshot.val()["linkShadowSize"],
                    linkText: snapshot.val()["linkText"],
                    linkTextColor: snapshot.val()["linkTextColor"],
                    linkTextSize: snapshot.val()["linkTextSize"],
                    night: snapshot.val()["night"],
                    removeBtn: snapshot.val()["removeBtn"],
                    tabArrows: snapshot.val()["tabArrows"],
                    tabShadowSize: snapshot.val()["tabShadowSize"],
                    tabTextShadowColor: snapshot.val()["tabTextShadowColor"],
                    theme: snapshot.val()["theme"],
                })
            } else {
                preferences.push({
                    addLink: false,
                    addTab: false,
                    buttonsColor: false,
                    editBtn: false,
                    gridWidth: 20,
                    gridHeight: 20,
                    imageShadowColor: false,
                    imageShadowSize: 20,
                    linkImageSize: 50,
                    linkShadowColor: false,
                    linkShadowSize: 35,
                    linkText: false,
                    linkTextColor: false,
                    linkTextSize: 50,
                    night: false,
                    removeBtn: false,
                    tabArrows: false,
                    tabShadowSize: 1,
                    tabTextShadowColor: false,
                    theme: false,
                })
                if (user !== "default")
                    firebase.database().ref(user + '/Preferences').set(preferences[0]);
            }
        })
        for (var key in preferences[0])
            if (!preferences[0][key])
                preferences[0][key] = defaults[key];
        return preferences[0];
    }

    async setPreferences(upload, preferences, oldPreferences, user) {
        var newPref = JSON.parse(JSON.stringify(preferences));
        if (upload) {
            await firebase.storage().ref(user + "/ThemeUltafedIgm").put(upload);
            firebase.storage().ref(user + "/ThemeUltafedIgm").getDownloadURL().then((res) => {
                newPref.theme = res;
                firebase.database().ref(user + "/Preferences").set(newPref);
            })
        } else {
            if ((!preferences.theme || !preferences.theme.includes("ThemeUltafedIgm")) && oldPreferences.theme && oldPreferences.theme.includes("ThemeUltafedIgm"))
                firebase.storage().ref(user + "/ThemeUltafedIgm").delete().catch((err) => {
                    // File does not exist
                })
            firebase.database().ref(user + "/Preferences").set(newPref);
        }
    }

    async getSuggestions() {
        var suggestions = [];
        await firebase.database().ref('default/Suggestions').once('value').then(async function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                suggestions.push({
                    name: childSnapshot.val()["name"],
                    url: childSnapshot.val()["url"],
                    image: childSnapshot.val()["image"],
                })
            })
        })
        return suggestions;
    }

    async getThemes() {
        var themes = [];
        await firebase.database().ref('default/Themes').once('value').then(async function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                themes.push({
                    name: childSnapshot.val()["name"],
                    image: childSnapshot.val()["image"],
                })
            })
        })
        return themes;
    }

    async getTabs(user) {
        var tabs = [];
        await firebase.database().ref(user + '/Tabs').orderByChild("pos").once('value').then(async function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
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
        await firebase.database().ref(user).once('value', function (snapshot) {
            if (snapshot.hasChild('Links')) {
                isEmpty = false;
            }
        })
        var links = [];
        if (!isEmpty) {
            await firebase.database().ref(user + '/Links').orderByChild("pos").once('value').then(async function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    links.push({
                        name: childSnapshot.val()["name"],
                        link: childSnapshot.val()["link"],
                        image: childSnapshot.val()["image"],
                        tab: childSnapshot.val()["tab"],
                        pos: childSnapshot.val()["pos"],
                        clicks: childSnapshot.val()["clicks"],
                        time: childSnapshot.val()["time"]
                    })
                })
            })
        }
        return links;
    }

    async getTrendingLinks() {
        var links = [];
        await firebase.database().ref('default/Trending').orderByChild("pos").once('value').then(async function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                links.push({
                    name: childSnapshot.val()["name"],
                    link: childSnapshot.val()["link"],
                    image: childSnapshot.val()["image"],
                    pos: childSnapshot.val()["pos"],
                })
            })
        })
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

        result = links.filter(function (a) { return a.dist < distance });
        links.sort(function (a, b) {
            return a.dist - b.dist
        })
        return result;
    }

    editDistance(str1, str2) {
        var T = Array(str1.length + 1).fill(0).map(x => Array(str1.length + 1).fill(0));

        for (var i = 0; i <= str1.length; i++) {
            T[0][i] = i;
        }

        for (i = 0; i <= str1.length; i++) {
            T[i][0] = i;
        }

        var m = str1.length;
        var n = str1.length;
        for (i = 1; i <= m; i++) {
            for (var j = 1; j <= n; j++) {
                if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
                    T[i][j] = T[i - 1][j - 1];
                } else {
                    T[i][j] = 1 + Math.min(T[i][j - 1], Math.min(T[i - 1][j], T[i - 1][j - 1]));
                }
            }
        }

        return T[str1.length][str1.length] / str1.length;
    }

    async addTab(tab, uid) {
        firebase.database().ref(uid + '/Tabs' + '/' + tab.name).set(tab);
    }

    async addLinks(links, uid) {
        for (var i = 0; i < links.length; i++) {
            links[i].clicks = 0;
            firebase.database().ref(uid + '/Links/' + links[i].name).set(links[i]);
        }
    }

    async editLink(link, uid, currLink) {
        this.eraseLinks(uid, [{ name: currLink.name, image: currLink.image}]);
        if (typeof link.image === "object") {
            await firebase.storage().ref(uid).child(link.name).put(link.image);
            await firebase.storage().ref(uid).child(link.name).getDownloadURL().then((res) => { link.image = res })
        }
        this.addLinks([link], uid)
    }

    async editTab(tab, uid, currTab) {
        firebase.database().ref(uid + '/Links').orderByChild("tab").equalTo(currTab).once('value').then(async function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                childSnapshot.ref.update({ tab: tab.name })
            })
        })
        firebase.database().ref(uid + '/Tabs/' + currTab).remove();
        this.addTab(tab, uid)
    }

    async eraseLinks(uid, links) {
        for (var i = 0; i < links.length; i++) {
            if (links[i].image.includes(uid))
                await firebase.storage().ref(uid + "/" + links[i].name).delete().catch((err) => {
                    // File does not exist
            })
            firebase.database().ref(uid + '/Links/' + links[i].name).remove();
        }
    }

    async eraseTab(uid, tab) {
        var links = [];
        firebase.database().ref(uid + '/Links').orderByChild("tab").equalTo(tab).once('value').then(async function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                links.push({
                    name: childSnapshot.val()["name"],
                    image: childSnapshot.val()["image"]
                })
            })
        })
        for (var i = 0; i < links.length; i++) {
            if (links[i].image.includes(uid))
                firebase.storage().ref(uid + '/' + links[i].name).delete();
            firebase.database().ref(uid + '/Links/' + links[i].name).remove();
        }
        firebase.database().ref(uid + '/Tabs/' + tab).remove();
    }
}

let database = new Database;
export { database };