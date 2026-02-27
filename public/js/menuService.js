import { db } from "./firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function getMenuByDate(date) {
  const menuRef = doc(db, "menus", date);
  const snap = await getDoc(menuRef);

  if (!snap.exists()) return null;

  return snap.data();
}

export async function saveMenu(date, menuData) {
  const menuRef = doc(db, "menus", date);
  await setDoc(menuRef, menuData);
}