import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiYtgLqPmjVJOF95lyXKT6nWux6kS0EiQ",
  authDomain: "friendsmedia-40beb.firebaseapp.com",
  projectId: "friendsmedia-40beb",
  storageBucket: "friendsmedia-40beb.appspot.com",
  messagingSenderId: "158464781877",
  appId: "1:158464781877:web:06fcd0cd8a0356caba4b7c",
  measurementId: "G-Y8SDM60C20"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage();
export const db = getFirestore()