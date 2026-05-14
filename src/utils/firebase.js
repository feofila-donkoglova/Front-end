import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDovCN9GpUl8WfTbowVGRO_o7prekbDZFU",
  authDomain: "family-tree-app-ac104.firebaseapp.com",
  projectId: "family-tree-app-ac104",
  storageBucket: "family-tree-app-ac104.firebasestorage.app",
  messagingSenderId: "738759083625",
  appId: "1:738759083625:web:3a72c9d38afc43a55184f8"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізація Firestore (бази даних)
export const db = getFirestore(app);