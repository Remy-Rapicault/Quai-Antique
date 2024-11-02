const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSignin = document.getElementById("btnSignin");
const signinForm = document.getElementById("signinForm");

btnSignin.addEventListener("click", checkCredentials);

function checkCredentials(){
    let dataForm = new FormData(signinForm);
    
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "username": dataForm.get("email"),
        "password": dataForm.get("mdp")
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(apiUrl + "login", requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error("Connexion échouée : " + response.status);
        }
        return response.json();
    })
    .then(result => {
        if (result && result.apiToken) {
            const token = result.apiToken;
            setToken(token);
            setCookie(roleCookieName, result.roles[0], 7);
            window.location.replace("/");
        } else {
            console.error("Erreur: Le token n'est pas défini dans la réponse.");
        }
    })
    .catch(error => console.error("Erreur lors de la connexion:", error));

}