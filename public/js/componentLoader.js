// componentLoader.js

document.addEventListener("DOMContentLoaded", function () {

    // Load all components first
    Promise.all([
        loadComponent("components/header.html", "header"),
        loadComponent("components/roomSelector.html", "roomSelector"),
        loadComponent("components/orderForm.html", "orderFormContainer")
    ])
    .then(() => {

        console.log("✅ Components loaded");

        // Make sure initializeApp exists before calling
        if (typeof initializeApp === "function") {
            initializeApp();
        } else {
            console.error("❌ initializeApp() not found. Check app.js loading.");
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
        .then(data => {

            const container = document.getElementById(elementId);

            if (!container) {
                throw new Error("Container not found: " + elementId);
            }

            container.innerHTML = data;
        });

}