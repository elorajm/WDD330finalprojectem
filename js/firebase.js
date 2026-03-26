/* ============================================================
   firebase.js  —  Firebase Initialization
   Initializes the Firebase app and exports the auth instance.

   IMPORTANT: js/firebase-config.js must be loaded BEFORE this
   file in every HTML page that uses Firebase.  That file is
   gitignored and holds the real API key.

   Load order in HTML:
     <script src="js/firebase-config.js"></script>   ← real key, gitignored
     <script src="js/firebase.js"></script>           ← uses FIREBASE_CONFIG
     <script src="js/auth.js"></script>
   ============================================================ */

// Guard: tell the developer if firebase-config.js was not loaded first.
if (typeof FIREBASE_CONFIG === 'undefined') {
  throw new Error(
    '[firebase.js] FIREBASE_CONFIG is not defined. ' +
    'Create js/firebase-config.js from js/firebase-config.example.js ' +
    'and load it before firebase.js in your HTML.'
  );
}

// ── Initialize Firebase ───────────────────────────────────────
firebase.initializeApp(FIREBASE_CONFIG);

// ── Auth instance — used by auth.js ──────────────────────────
const auth = firebase.auth();

// ── db is reserved for Firestore (Phase 3) ───────────────────
// const db = firebase.firestore();  ← uncomment when Firestore is added
