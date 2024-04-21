// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    // TODO: Api key env
  apiKey: "AIzaSyDG4-A0WwuqHnK61AqWd1M_UwKCGarLl64",
  authDomain: "chathub-7b0fe.firebaseapp.com",
  projectId: "chathub-7b0fe",
  storageBucket: "chathub-7b0fe.appspot.com",
  messagingSenderId: "107266234535",
  appId: "1:107266234535:web:c93c998422b99200c32382"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()