// Création de la fonction de connexion  
async function envoyerIdentifiants() {
    const formulaireIdentifiants = document.querySelector(".login-form");

    // Vérification de la présence du formulaire
    if (formulaireIdentifiants) {
        formulaireIdentifiants.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Récupération des valeurs du formulaire d'identification
            const email = document.querySelector("#email").value;
            const motDePasse = document.querySelector("#mdp").value;

            const user = {
                email: email,
                password: motDePasse
            };

            try {
                // Appel de la fonction fetch avec toutes les informations nécessaires
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(user)
                });
        
                // Vérification de la réponse 
                if (response.status === 404) {
                    alert("Erreur dans l’identifiant ou le mot de passe.");
                }

                // Si la réponse est réussie, extraction des données en JSON
                const result = await response.json();

                // Vérification du token 
                if (result && result.token) {
                    // Stockage du token dans le local storage
                    localStorage.setItem("token", result.token);

                    // Redirection vers la page d'accueil
                    window.location.href = "index.html";

                    // Changement du texte du lien une fois connecté
                    deconnexion();
                }
            } catch (error) {
                // Message en cas d'arreurs de requête ou de connexion 
                console.error("Erreur lors de la requête d'authentification:", error);
            }
        });
    } 
}

// Création de la fonction de déconnexion 
function deconnexion() {
    const loginLink = document.querySelector(".login-link");

    if (loginLink) {
        // Vérification si le token est déjà stocké dans le local storage
        if (localStorage.getItem("token")) {

            // Changement du texte du lien "login" en "logout"
            loginLink.textContent = "logout";

            // Déconnexion lors du clique sur "logout"
            loginLink.addEventListener("click", function (event) {
                event.preventDefault();

                // Suppression du token du local storage
                localStorage.removeItem("token");

                // Redirection vers la page d'identification 
                window.location.href = "login.html";
            });
        }
    }
}

// les fonctions sont exécutées lorsque la page est entièrement chargée
document.addEventListener("DOMContentLoaded", function () {
    envoyerIdentifiants();
    deconnexion();
});