// src/services/menuService.js

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function getMenuByDate(dateString) {
  try {
    const lunchRef = doc(db, "menus", dateString, "meals", "Lunch");
    const dinnerRef = doc(db, "menus", dateString, "meals", "Dinner");

    const lunchSnap = await getDoc(lunchRef);
    const dinnerSnap = await getDoc(dinnerRef);

    return {
      lunch: lunchSnap.exists() ? lunchSnap.data() : null,
      dinner: dinnerSnap.exists() ? dinnerSnap.data() : null,
    };
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
}