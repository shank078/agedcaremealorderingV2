// menuService.js

// We use global firebase (CDN compat version)
const db = firebase.firestore();

export async function getMenuByDate(date) {

  const snap = await db.collection("menus").doc(date).get();

  if (!snap.exists) return null;

  return snap.data();
}

export async function saveMenu(date, menuData) {

  await db.collection("menus").doc(date).set(menuData);
}