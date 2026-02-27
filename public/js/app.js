// app.js

window.initializeApp = function () {

    UIController.init();

    const roomInput = document.getElementById("roomNumber");
    const mealDate = document.getElementById("mealDate");
    const notice = document.getElementById("orderNotice");
    const saveBtn = document.querySelector(".save-btn");
    const orderForm = document.getElementById("orderForm");

    const mealButtons = document.querySelectorAll(".meal-btn");
    const todayBtn = document.getElementById("todayBtn");
    const tomorrowBtn = document.getElementById("tomorrowBtn");

    let selectedMeal = "";

    // ===== SHOW MENU WHEN READY =====
    function tryShowMenu() {
        if (mealDate.value && selectedMeal) {
            orderForm.classList.remove("hidden");
        }
    }

    // ===== MEAL TOGGLE =====
    mealButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            mealButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            selectedMeal = btn.dataset.meal;

            tryShowMenu();
        });
    });

    // ===== TODAY / TOMORROW =====
 // ===== TODAY / TOMORROW =====

function setDate(dateObj) {
    const iso = dateObj.toISOString().split("T")[0];
    mealDate.value = iso;
    tryShowMenu();
}

function clearQuickDateActive() {
    todayBtn.classList.remove("active");
    tomorrowBtn.classList.remove("active");
}

todayBtn.addEventListener("click", () => {
    const today = new Date();
    setDate(today);

    clearQuickDateActive();
    todayBtn.classList.add("active");
});

tomorrowBtn.addEventListener("click", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow);

    clearQuickDateActive();
    tomorrowBtn.classList.add("active");
});

// If user manually selects date
mealDate.addEventListener("change", () => {
    clearQuickDateActive();
    tryShowMenu();
});
    // ===== CHECK EXISTING ORDER =====
    async function checkExistingOrder() {

        const room = roomInput.value.trim();
        const date = mealDate.value;
        const type = selectedMeal;

        if (!room || !date || !type) return;

        try {
            const doc = await OrderService.getOrder(date, type, room);

            if (doc.exists) {
                notice.className = "notice warning";
notice.innerText = "⚠ Existing order loaded";
                UIController.populateOrder(doc.data());
            } else {
                notice.innerText = "New order";
                UIController.resetDefaults();
            }

        } catch (error) {
            console.error("Error loading order:", error);
        }
    }

    roomInput.addEventListener("input", checkExistingOrder);

    // ===== SAVE ORDER =====
   // ===== SAVE ORDER =====
saveBtn.addEventListener("click", async function () {

    const room = roomInput.value.trim();
    const date = mealDate.value;
    const type = selectedMeal;

    if (!selectedMeal) {
        alert("Please select Lunch or Dinner.");
        return;
    }

    if (!date) {
        alert("Please select a date.");
        return;
    }

    if (!room) {
        alert("Please enter room number.");
        return;
    }

    const orderData = UIController.getOrderData();

    const noMain = !orderData.main;
    const noVeg = orderData.vegetables.length === 0;
    const noSpecial = !orderData.specialRequest.trim();

    const proceedToSave = async () => {
        try {
            await OrderService.saveOrder(date, type, room, orderData);
            notice.className = "notice success";
            notice.innerText = "✅ Order saved successfully";
        } catch (error) {
            console.error("Error saving order:", error);
        }
    };

    // 🔎 Check for empty order
    if (noMain && noVeg && noSpecial) {
        showEmptyOrderConfirmation(proceedToSave);
    } else {
        proceedToSave();
    }
function showEmptyOrderConfirmation(onConfirm) {

    const modal = document.createElement("div");
    modal.className = "confirm-overlay";

    modal.innerHTML = `
        <div class="confirm-box">
            <h3>Confirm Order</h3>
           <p><strong>No items have been selected for this meal.</strong><br>
        Would you like to save the order as it is?</p>
            <div class="confirm-actions">
                <button class="cancel-btn">Cancel</button>
                <button class="confirm-btn">Yes, Save</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".cancel-btn").onclick = () => {
        document.body.removeChild(modal);
    };

    modal.querySelector(".confirm-btn").onclick = () => {
        document.body.removeChild(modal);
        onConfirm();
    };
}
});

};