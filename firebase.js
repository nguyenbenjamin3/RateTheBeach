// Import the functions you need from the SDKs you need
import * as firebase from 'firebase';
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDY5w7nXRCgkhdhs3qhfAjo0_M6rFFfHXc',
  authDomain: 'ratethebeach.firebaseapp.com',
  projectId: 'ratethebeach',
  storageBucket: 'ratethebeach.appspot.com',
  messagingSenderId: '970988779902',
  appId: '1:970988779902:web:4d16ae15f7c2596596db2f',
  measurementId: 'G-TNS01HW797',
};

// Initialize Firebase
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();
const db = firebase.firestore();

export {auth, db};
