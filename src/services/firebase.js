import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-ITkEecVL8BKjUAf4lIqg8A3-M85_lPM",
  authDomain: "workout-log-5c16d.firebaseapp.com",
  projectId: "workout-log-5c16d",
  storageBucket: "workout-log-5c16d.firebasestorage.app",
  messagingSenderId: "866302176002",
  appId: "1:866302176002:web:ba20055b519ea3d604301b",
  measurementId: "G-ET8YP4WKLC"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
