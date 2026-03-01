import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export async function seedMenus() {
  try {
    const todayDate = new Date();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(todayDate.getDate() + 1);

    const dates = [formatDate(todayDate), formatDate(tomorrowDate)];

    for (const date of dates) {
      // Lunch
      await setDoc(doc(db, "menus", date, "meals", "Lunch"), {
        m1: "Beef Lasagne",
        m2: "Grilled Chicken",
        v1: "Green Beans",
        v2: "Carrots",
        d1: "Rice Pudding",
        d2: "Fruit Salad",
        d3: "Ice Cream",
        c1: "Mashed Potatoes",
      });

      // Dinner
      await setDoc(doc(db, "menus", date, "meals", "Dinner"), {
        m1: "Baked Fish",
        m2: "Vegetable Stir Fry",
        v1: "Broccoli",
        v2: "Corn",
        d1: "Custard",
        d2: "Sponge Cake",
        d3: "Jelly",
        c1: "Steamed Rice",
      });
    }

    console.log("✅ Today & Tomorrow menus seeded.");
  } catch (error) {
    console.error("❌ Menu seeding failed:", error);
  }
}