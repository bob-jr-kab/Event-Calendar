import { auth } from "../config/firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

const db = getFirestore();

// Signup function that includes username
export const signup = async (email, password, username) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // Update the display name in Firebase Auth
  await updateProfile(user, { displayName: username });

  // Save username in Firestore under a users collection
  await setDoc(doc(db, "users", user.uid), {
    username,
    email,
  });

  return userCredential;
};

// Login function
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout function
export const logout = () => {
  return signOut(auth);
};
