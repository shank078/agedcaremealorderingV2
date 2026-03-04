import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/* =========================
   Local Date Formatter
   (No UTC conversion)
========================= */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* =========================
   Dummy Rotating Menu Data
========================= */

const lunchMains = [
  ["Beef Lasagne", "Grilled Chicken"],
  ["Roast Pork", "Vegetable Quiche"],
  ["Lamb Cutlets", "Pumpkin Risotto"],
  ["Chicken Schnitzel", "Vegetable Pasta"],
  ["Beef Stroganoff", "Spinach Cannelloni"],
];

const dinnerMains = [
  ["Baked Fish", "Vegetable Stir Fry"],
  ["Roast Chicken", "Mushroom Pie"],
  ["Beef Casserole", "Vegetable Curry"],
  ["Grilled Salmon", "Mac & Cheese"],
  ["Turkey Roast", "Stuffed Capsicum"],
];

const vegetablesList = [
  ["Green Beans", "Carrots"],
  ["Broccoli", "Corn"],
  ["Peas", "Cauliflower"],
  ["Zucchini", "Pumpkin"],
  ["Mixed Vegetables", "Brussels Sprouts"],
];

const dessertsList = [
  ["Rice Pudding", "Fruit Salad", "Ice Cream"],
  ["Custard", "Sponge Cake", "Jelly"],
  ["Chocolate Mousse", "Apple Pie", "Ice Cream"],
  ["Bread & Butter Pudding", "Fruit Cup", "Custard"],
  ["Cheesecake", "Jelly", "Ice Cream"],
];

const carbsList = [
  "Mashed Potatoes",
  "Steamed Rice",
  "Roast Potatoes",
  "Pasta",
  "Boiled Potatoes",
];

/* =========================
   Seed Menus (03 Mar → 13 Mar 2026)
========================= */

export async function seedMenus() {
  try {
    const startDate = new Date(2026, 2, 3); // March = month index 2
    const endDate = new Date(2026, 2, 13);

    let index = 0;

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateString = formatDate(d);

      // Rotate menu data
      const lunchMainPair = lunchMains[index % lunchMains.length];
      const dinnerMainPair = dinnerMains[index % dinnerMains.length];
      const vegPair = vegetablesList[index % vegetablesList.length];
      const dessertTriple = dessertsList[index % dessertsList.length];
      const carb = carbsList[index % carbsList.length];

/* =========================
   Save Full Day Menu (1 Document Instead of 2)
========================= */

await setDoc(doc(db, "menus", dateString), {
  lunch: {
    mains: [
      { id: "m1", name: lunchMainPair[0] },
      { id: "m2", name: lunchMainPair[1] },
    ],
    vegetables: [
      { id: "v1", name: vegPair[0] },
      { id: "v2", name: vegPair[1] },
    ],
    desserts: [
      { id: "d1", name: dessertTriple[0] },
      { id: "d2", name: dessertTriple[1] },
      { id: "d3", name: dessertTriple[2] },
    ],
    carb: carb,
  },

  dinner: {
    mains: [
      { id: "m1", name: dinnerMainPair[0] },
      { id: "m2", name: dinnerMainPair[1] },
    ],
    vegetables: [
      { id: "v1", name: vegPair[0] },
      { id: "v2", name: vegPair[1] },
    ],
    desserts: [
      { id: "d1", name: dessertTriple[0] },
      { id: "d2", name: dessertTriple[1] },
      { id: "d3", name: dessertTriple[2] },
    ],
    carb: carb,
  }
});

      index++;
    }

    console.log("✅ Menus seeded from 03 Mar 2026 to 13 Mar 2026.");

  } catch (error) {
    console.error("❌ Menu seeding failed:", error);
  }
}