/* ============================================================
   firebase.js  —  Firebase Initialization
   Initializes the Firebase app and exports the auth instance.
   Config is connected to project: fitnessgoaltracker-wdd330
   ============================================================ */

const firebaseConfig = {
  apiKey:            "AIzaSyCxJuwYfcMu3BHkSdSD9JPjl9kQVyMWO08",
  authDomain:        "fitnessgoaltracker-wdd330.firebaseapp.com",
  projectId:         "fitnessgoaltracker-wdd330",
  storageBucket:     "fitnessgoaltracker-wdd330.firebasestorage.app",
  messagingSenderId: "379216086602",
  appId:             "1:379216086602:web:c523ab48f257bc172b08b3",
  measurementId:     "G-567SMEYPTC"
};

// ── Initialize Firebase ───────────────────────────────────────
firebase.initializeApp(firebaseConfig);

// ── Auth instance — used by auth.js ──────────────────────────
const auth = firebase.auth();

// ── db is reserved for Firestore (Phase 3) ───────────────────
// const db = firebase.firestore();  ← uncomment when Firestore is added
