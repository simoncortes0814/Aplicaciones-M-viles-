import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Tu configuración de Firebase aquí
const firebaseConfig = {
  apiKey: "AIzaSyCX_OGGiJIZrqu2PrXVUV3nkQipJciySK0",
  authDomain: "timeswap-8e34d.firebaseapp.com",
  projectId: "timeswap-8e34d",
  storageBucket: "timeswap-8e34d.firebasestorage.app",
  messagingSenderId: "902040578317",
  appId: "1:902040578317:web:7d8dd7e8a53dadd0a96844",
  measurementId: "G-B1DBB8WVZD"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar las instancias que necesitaremos
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); 