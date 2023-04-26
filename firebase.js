import {initializeApp} from 'firebase/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {initializeFirestore} from 'firebase/firestore';

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

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = initializeFirestore(initializeApp(firebaseConfig), {
  experimentalForceLongPolling: true,
});
export {firebase, db, auth};
