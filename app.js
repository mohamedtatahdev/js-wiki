const form = document.querySelector("form"); // Sélectionne le formulaire dans le document.
const input = document.querySelector("input"); // Sélectionne l'élément input du formulaire.
const errorMsg = document.querySelector(".error-msg"); // Sélectionne l'élément destiné à afficher les messages d'erreur.
const resultsDisplay = document.querySelector(".results-display"); // Sélectionne l'élément destiné à afficher les résultats de la recherche.
const loader = document.querySelector(".loader"); // Sélectionne l'élément destiné à indiquer le chargement des données.

form.addEventListener("submit", handleSubmit); // Attache un gestionnaire d'événement à la soumission du formulaire.

function handleSubmit(e) {
  e.preventDefault(); // Empêche le comportement par défaut de rechargement de la page lors de la soumission du formulaire.

  if (input.value === "") { // Vérifie si l'input est vide.
    errorMsg.textContent = "Wops, veuillez remplir l'input"; // Affiche un message d'erreur si l'input est vide.
    return; // Sort de la fonction pour éviter de faire l'appel API.
  } else {
    errorMsg.textContent = ""; // Réinitialise le message d'erreur si l'input n'est pas vide.
    loader.style.display = "flex"; // Affiche le loader pour indiquer que la recherche est en cours.
    resultsDisplay.textContent = ""; // Réinitialise l'affichage des résultats.
    wikiApiCall(input.value); // Appelle la fonction qui effectue la recherche sur l'API Wikipedia avec la valeur saisie.
  }
}

async function wikiApiCall(searchInput) {
  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`); // Effectue une requête à l'API Wikipedia avec la valeur de recherche.
    console.log(response); // Affiche la réponse brute dans la console pour débogage.
    if (!response.ok) { // Vérifie si la requête a échoué.
      throw new Error(`${response.status}`); // Lance une erreur avec le statut de la réponse si la requête a échoué.
    }

    const data = await response.json(); // Convertit la réponse en JSON.

    createCards(data.query.search); // Appelle la fonction pour créer des cartes de résultats avec les données obtenues.
  } catch (error) {
    errorMsg.textContent = `${error}`; // Affiche le message d'erreur en cas d'échec de la requête.
    loader.style.display = "none"; // Cache le loader quand la recherche échoue ou se termine.
  }
}

function createCards(data) {
  if (!data.length) { // Vérifie si le tableau de données est vide.
    errorMsg.textContent = "Wopsy, aucun résultat"; // Affiche un message d'erreur si aucune donnée n'est trouvée.
    loader.style.display = "none"; // Cache le loader si aucune donnée n'est trouvée.
    return; // Sort de la fonction pour éviter d'exécuter le reste du code.
  }
  data.forEach(el => { // Itère sur chaque élément du tableau de données.
    const url = `https://en.wikipedia.org/?curid=${el.pageid}`; // Construit l'URL vers la page Wikipedia de l'élément.
    const card = document.createElement("div"); // Crée un nouvel élément div pour la carte de résultat.
    card.className = "result-item"; // Attribue une classe à l'élément de la carte pour le styling.
    card.innerHTML = `
      <h3 class="result-title">
        <a href=${url} target="_blank">${el.title}</a>
      </h3>
      <a href=${url} class="result-link" target="_blank">${url}</a>
      <span class="result-snippet">${el.snippet}</span>
      <br>
    `; // Définit le contenu HTML de la carte avec le titre, le lien et l'extrait de la page Wikipedia.
    resultsDisplay.appendChild(card); // Ajoute la carte créée à l'élément d'affichage des résultats.
  });
  loader.style.display = "none"; // Cache le loader une fois que tous les résultats sont affichés.
}
