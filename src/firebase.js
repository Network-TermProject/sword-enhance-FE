// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
//
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
//
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5N75C8jGBYQIdndkQkFpqzpFtO1hZsIk",
  authDomain: "leets-enhance-react.firebaseapp.com",
  projectId: "leets-enhance-react",
  storageBucket: "leets-enhance-react.appspot.com",
  messagingSenderId: "848660367102",
  appId: "1:848660367102:web:f91175e4429ef95cac47af",
  measurementId: "G-4GGHQHSQP5"
  };
//
// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
//
export { firebaseAuth , createUserWithEmailAndPassword, signInWithEmailAndPassword, fetchSignInMethodsForEmail };