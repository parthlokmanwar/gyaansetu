// =============================================
// GYAANSETU - Firebase Configuration
// =============================================
// IMPORTANT: Replace these values with your own Firebase project credentials.
// Steps to get your config:
//   1. Go to https://console.firebase.google.com
//   2. Create a new project named "gyaansetu"
//   3. Click the </> (Web) icon to register your app
//   4. Copy the firebaseConfig object below and replace these placeholder values
//   5. In Firebase console → Firestore Database → Create database (start in test mode)
// =============================================

const firebaseConfig = {
  apiKey: "AIzaSyC_SRNWyQ8ee--Rcn1N48Qe0EvzZb2mh_k",
  authDomain: "gyaansetu-65fe5.firebaseapp.com",
  projectId: "gyaansetu-65fe5",
  storageBucket: "gyaansetu-65fe5.firebasestorage.app",
  messagingSenderId: "195251500373",
  appId: "1:195251500373:web:1d98c30a677c5f046d2bdc",
  measurementId: "G-NWYSK9WZ4M"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// =============================================
// Firestore Security Rules (paste in Firebase Console → Firestore → Rules):
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /tutorials/{doc} {
//       allow read: if true;
//       allow write: if true; // Switch to authenticated writes after testing
//     }
//   }
// }
// =============================================
