import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBCsY6GppEnejZN3veuTg3rwVYVNKcKrOI",
  authDomain: "spotshare-610df.firebaseapp.com",
  projectId: "spotshare-610df",
  storageBucket: "spotshare-610df.appspot.com",
  messagingSenderId: "936815173405",
  appId: "1:936815173405:web:a02b00a59d0819d1518bf4",
  measurementId: "G-B4QWSST6PX",
  debug_mode: true,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics };
