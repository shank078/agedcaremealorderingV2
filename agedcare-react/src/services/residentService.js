// src/services/residentService.js

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function getActiveResidents() {
  try {
    const snapshot = await getDocs(collection(db, "residents"));
    const residents = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.active) {
        residents.push({
          id: doc.id, // MRN
          ...data,
        });
      }
    });

    // Sort by room number
    residents.sort((a, b) => Number(a.roomNumber) - Number(b.roomNumber));

    return residents;
  } catch (error) {
    console.error("Error fetching residents:", error);
    throw error;
  }
}