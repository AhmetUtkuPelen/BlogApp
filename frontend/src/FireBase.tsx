// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "e-commerce-863b7.firebaseapp.com",
  databaseURL: "https://e-commerce-863b7-default-rtdb.firebaseio.com",
  projectId: "e-commerce-863b7",
  storageBucket: "e-commerce-863b7.appspot.com",
  messagingSenderId: "1084102747537",
  appId: "1:1084102747537:web:f2a811d85e5b450bd9e630"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);