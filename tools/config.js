// TODO: Replace the following with your app's Firebase project configuration
var firebaseConfig = {
    apiKey: "AIzaSyB0bPlAZAOugTXVxxcW6MJvEYyupGXmncY",
    authDomain: "tabdat-tvtech.firebaseapp.com",
    databaseURL: "https://tabdat-tvtech.firebaseio.com",
    projectId: "tabdat-tvtech",
    storageBucket: "tabdat-tvtech.appspot.com",
    messagingSenderId: "180852839677",
    appId: "1:180852839677:web:0e4685311f2977c2925a94",
    measurementId: "G-T438HSQ7EK"
};

// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");

export {firebase, firebaseConfig}