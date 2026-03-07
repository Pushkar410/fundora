import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaaq7e8Ndw_kXwsT4QnmSskMcw_IPn6Pc",
  authDomain: "fundora-3e4a6.firebaseapp.com",
  projectId: "fundora-3e4a6",
  storageBucket: "fundora-3e4a6.firebasestorage.app",
  messagingSenderId: "433503412306",
  appId: "1:433503412306:web:4549f55924ac5357bf3f8b"
};

const app = initializeApp(firebaseConfig);

// THIS LINE IS IMPORTANT
export const db = getFirestore(app);