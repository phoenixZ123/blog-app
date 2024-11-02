
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQG-xV9cPpBD2IsfoWWxos-eRIhXvv19E",
  authDomain: "blog-app-96789.firebaseapp.com",
  projectId: "blog-app-96789",
  storageBucket: "blog-app-96789.appspot.com",
  messagingSenderId: "699604226471",
  appId: "1:699604226471:web:eb7f41a21b8fdc8f46e682",
  measurementId: "G-CZCJJBG14W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let db=getFirestore(app);

export {db};