// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP4xpczuzC39RzbQDfQm8U8RpkFpEm-Ok",
  authDomain: "agedcaremealorderingv2.firebaseapp.com",
  projectId: "agedcaremealorderingv2",
  storageBucket: "agedcaremealorderingv2.firebasestorage.app",
  messagingSenderId: "845390728197",
  appId: "1:845390728197:web:2d6fc85aba13fdce4e206c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// ✅ Handle BOTH localhost and 127.0.0.1
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  console.log("🔥 Connecting to Firestore Emulator...");
  db.settings({
    host: "127.0.0.1:8080",
    ssl: false
  });
} else {
  console.log("🌍 Connected to Production Firestore");
}

window.db = db;