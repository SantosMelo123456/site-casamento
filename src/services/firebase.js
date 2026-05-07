import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDvCYHkVTh2tjffZhesqZ5yux5JDdprA80",
  authDomain: "site-casamento-842ed.firebaseapp.com",
  projectId: "site-casamento-842ed",
  storageBucket: "site-casamento-842ed.firebasestorage.app",
  messagingSenderId: "1091352765017",
  appId: "1:1091352765017:web:820bd4461d7f4f6cc38748"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default app;
export { db };
