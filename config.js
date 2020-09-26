import firebase from 'firebase';
require ('@firebase/firestore')
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyAkRP-aeZT58Dyx7lyPTHdOUqS3sJVYc5o",
    authDomain: "wili-18ba3.firebaseapp.com",
    databaseURL: "https://wili-18ba3.firebaseio.com",
    projectId: "wili-18ba3",
    storageBucket: "wili-18ba3.appspot.com",
    messagingSenderId: "320513901844",
    appId: "1:320513901844:web:d3baffaa93b85a934dee01"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase.firestore();