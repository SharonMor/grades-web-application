import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9HrPKGj_Nk9dVzOSmthmkBRK0zDt22Tk",
  authDomain: "grades-app-c415d.firebaseapp.com",
  projectId: "grades-app-c415d",
  storageBucket: "grades-app-c415d.appspot.com",
  messagingSenderId: "935765386245",
  appId: "1:935765386245:web:c84908d3174523e1f1e86c",
  measurementId: "G-43CS06N4K7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
