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
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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
