import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCd6bMCq72sHeUgxal-CpBoOlTcN8jT_Kk",
  authDomain: "find-pet-14cfe.firebaseapp.com",
  databaseURL:
    "https://find-pet-14cfe-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "find-pet-14cfe",
  storageBucket: "find-pet-14cfe.appspot.com",
  messagingSenderId: "1049917742608",
  appId: "1:1049917742608:web:6f188738eb971da78cb495",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
