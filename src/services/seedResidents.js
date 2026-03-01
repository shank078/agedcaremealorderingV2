// src/services/seedResidents.js

import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function seedResidents() {
  try {
    for (let room = 101; room <= 150; room++) {
      const mrn = `MRN${room}`;

      await setDoc(doc(db, "residents", mrn), {
        firstName: `Resident`,
        lastName: `${room}`,
        roomNumber: String(room),
        active: true,
      });

      console.log(`✅ Created resident for room ${room}`);
    }

    console.log("🎉 50 Residents Seeded Successfully!");
  } catch (error) {
    console.error("❌ Error seeding residents:", error);
  }
}