// firebaseEvents.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../config/firebaseConfig";

// Function to add a new event linked to the user
export const addEvent = async (event) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const eventWithUID = { ...event, uid: user.uid }; // Add user UID to event
      const docRef = await addDoc(collection(db, "events"), eventWithUID);
      return { id: docRef.id, ...eventWithUID };
    }
  } catch (error) {
    console.error("Error adding event: ", error);
  }
};

// Function to fetch only events for the logged-in user
export const fetchEvents = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("uid", "==", user.uid)); // Filter by logged-in user's UID
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
  } catch (error) {
    console.error("Error fetching events: ", error);
    return [];
  }
};

// Function to delete an event
export const deleteEvent = async (eventId) => {
  await deleteDoc(doc(db, "events", eventId));
};

// Function to update an event
export const updateEvent = async (eventId, updatedEvent) => {
  const eventRef = doc(db, "events", eventId);
  await updateDoc(eventRef, updatedEvent);
};
