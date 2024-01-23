// Création d'un Set pour stocker les catégories uniques
const categoriesSet = new Set();

let projets = [];

let initialModal;

async function categories() {
    try {
        // Appel de l'API pour récupérer les catégories
        const response = await fetch("http://localhost:5678/api/categories");
        const categoriesData = await response.json();

        // Ajout manuel d'une nouvelle catégorie
        const nouvelleCategorie = { id: "0", name: "Tous" };
        categoriesSet.add(nouvelleCategorie);

        // Ajout des catégories de l'API dans le Set
        for (const categorie of categoriesData) {
            categoriesSet.add(categorie);
        }

        genererCategories(categoriesSet);

        return categoriesSet;
    } catch (err) {
        throw new Error("Something went wrong");
    }
};

function genererCategories(categories) {
    // Récupération de l'élément du DOM qui accueillera les catégories
    const divFiltres = document.querySelector(".filters");

    for (const categorie of categories) {
        // Création d’une balise dédiée à une catégorie
        const categorieElement = document.createElement("ul");
        categorieElement.dataset.id = categorie.id;

        // Création de la balise
        const nomElement = document.createElement("li");
        nomElement.innerHTML = categorie.name;

        // Changement d'aspect des filtres lors du clique 
        categorieElement.addEventListener("click", function () {
            const itemSelected = divFiltres.querySelector("ul.filter-selected");
            if (itemSelected) {
                itemSelected.classList.remove("filter-selected");
            }
            this.classList.add("filter-selected");

            // Au clique de la catégorie ajoutée manuellement
            if (categorie.id === "0") {
                // Réinitialiser la galerie
                const divGalerie = document.querySelector(".gallery");
                divGalerie.innerHTML = "";

                // Générer les projets non filtrés
                genererProjets(projets);
            } else {
                // Filtre des projets en fonction de leur nom 
                const categoryName = categorie.name;
                const projetsFiltres = projets.filter(function (projet) {
                    const projetName = projet.category.name;
                    return categoryName === projetName;
                });

                // Réinitialiser la galerie
                const divGalerie = document.querySelector(".gallery");
                divGalerie.innerHTML = "";

                // Générer les projets filtrés
                genererProjets(projetsFiltres);
            }
        });

        // On rattache les balises à leur parent
        divFiltres.appendChild(categorieElement);
        categorieElement.appendChild(nomElement);
    }
}

async function works() {
    try {
        // Appel de l'API pour récupérer les travaux
        const response = await fetch("http://localhost:5678/api/works");
        const worksData = await response.json();

        projets = worksData;

        genererProjets(projets);

        return projets;
    } catch (err) {
        throw new Error("Something went wrong");
    }
}

function genererProjets(projets) {
    // Récupération de l'élément du DOM qui accueillera les projets
    const divGalerie = document.querySelector(".gallery");

    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i];

        // Création d’une balise dédiée à un projet
        const projetElement = document.createElement("figure");
        projetElement.dataset.id = projet.id;

        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;

        const titleElement = document.createElement("figcaption");
        titleElement.innerHTML = projet.title;

        // On rattache les balises à leur parent
        divGalerie.appendChild(projetElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(titleElement);
    }
}

// Création de la fonction de gestion 
function gestion() {
    const editButtons = document.querySelectorAll(".edit");
    const editMode = document.querySelector(".edit-mode");
    const filters = document.querySelector(".filters");
    const header = document.querySelector("header");
    const modalContainer = document.querySelector(".modal-container");
    const modal = document.querySelector(".modal");
    const openModal = document.querySelectorAll(".open-modal");
    const closeModal = document.querySelector(".close-modal");

    if (localStorage.getItem("token")) {

        // Disparition des filtres
        filters.style.display = "none";

        // Affichage des boutons de modifications
        editButtons.forEach(button => {
            button.style.display = "flex";
        });

        // Affichage de la barre d'édition
        editMode.style.display = "flex";
        header.style.margin = "97px 0";

        // Ouverture de la fenêtre modale 
        openModal.forEach((element) =>
            element.addEventListener("click", () => {
                modalContainer.style.display = "block";
                fenêtreModale();
            })
        );

        function fenêtreModale() {
            // Fermeture de la modale au clique sur la croix
            closeModal.addEventListener("click", () => {
                modalContainer.style.display = "none";
            });

            // Fermeture de la modale en dehors de celle-ci
            modalContainer.addEventListener("click", (event) => {
                if (event.target !== modalContainer && !modal.contains(event.target)) {
                    modalContainer.style.display = "none";
                    restoreInitialModal();
                }
            });

            if (modalContainer.style.display = "block") {
                // Stockage de l'état initial de la modale 
                initialModal = modal.innerHTML;
                genererProjetsModale(projets);
            }
        }
    }
}