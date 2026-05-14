import { collection, getDocs, addDoc, deleteDoc, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// --- РОБОТА З РОДИЧАМИ ---
const relativesCollectionRef = collection(db, "relatives");

export const getRelatives = async () => {
  try {
    const data = await getDocs(relativesCollectionRef);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    console.error("Помилка отримання даних:", error);
    return [];
  }
};

export const saveRelative = async (newPerson) => {
  try {
    const docRef = await addDoc(relativesCollectionRef, newPerson);
    return { ...newPerson, id: docRef.id };
  } catch (error) {
    console.error("Помилка збереження:", error);
  }
};

export const deleteRelativeFromDB = async (id) => {
  try {
    const personDoc = doc(db, "relatives", id);
    await deleteDoc(personDoc);
  } catch (error) {
    console.error("Помилка видалення:", error);
  }
};

export const updateRelativeInDB = async (updatedPerson) => {
  try {
    const personDoc = doc(db, "relatives", updatedPerson.id);
    await updateDoc(personDoc, updatedPerson);
    return true;
  } catch (error) {
    console.error("Помилка оновлення:", error);
    return false;
  }
};

// --- РОБОТА З ПРОФІЛЕМ ---
const profileDocRef = doc(db, "users", "main_profile");

export const getProfileData = async () => {
  try {
    const docSnap = await getDoc(profileDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Помилка отримання профілю:", error);
    return null;
  }
};

export const saveProfileData = async (profileData) => {
  try {
    await setDoc(profileDocRef, profileData);
    return true;
  } catch (error) {
    console.error("Помилка збереження профілю:", error);
    return false;
  }
};