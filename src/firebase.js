import firebase from "firebase";

// const firebaseConfig = {
//   apiKey: "AIzaSyBZBuFgpEuupoWoDnpXgmz6jPvGl5G_GUc",
//   authDomain: "i-messenger-app.firebaseapp.com",
//   databaseURL: "https://i-messenger-app.firebaseio.com",
//   projectId: "i-messenger-app",
//   storageBucket: "i-messenger-app.appspot.com",
//   messagingSenderId: "439911730516",
//   appId: "1:439911730516:web:c2bf17b3640ed870e54cc1",
//   measurementId: "G-8MEJ2HFJ4Z",
// };

// HERE GOES YOUR FIREBASE CONFIG

const firebaseConfig = {};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export default db;

export { provider, auth };
