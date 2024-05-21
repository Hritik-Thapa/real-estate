// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  authDomain: "estatehub-ac451.firebaseapp.com",
  projectId: "estatehub-ac451",
  storageBucket: "estatehub-ac451.appspot.com",
  messagingSenderId: "529154911076",
  appId: "1:529154911076:web:f64c72b34d72663d532871",
  measurementId: "G-1GB2J019JG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
