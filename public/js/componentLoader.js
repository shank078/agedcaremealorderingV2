// componentLoader.js

// 🔥 IMPORTANT: Firebase must initialize FIRST
import "./firebase.js";

// Then import other modules
import { initHeaderController } from "./uiController.js";
import "./orderService.js";
import "./app.js";

document.addEventListener("DOMContentLoaded", () => {

    Promise.all([
        loadComponent("components/header.html", "header"),
        loadComponent("components/roomSelector.html", "roomSelector"),
        loadComponent("components/orderForm.html", "orderFormContainer")
    ])
    .then(() => {

        console.log("✅ Components loaded");

        // Initialize header AFTER header is inserted
        initHeaderController();

        // Initialize main app logic (if defined globally)
        if (typeof window.initializeApp === "function") {
            window.initializeApp();
        } else {
            console.warn("⚠ initializeApp() not found.");
        }

    })
    .catch(error => {
        console.error("❌ Error loading components:", error);
    });

});


function loadComponent(file, elementId) {

    return fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load " + file);
            }
            return response.text();
        })
        .then(html => {

            const container = document.getElementById(elementId);

            if (!container) {
                throw new Error("Container not found: " + elementId);
            }

            container.innerHTML = html;
        });
}