// menuService.js

const db = firebase.firestore();

// 🔥 GET MENU FOR DATE + MEAL TYPE
export async function getMenuByDate(date, mealType) {

  const snap = await db
    .collection("menus")
    .doc(date)
    .collection("meals")
    .doc(mealType)
    .get();

  if (!snap.exists) return null;

  return snap.data();
}

// 🔥 SAVE MENU FOR DATE + MEAL TYPE
export async function saveMenu(date, mealType, menuData) {

  await db
    .collection("menus")
    .doc(date)
    .collection("meals")
    .doc(mealType)
    .set(menuData);
}