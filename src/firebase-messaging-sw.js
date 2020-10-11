// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.16.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyBACirC-oZMsl8AXSL2YkQ5jmjbcrq34MU",
    authDomain: "openpeo-dev.firebaseapp.com",
    databaseURL: "https://openpeo-dev.firebaseio.com",
    projectId: "openpeo-dev",
    storageBucket: "openpeo-dev.appspot.com",
    messagingSenderId: "343674155373",
    appId: "1:343674155373:web:d032c0d1ca7ba15dda6a64",
    measurementId: "G-FN3EXTZMKQ"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = (firebase.messaging.isSupported() ? firebase.messaging() : null);
