const firebaseConfig = {
  apiKey: "AIzaSyCP4xpczuzC39RzbQDfQm8U8RpkFpEm-Ok",
  authDomain: "agedcaremealorderingv2.firebaseapp.com",
  projectId: "agedcaremealorderingv2",
  storageBucket: "agedcaremealorderingv2.firebasestorage.app",
  messagingSenderId: "845390728197",
  appId: "1:845390728197:web:2d6fc85aba13fdce4e206c"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();