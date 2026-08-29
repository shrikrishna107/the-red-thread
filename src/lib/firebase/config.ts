import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForTelltale49052",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "the-red-thread-49052",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "the-red-thread-49052.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://the-red-thread-49052-default-rtdb.firebaseio.com",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "the-red-thread-49052.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "354137028996",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:354137028996:web:011bd6aa8bdde9ae5085d1",
};

let app: FirebaseApp;
let auth: Auth;
let rtdb: Database;
const googleProvider = new GoogleAuthProvider();

if (typeof window !== "undefined") {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  rtdb = getDatabase(app);
} else {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  try {
    auth = getAuth(app);
  } catch {
    auth = {} as any;
  }
  try {
    rtdb = getDatabase(app);
  } catch {
    rtdb = {} as any;
  }
}

export { app, auth, rtdb, googleProvider };
