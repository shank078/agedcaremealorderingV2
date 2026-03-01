// src/services/orderService.js

import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function getOrdersByDate(dateString) {
  try {
    const snapshot = await getDocs(
      collection(db, "orders", dateString, "residents")
    );

    const orders = {};

    snapshot.forEach((doc) => {
      orders[doc.id] = doc.data();
    });

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function saveResidentOrder(dateString, mrn, orderData) {
  try {
    await setDoc(
      doc(db, "orders", dateString, "residents", mrn),
      {
        ...orderData,
        lastUpdated: new Date(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
}