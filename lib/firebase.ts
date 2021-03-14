import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBgUkAPvTckpXg_KiS-NVUBGx73PxgUKkI',
  authDomain: 'next-social-media-app.firebaseapp.com',
  projectId: 'next-social-media-app',
  storageBucket: 'next-social-media-app.appspot.com',
  messagingSenderId: '106791911488',
  appId: '1:106791911488:web:26aeab2949155b537cdfa5',
  measurementId: 'G-K6BM8J4RJB',
};

if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
