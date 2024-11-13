// carte.js

const apiUrl = "https://127.0.0.1:8000/api/menus"; // Remplace par l'URL de ton API

async function fetchMenus() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const menus = await response.json();
        displayMenus(menus);
    } catch (error) {
        console.error("Erreur lors de la récupération des menus :", error);
        document.getElementById("menu-container").innerHTML = "<p>Erreur de chargement des menus.</p>";
    }
}

function displayMenus(menus) {
    const menuContainer = document.getElementById("menu-container");
    menuContainer.innerHTML = ""; // Vider le conteneur avant de remplir avec les menus

    menus.forEach(menu => {
        const menuCard = document.createElement("div");
        menuCard.classList.add("menu-card");

        menuCard.innerHTML = `
            <h2>${menu.name}</h2>
            <p>${menu.description}</p>
            <ul>
                ${menu.foods.map(food => `<li>${food.name} - ${food.price}€</li>`).join("")}
            </ul>
        `;

        menuContainer.appendChild(menuCard);
    });
}

// Appeler la fonction fetchMenus au chargement de la page
document.addEventListener("DOMContentLoaded", fetchMenus);
