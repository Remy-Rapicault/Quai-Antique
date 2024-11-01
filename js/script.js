const tokenCookieName = "accesstoken";
const roleCookieName = "role";
const signoutBtn = document.getElementById("signout-btn");
const apiUrl = 'https://quaiantique84.alwaysdata.net/';

if (signoutBtn) {
    signoutBtn.addEventListener("click", signout);
}

getInfosUser(); // Récupération des infos de l'utilisateur au chargement de la page

function getRole() {
    return getCookie(roleCookieName);
}

function signout() {
    eraseCookie(tokenCookieName);
    eraseCookie(roleCookieName);
    window.location.reload();
}

function setToken(token) {
    setCookie(tokenCookieName, token, 7);
}

function getToken() {
    return getCookie(tokenCookieName);
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (const element of ca) {
        let c = element;
        while (c.startsWith(' ')) c = c.substring(1, c.length);
        if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function isConnected() {
    return getToken() !== null;
}

// Fonction pour afficher ou masquer les éléments selon le rôle
function showAndHideElementForRoles() {
    const userConnected = isConnected();
    const role = getRole();
    let allElementsToEdit = document.querySelectorAll('[data-show]');

    allElementsToEdit.forEach(element => {
        switch (element.dataset.show) {
            case 'disconnected':
                if (userConnected) {
                    element.classList.add("d-none");
                }
                break;
            case 'connected':
                if (!userConnected) {
                    element.classList.add("d-none");
                }
                break;
            case 'admin':
                if (!userConnected || role !== "admin") {
                    element.classList.add("d-none");
                }
                break;
            case 'client':
                if (!userConnected || role !== "client") {
                    element.classList.add("d-none");
                }
                break;
        }
    });
}

// Fonction pour récupérer les informations utilisateur
function getInfosUser() {
    let myHeaders = new Headers();
    myHeaders.append("X-AUTH-TOKEN", getToken());

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
        mode: 'cors'
    };

    fetch(apiUrl + "account/me", requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log("Impossible de récupérer les informations utilisateur");
                return null; // Retourne explicitement `null` si la réponse n'est pas correcte
            }
        })
        .then(result => {
            // Vérifie d'abord si result n'est pas nul ou undefined, puis vérifie la propriété `role`
            if (result?.role) {
                setCookie(roleCookieName, result.role, 7); // Met à jour le rôle dans le cookie
                showAndHideElementForRoles(); // Met à jour l'affichage selon le rôle
            }
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données utilisateur", error);
        });
}
