import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAj-AhfnV1GjO98QSLq7_HPiqyDFkR5QII",
  authDomain: "restauration19-fde4f.firebaseapp.com",
  projectId: "restauration19-fde4f",
  storageBucket: "restauration19-fde4f.firebasestorage.app",
  messagingSenderId: "336495120102",
  appId: "1:336495120102:web:ac256fea086ec22ba8f527",
  measurementId: "G-HELKMYM75D"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
