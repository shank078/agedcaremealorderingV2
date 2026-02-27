import { db } from "./firebase.js";
import { doc, setDoc } from "firebase/firestore";

const saveBtn = document.getElementById("saveMenuBtn");
const statusMessage = document.getElementById("statusMessage");

saveBtn.addEventListener("click", async () => {

    const date = document.getElementById("menuDate").value;

    const m1 = document.getElementById("m1Input").value.trim();
    const m2 = document.getElementById("m2Input").value.trim();
    const c1 = document.getElementById("c1Input").value.trim();
    const v1 = document.getElementById("v1Input").value.trim();
    const v2 = document.getElementById("v2Input").value.trim();
    const d1 = document.getElementById("d1Input").value.trim();
    const d2 = document.getElementById("d2Input").value.trim();
    const d3 = document.getElementById("d3Input").value.trim();

    if (!date || !m1 || !m2 || !c1) {
        statusMessage.textContent = "⚠ Date, m1, m2 and c1 are required.";
        statusMessage.style.color = "red";
        return;
    }

    try {
        await setDoc(doc(db, "menus", date), {
            m1,
            m2,
            c1,
            v1,
            v2,
            d1,
            d2,
            d3
        });

        statusMessage.textContent = "✅ Menu saved successfully.";
        statusMessage.style.color = "green";

    } catch (error) {
        console.error(error);
        statusMessage.textContent = "❌ Error saving menu.";
        statusMessage.style.color = "red";
    }
});