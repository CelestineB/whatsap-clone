import firebase from "firebase";
const firebaseConfig = {
  apiKey: "AIzaSyAkDluhTcj1JZHIybtK164Kdy1n0pCxlzs",
  authDomain: "whatsapp-mern-db4f9.firebaseapp.com",
  databaseURL: "https://whatsapp-mern-db4f9.firebaseio.com",
  projectId: "whatsapp-mern-db4f9",
  storageBucket: "whatsapp-mern-db4f9.appspot.com",
  messagingSenderId: "400769874651",
  appId: "1:400769874651:web:292341629a21d00da0aafe",
  measurementId: "G-YNEWGH8FZP",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export { auth, provider };
export default db;
