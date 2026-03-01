// src/services/seedResidents.js

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function seedResidents() {
  try {
    for (let i = 1; i <= 25; i++) {
      const mrn = `MRN${1000 + i}`;
      const roomNumber = (100 + i).toString();

      await setDoc(doc(db, "residents", mrn), {
        name: `Resident ${i}`,
        roomNumber: roomNumber,
        active: true,
      });
    }

    console.log("✅ 25 residents seeded successfully.");
  } catch (error) {
    console.error("❌ Error seeding residents:", error);
  }
}