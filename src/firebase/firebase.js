import * as firebase from "firebase";

const config = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: "expense-manager-75e98.firebaseapp.com",
  databaseURL: "https://expense-manager-75e98-default-rtdb.firebaseio.com",
  projectId: "expense-manager-75e98",
  storageBucket: "expense-manager-75e98.appspot.com",
  messagingSenderId: "993648806106",
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();
const auth = firebase.auth();

export { auth, db };
