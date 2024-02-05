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

function genererProjetsModale(projets) {
    // Récupération de l'élément du DOM qui accueillera les projets de la modale
    const divGalerieModale = document.querySelector(".modal-gallery");
    divGalerieModale.innerHTML = "";

    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i];

        // Création d’une balise dédiée à un projet
        const projetElement = document.createElement("figure");
        projetElement.dataset.id = projet.id;

        // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;
        imageElement.classList.add("modal-image");

        const iconeElement = document.createElement("i");
        iconeElement.classList.add("fa-regular", "fa-trash-can");
        // Appel de la fonction deleteProject lorsque l'icône de poubelle est cliquée
        iconeElement.addEventListener("click", handleClick);

        const hoverIconeElement = document.createElement("i");
        hoverIconeElement.classList.add("fa-solid", "fa-arrows-up-down-left-right");

        const titleElement = document.createElement("figcaption");
        titleElement.innerHTML = "éditer";
        titleElement.classList.add("modal-figcaption");

        // On rattache les balises à leur parent
        divGalerieModale.appendChild(projetElement);
        projetElement.appendChild(imageElement);
        projetElement.appendChild(iconeElement);
        projetElement.appendChild(hoverIconeElement);
        projetElement.appendChild(titleElement);
    }
    async function handleClick(event) {
        event.stopPropagation();

        const trashCan = event.target;
        const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");

        if (confirmation) {
            try {
                await deleteProject(event);
            } catch (error) {
                console.error("Erreur lors de la suppression du projet:", error);
            }
        }
    }
}

function restoreInitialModal() {
    const modal = document.querySelector(".modal");
    // état initial de la modale 
    modal.innerHTML = initialModal;
    genererProjetsModale(projets);

    // Ré-initialisation de la hauteur de la fenêtre modale
    modal.style.height = "731px";

    // Flèche de retour masquée
    const arrowBack = document.querySelector(".fa-arrow-left-long");
    arrowBack.style.display = "none"

    // Ré-initialisation du titre en "Galerie photo"
    const h3 = document.querySelector("h3");
    h3.textContent = "Galerie photo";

    // Disparition de la modale galerie
    const modalGallery = document.querySelector(".modal-gallery");
    modalGallery.style.display = "grid"

    // Disparition du cadre de la nouvelle photo à ajouter
    const modalPicture = document.querySelector(".modal-picture");
    modalPicture.style.display = "none";

    // Disparition du formulaire de la nouvelle photo à ajouter
    const modalForm = document.querySelector(".modal-form");
    modalForm.style.display = "none";
    // Ré-initialisation du titre du formulaire
    document.querySelector("#title").value = "";

    // Ré-initialisation du bouton "Ajouter une photo"
    const addPictureBtn = document.querySelector(".btn-add-picture");
    const validateBtn = document.querySelector(".btn-validate");
    addPictureBtn.style.display = "block";
    validateBtn.style.display = "none";

    // Ré-apparition du bouton de suppression de la galerie 
    const deleteGallery = document.querySelector(".btn-delete-gallery");
    deleteGallery.style.display = "block";

    // Ajout, de nouveau, des écouteurs d'événements 
    // Fermeture de la modale au clique sur la croix
    const modalContainer = document.querySelector(".modal-container");
    const closeModal = document.querySelector(".close-modal");
    closeModal.addEventListener("click", () => {
        modalContainer.style.display = "none";
    })

    ajoutPhoto();
}

async function ajoutPhoto() {
    const addPictureBtn = document.querySelector(".btn-add-picture");

    addPictureBtn.addEventListener("click", async function () {
        // Changement de la hauteur de la fenêtre modale
        const modal = document.querySelector(".modal");
        modal.style.height = "670px";

        // Flèche de retour visible
        const arrowBack = document.querySelector(".fa-arrow-left-long");
        arrowBack.style.display = "block"
        // Au clique sur la flèche retour, la modale retrouve son état initial
        arrowBack.addEventListener("click", (event) => {
            event.stopPropagation();
            restoreInitialModal();
        })

        // Changement du titre en "Ajout photo"
        const h3 = document.querySelector("h3");
        h3.textContent = "Ajout photo";

        // Disparition de la modale galerie
        const modalGallery = document.querySelector(".modal-gallery");
        modalGallery.style.display = "none";

        // Apparition du cadre de la nouvelle photo à ajouter
        const modalPicture = document.querySelector(".modal-picture");
        modalPicture.style.display = "flex";
        cadreModale();

        // Apparition du formulaire de la nouvelle photo à ajouter
        const modalForm = document.querySelector(".modal-form");
        modalForm.style.display = "flex";
        optionsFormulaire(categoriesSet);

        // Changement du bouton "Ajouter une photo"
        const addPictureBtn = document.querySelector(".btn-add-picture");
        const validateBtn = document.querySelector(".btn-validate");
        addPictureBtn.style.display = "none";
        validateBtn.style.display = "block";

        // Si les conditions sont réunies => changement d'aspect du bouton d'envoi "Valider"
        document.querySelector(".miniature-image").addEventListener("change", updateValidateBtn);
        document.querySelector("#title").addEventListener("input", updateValidateBtn);
        document.querySelector("#categoriesOption").addEventListener("change", updateValidateBtn);
        // Au clique sur "Valider" appel de ma fonction uploader 
        validateBtn.addEventListener("click", uploader);

        // Disparition du bouton de suppression de la galerie 
        const deleteGallery = document.querySelector(".btn-delete-gallery");
        deleteGallery.style.display = "none";
    });
}

function cadreModale() {
    const modalPicture = document.querySelector(".modal-picture");
    modalPicture.innerHTML = "";

    const iconePictureElement = document.createElement("i");
    iconePictureElement.classList.add("fa-regular", "fa-image");

    const btnPictureElement = document.createElement("button");
    btnPictureElement.innerHTML = "+ Ajouter photo";
    btnPictureElement.classList.add("more-picture-btn");

    const dropzoneContainer = document.createElement("div");
    dropzoneContainer.classList.add("dropzone-container");
    const miniatureImage = document.createElement("img");
    miniatureImage.classList.add("miniature-image");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png";
    fileInput.id = "fileInput";
    fileInput.style.display = "none";

    btnPictureElement.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", (event) => {
        const selectedFile = event.target.files[0];
        const maxSize = 4194304; // = à 4 Mo (en octets)

        if (selectedFile.size > maxSize) {
            // Si le fichier dépasse la taille maximale
            alert("La taille du fichier dépasse la limite autorisée.");
            fileInput.value = ""; // Ré-initialisation du fichier séléctionné
        } else {
            dropzoneContainer.style.display = "flex";
            iconePictureElement.style.display = "none";
            btnPictureElement.style.display = "none";
            conditionPictureElement.style.display = "none";
            const reader = new FileReader();
            reader.onload = (e) => {
                miniatureImage.src = e.target.result;
            };
            reader.readAsDataURL(selectedFile);
        }
    });

    const conditionPictureElement = document.createElement("p");
    conditionPictureElement.innerHTML = "jpg, png : 4mo max";
    conditionPictureElement.classList.add("condition-picture");

    modalPicture.appendChild(iconePictureElement);
    modalPicture.appendChild(btnPictureElement);
    modalPicture.appendChild(conditionPictureElement);
    modalPicture.appendChild(dropzoneContainer);
    dropzoneContainer.appendChild(fileInput);
    dropzoneContainer.appendChild(miniatureImage);
}

function optionsFormulaire(categoriesSet) {
    const modalForm = document.querySelector(".modal-form");

    let select = document.getElementById("categoriesOption");

    // on empêche le dédoublement constant de l'élément "select" et de ses options
    if (!select) {
        select = document.createElement("select");
        select.id = "categoriesOption";
        select.name = "category";
        modalForm.appendChild(select);

        const inputOption = document.createElement("option");
        inputOption.value = "";
        select.appendChild(inputOption);

        for (const categorie of categoriesSet) {
            if (categorie.id != 0) {
                const optionElement = document.createElement("option");
                optionElement.value = categorie.id;
                optionElement.textContent = categorie.name;
                select.appendChild(optionElement);
            }
        }
    }
}

function updateValidateBtn() {
    const miniatureImage = document.querySelector(".miniature-image");
    const titleInput = document.querySelector("#title").value;
    const categoryInput = document.querySelector("#categoriesOption").value;
    const validateBtn = document.querySelector(".btn-validate");

    if (miniatureImage.src !== "" && titleInput !== "" && categoryInput !== "") {
        // Changement d'aspect du bouton Valider 
        validateBtn.style.background = "#1d6154";
        validateBtn.style.cursor = "pointer";
    } else {
        validateBtn.style.background = "#a7a7a7";
        validateBtn.style.cursor = "default";
    }
}

async function uploader(event) {
    event.preventDefault();
    event.stopPropagation();

    let fileInput = document.querySelector("#fileInput").files[0];
    let titleInput = document.querySelector("#title").value;
    let categoryInput = document.querySelector("#categoriesOption").value;

    if (!fileInput) {
        console.error("Aucun fichier sélectionné");
        return;
    }

    // Récupération du token dans le local storage
    let monToken = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("image", fileInput);
    formData.append("title", titleInput);
    formData.append("category", categoryInput);

    try {
        // Requête Post à l'API
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${monToken}`,
            },
            body: formData
        })

        // Vérification de la réponse 
        if (response.status === 400) {
            // Message d’erreur si le formulaire n’est pas correctement rempli
            alert("Erreur de validation du formulaire. Veuillez remplir entièrement le formulaire.");
        }
        if (response.status === 401) {
            throw new Error("Non autorisé.");
        }
        if (response.status === 500) {
            throw new Error("Comportement inattendu.");
        }
        if (response.status === 201 && fileInput !== "" && titleInput !== "" && categoryInput !== "") {
            // Changement d'aspect du bouton Valider et envoi du projet
            updateValidateBtn();
            // Réponse de l'API si le formulaire est correctement envoyé 
            const responseData = await response.json();
            console.log("Réponse de l'API :", responseData);
            // Actualisation dynamique du DOM 
            const Galerie = document.querySelector(".gallery");
            Galerie.innerHTML = "";
            await works();
            // fermeture de la modale 
            document.querySelector(".modal-container").style.display = "none";
            // En cas de ré-ouverture de la modale: réinitialisation du formulaire 
            restoreInitialModal();
        }
    } catch (error) {
        console.error("Erreur lors de la requête d'envoi")
    }
}

async function deleteProject(event) {
    event.preventDefault();
    event.stopPropagation();

    const trashCan = event.target;
    // projet dans lequel se trouve l'icône de poubelle 
    const figure = trashCan.closest("figure");
    // Obtention de l'ID du projet dans lequel se trouve l'icône de poubelle
    const projectID = figure.getAttribute("data-id");
    // Récupération du token dans le local storage
    let monToken = localStorage.getItem("token");

    try {
        // Requête DELETE à l'API en utilisant l'ID du projet
        const response = await fetch(`http://localhost:5678/api/works/${projectID}`, {
            method: "DELETE",
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${monToken}`,
            },
        })
        // Vérification de la réponse 
        if (response.status === 401) {
            throw new Error("Non autorisé.");
        }
        if (response.status === 500) {
            throw new Error("Comportement inattendu.");
        }
        if (response.status === 200 || response.status === 204) {
            // Supression du projet de la galerie modale 
            figure.remove();
            // Supression du projet de la galerie
            const Galerie = document.querySelector(".gallery");
            Galerie.innerHTML = "";
            await works();
        }
    } catch (error) {
        console.error("Erreur lors de la requête de suppression:", error);
    }
}

async function indexPage() {
    await categories();
    await works();
    gestion();
    ajoutPhoto();
}

// les fonctions sont exécutées lorsque la page est entièrement chargée
document.addEventListener("DOMContentLoaded", indexPage);
