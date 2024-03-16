import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBeq8wI9t4U4-FyJ5Z3Gr1IUrRw2yFDFYM',
  authDomain: 'todos-afc6e.firebaseapp.com',
  projectId: 'todos-afc6e',
  storageBucket: 'todos-afc6e.appspot.com',
  messagingSenderId: '838528568799',
  appId: '1:838528568799:web:120831aee039361da8c86a',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const SignOutUser = async () => await signOut(auth);
