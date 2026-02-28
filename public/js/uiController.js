// uiController.js

import { getMenuByDate } from "./menuService.js";

let selectedDate = null;
let selectedMeal = null;

const UIController = {

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.resetDefaults();
    },

    cacheDOM() {
        this.roomInput = document.getElementById("roomNumber");
        this.mealDate = document.getElementById("mealDate");
        this.mealType = document.getElementById("mealType");
        this.notice = document.getElementById("orderNotice");
        this.specialInput = document.getElementById("mainSpecial");
    },

    bindEvents() {

        document.querySelectorAll(".main-btn").forEach(btn => {
            btn.addEventListener("click", () => this.selectMain(btn));
        });

        document.querySelectorAll(".veg-btn").forEach(btn => {
            btn.addEventListener("click", () => btn.classList.toggle("active"));
        });

        document.querySelectorAll(".dessert-btn").forEach(btn => {
            btn.addEventListener("click", () => this.selectDessert(btn));
        });

        // Special request logic
        this.specialInput.addEventListener("input", () => {

            const activeMain = document.querySelector(".main-btn.active");
            const specialHasText = this.specialInput.value.trim() !== "";

            if (specialHasText) {

                if (!activeMain || activeMain.dataset.value === "Salad Plate") {
                    document.querySelectorAll(".veg-btn").forEach(btn =>
                        btn.classList.remove("active")
                    );
                }
            }
        });
    },

    selectMain(button) {

        const isAlreadyActive = button.classList.contains("active");

        document.querySelectorAll(".main-btn").forEach(b =>
            b.classList.remove("active")
        );

        if (!isAlreadyActive) {

            button.classList.add("active");

            if (button.dataset.value === "Salad Plate") {

                document.querySelectorAll(".veg-btn").forEach(btn =>
                    btn.classList.remove("active")
                );

            } else {

                document.querySelectorAll(".veg-btn").forEach(btn =>
                    btn.classList.add("active")
                );
            }
        }
    },

    selectDessert(button) {

        const isAlreadyActive = button.classList.contains("active");

        document.querySelectorAll(".dessert-btn").forEach(b =>
            b.classList.remove("active")
        );

        if (!isAlreadyActive) {
            button.classList.add("active");
        }
    },

    getOrderData() {

        const main = document.querySelector(".main-btn.active")?.dataset.value || "";

        const vegetables = [];
        document.querySelectorAll(".veg-btn.active").forEach(btn => {
            vegetables.push(btn.dataset.value);
        });

        const dessert = document.querySelector(".dessert-btn.active")?.dataset.value || "";

        return {
            main,
            vegetables,
            dessert,
            specialRequest: this.specialInput.value
        };
    },

    populateOrder(data) {

        this.clearAllSelections();

        document.querySelectorAll(".main-btn").forEach(btn => {
            if (btn.dataset.value === data.main) {
                btn.classList.add("active");
            }
        });

        document.querySelectorAll(".veg-btn").forEach(btn => {
            if (data.vegetables && data.vegetables.includes(btn.dataset.value)) {
                btn.classList.add("active");
            }
        });

        document.querySelectorAll(".dessert-btn").forEach(btn => {
            if (btn.dataset.value === data.dessert) {
                btn.classList.add("active");
            }
        });

        this.specialInput.value = data.specialRequest || "";
    },

    clearAllSelections() {
        document.querySelectorAll(".select-btn").forEach(btn =>
            btn.classList.remove("active")
        );
        this.specialInput.value = "";
    },

    resetDefaults() {

        this.clearAllSelections();

        document.querySelectorAll(".veg-btn").forEach(btn =>
            btn.classList.add("active")
        );
    }
};

// ===============================
// 🔥 MENU LOADER
// ===============================

async function loadMenuForDate(date, mealType) {
    const menu = await getMenuByDate(date, mealType);

    const warning = document.getElementById("menuWarning");
    const m1Btn = document.getElementById("m1Btn");
    const m2Btn = document.getElementById("m2Btn");
    const carbLine = document.getElementById("carbLine");
    const v1Btn = document.getElementById("v1Btn");
    const v2Btn = document.getElementById("v2Btn");
    const d1Btn = document.getElementById("d1Btn");
    const d2Btn = document.getElementById("d2Btn");
    const d3Btn = document.getElementById("d3Btn");

    if (!menu || !menu.m1 || !menu.m2 || !menu.c1) {

        warning.textContent = "⚠ Menu not updated for this day";

        document.querySelectorAll(".select-btn").forEach(btn => {
            btn.disabled = true;
        });

        carbLine.textContent = "";
        return;
    }

    warning.textContent = "";

    document.querySelectorAll(".select-btn").forEach(btn => {
        btn.disabled = false;
    });

    // MAINS
    m1Btn.textContent = menu.m1;
    m1Btn.dataset.value = menu.m1;

    m2Btn.textContent = menu.m2;
    m2Btn.dataset.value = menu.m2;

    // CARB
    carbLine.textContent = "with " + menu.c1;

    // VEGETABLES
    if (menu.v1) {
        v1Btn.textContent = menu.v1;
        v1Btn.dataset.value = menu.v1;
    }

    if (menu.v2) {
        v2Btn.textContent = menu.v2;
        v2Btn.dataset.value = menu.v2;
    }

    // DESSERTS
    setDessert(d1Btn, menu.d1);
    setDessert(d2Btn, menu.d2);
    setDessert(d3Btn, menu.d3);
}

function setDessert(btn, value) {

    if (!value) {
        btn.style.display = "none";
        return;
    }

    btn.style.display = "inline-block";
    btn.textContent = value;
    btn.dataset.value = value;
}

// ===============================
// Header Selection Controller
// ===============================

export function initHeaderController() {

    const mealDateInput = document.getElementById("mealDate");
    const todayBtn = document.getElementById("todayBtn");
    const tomorrowBtn = document.getElementById("tomorrowBtn");
    const mealButtons = document.querySelectorAll(".meal-btn");
    const title = document.getElementById("activeMealTitle");
    const controls = document.getElementById("selectionControls");

    if (!mealDateInput || !title || !controls) return;

    mealDateInput.addEventListener("change", function () {
        selectedDate = this.value;
        checkReady();
    });

todayBtn?.addEventListener("click", function () {

    document.querySelectorAll(".quick-btn")
        .forEach(btn => btn.classList.remove("active"));

    this.classList.add("active");

    const today = new Date().toISOString().split("T")[0];
    mealDateInput.value = today;
    selectedDate = today;
    checkReady();
});
   tomorrowBtn?.addEventListener("click", function () {

    document.querySelectorAll(".quick-btn")
        .forEach(btn => btn.classList.remove("active"));

    this.classList.add("active");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatted = tomorrow.toISOString().split("T")[0];

    mealDateInput.value = formatted;
    selectedDate = formatted;
    checkReady();
});

  mealButtons.forEach(btn => {
    btn.addEventListener("click", function () {

        mealButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");

        selectedMeal = this.dataset.meal;
        checkReady();
    });
});

    function checkReady() {
        if (selectedDate && selectedMeal) {
            activateView();
        }
    }

    function activateView() {

        const options = { weekday: 'long', day: 'numeric', month: 'short' };
        const formattedDate = new Date(selectedDate)
            .toLocaleDateString('en-AU', options);

        title.innerText = `${formattedDate} (${selectedMeal})`;

        controls.style.display = "none";
        title.style.display = "block";

        // 🔥 Load menu when ready
   loadMenuForDate(selectedDate, selectedMeal);
    }

    title.addEventListener("click", function () {
        selectedDate = null;
        selectedMeal = null;

        controls.style.display = "block";
        title.style.display = "none";
    });
}



export default UIController;