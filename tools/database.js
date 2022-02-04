import { firebase } from '../tools/config.js'
import 'firebase/storage'

class Database {

    async getPreferences(user, defaults) {
        var preferences = [];
        await firebase.database().ref(user + '/Preferences').once('value').then(async function (snapshot) {
            if (snapshot.exists()) {
                preferences = snapshot.toJSON();
            } else {
                preferences = defaults;
                firebase.database().ref(user + '/Preferences').set(defaults);
            }
        })
        return preferences;
    }

    async getDefaultPreferences() {
        var preferences = [];
        await firebase.database().ref('default/Preferences').once('value').then(async function (snapshot) {
            preferences = snapshot.toJSON();
        })
        return preferences;
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
                suggestions.push(childSnapshot.toJSON())
            })
        })
        return suggestions;
    }

    async getThemes() {
        var themes = [];
        await firebase.database().ref('default/Themes').once('value').then(async function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                themes.push(childSnapshot.toJSON())
            })
        })
        return themes;
    }

    async getTabs(user) {
        var tabs = [];
        await firebase.database().ref(user + '/Tabs').orderByChild("pos").once('value').then(async function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                tabs.push(childSnapshot.toJSON())
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
                    links.push(childSnapshot.toJSON())
                })
            })
        }
        return links;
    }

    async getTrendingLinks() {
        var links = [];
        await firebase.database().ref('default/Trending').orderByChild("pos").once('value').then(async function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                links.push(childSnapshot.toJSON())
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
                links.push(childSnapshot.toJSON())
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