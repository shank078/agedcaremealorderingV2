// src/services/menuService.js

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function getMenuByDate(dateString) {
  try {
    const menuRef = doc(db, "menus", dateString);
    const menuSnap = await getDoc(menuRef);

    if (!menuSnap.exists()) {
      return null;
    }

    return menuSnap.data(); // contains { lunch, dinner }
    
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
}