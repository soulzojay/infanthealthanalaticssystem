// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_8o5oClucqlPNkULa9X0SHa9Pmu09ioY",
  authDomain: "test-main-jtrial1.firebaseapp.com",
  projectId: "test-main-jtrial1",
  storageBucket: "test-main-jtrial1.appspot.com",
  messagingSenderId: "104134444111",
  appId: "1:104134444111:web:6b41470a8c9660690bd63a",
  measurementId: "G-XLKWBYGLM4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

import {
  getDatabase,
  ref,
  set,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";

document.getElementById("submitreg").addEventListener("click", function (e) {
  set(ref(db, "user/" + document.getElementById("inSerial").value), {
    inSerial: document.getElementById("inSerial").value,
    inRegNum: document.getElementById("inRegNum").value,
    inHospName: document.getElementById("inRegNum").value,
    inDoFirst: document.getElementById("inDoFirst").value,
    inBirRegNum: document.getElementById("inBirRegNum").value,
    inChildName: document.getElementById("inChildName").value,
    inDoBirth: document.getElementById("inDoBirth").value,
    inAgeoBirth: document.getElementById("inAgeoBirth").value,
    inBirWeight: document.getElementById("inBirWeight").value,
    inBirHeight: document.getElementById("inBirHeight").value,
    inHeadCirc: document.getElementById("inHeadCirc").value,
    inRadMale: document.getElementById("inRadMale").value,
    inRadFemale: document.getElementById("inRadFemale").value,
    inRadNone: document.getElementById("inRadNone").value,
    floatSickleCell: document.getElementById("floatSickleCell").value,
    floatG6pd: document.getElementById("floatG6pd").value,
    inNhisNum: document.getElementById("inNhisNum").value,
  });
  alert("Registration Successfull !!!");
});
