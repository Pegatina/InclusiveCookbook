//JS del layout principal, se obtiene la voz del storage y se suben las recetas a sessionStorage para construir la página y buscar las recetas.
import { read, handleKeyupForTab, getSelectedVoice, getRecipes, redirect } from './utils.js';

const sections = [
  {
    title: "Proteínas",
    id: "accordionExample",
    categories: [
      { name: "Carnes" },
      { name: "Pescados" },
      { name: "Huevos" }
    ]
  },
  {
    title: "Carbohidratos",
    id: "accordionExample2",
    categories: [
      { name: "Pastas" },
      { name: "Patatas" },
      { name: "Arroces" }
    ]
  },
  {
    title: "Vegetales",
    id: "accordionExample3",
    categories: [
      { name: "Hortalizas" },
      { name: "Legumbres" },
      { name: "Setas" }
    ]
  },
  {
    title: "Postres",
    id: "accordionExample4",
    categories: [
      { name: "Fríos" },
      { name: "Calientes" }
    ]
  }
];

const colors = ['bg-chocolate', 'bg-magenta'];

/**
 * Función que genera los acordeones, alterando los colores de los mismos.
 * @param {object} section secciones determinadas en el array de sections.
 * @param {number} index Contador único para que no se repitan los acordeones y funcionen individualmente.
 * @param {recipes} recipes json con las recetas, para clasificarlas en las distintas categorías.
 */
function createAccordion(section, index, recipes) {
  let sectionHTML = `<div class="container">
      <div class="row">
          <div class="col">
              <button class="tittleButtonTextCenter" >${section.title}</button>
              <div class="accordion" id="accordion-${index}">`;

  let colorIndex = index % 2 === 0 ? 0 : 1;

  section.categories.forEach((category, catIndex) => {
    const accordionId = `collapse${index}-${catIndex}`;
    sectionHTML += ` 
          <div class="accordion-item">
              <h2 class="accordion-header" id="heading${index}-${catIndex}">
                  <button class="accordion-button ${colors[colorIndex]} text-white" type="button"
                      data-bs-toggle="collapse" data-bs-target="#${accordionId}" aria-expanded="true"
                      aria-controls="${accordionId}">
                      ${category.name}
                  </button>
              </h2>
              <div id="${accordionId}" class="accordion-collapse collapse" aria-labelledby="heading${index}-${catIndex}">
                   <div class="accordion-body">`;

    // Se filtran las recetas que pertenecen a esta categoría y se agrega un enlace para cada una
    const recipeCategories = recipes.filter(recipe =>
      recipe.categories && recipe.categories.some(cat =>
        typeof cat === 'string' && cat.trim().toLowerCase() === category.name.trim().toLowerCase()
      )
    );
    // Se crean los enlaces con los títulos de las recetas
    if (recipeCategories.length > 0) {
      sectionHTML += recipeCategories.map((recipe, recipeIndex) => `
        <a href="../pages/recipe.html?title=${encodeURIComponent(recipe.title.replace(/\s+/g, '_'))}" class="dropDown-item">${recipeIndex + 1}.${recipe.title}</a><br>
    `).join('');
    } else {
      sectionHTML += `
      <button class="textbutton">No se ha encontrado ninguna receta para esta categoría.</button>
    `;
    }
    sectionHTML += `</div></div></div>`;
    // Se alterna el color para la siguiente categoría dentro de la misma sección
    colorIndex = (colorIndex + 1) % colors.length;
  });

  sectionHTML += `</div></div></div></div>`;
  return sectionHTML;
}

// Se obtienen las recetas y se cargan cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", async () => {
  const selected = await getSelectedVoice();
  if (!selected) {
    sessionStorage.removeItem("recipes");
    redirect("/index.html");
    return;
  }
  const [voiceName] = selected;
  const recipes = await getRecipes();
  if (!recipes || recipes.length === 0) throw new Error("No hay recetas");

  if (recipes && recipes.length > 0) {
    // Se guardan las recetas en sessionStorage
    sessionStorage.setItem("recipes", JSON.stringify(recipes));

    // Se insertan las recetas tras el buscador
    const parentContainer = document.getElementById('parent');
    sections.forEach((section, index) => {
      const sectionHTML = createAccordion(section, index, recipes);
      parentContainer.insertAdjacentHTML('beforeend', sectionHTML);
    });
  } else {
    console.error("No se han encontrado recetas.");
  }
  //Eventos del buscador
  const search = document.getElementById('search');
  let typingTimer; // Temporizador para detectar que ha terminado de escribir
  const doneTypingInterval = 400;

  if (voiceName !== "noVoice") {
    // Al hacer foco, lee el contenido actual del buscador (o su placeholder si está vacío)
    search.addEventListener("focus", () => {
      const text = search.value.trim() || search.placeholder;
      read("Buscador: " + text);
    });

    // Al escribir o grabar, actualiza la lista y lee el contenido actual
    search.addEventListener("input", () => {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(handleSearch, doneTypingInterval);
    });

    async function handleSearch() {
      updateList(recipes);
      if (search.value.trim() !== "") {
        read(search.value);
      }
    }
  }

  /**
   * Función que actualiza la listas de las recetas según lo que se busque
   */
  function updateList(recipes) {
    const list = document.getElementById('list');
    list.innerHTML = "";
    let text = search.value.toLowerCase().trim();
    const searchWords = text.split(/\s+/); // Divide la búsqueda en palabras individuales
    const matchedRecipes = new Map(); // Para evitar duplicados
    recipes.forEach(recipe => {
      const recipeTitle = recipe.title.toLowerCase();
      const keywords = recipe.keywords.map(word => word.toLowerCase());
      const categories = recipe.categories.map(cat => cat.toLowerCase());

      for (let word of searchWords) {
        const found =
          recipeTitle.includes(word) ||
          keywords.some(k => k.includes(word)) ||
          categories.some(c => c.includes(word));

        if (found) {
          matchedRecipes.set(recipe.title, recipe); // Se guarda con clave para evitar duplicados
          break;
        }
      }
    });

    let id = 1;
    matchedRecipes.forEach(recipe => {
      //Se crean los enlaces de las recetas, sustituyendo espacios por guiones bajos.
      list.innerHTML += `<a href="../pages/recipe.html?title=${encodeURIComponent(recipe.title.replace(/\s+/g, '_'))}" class="list-item">${id}. ${recipe.title}</a><br>`;
      id++;
    });

    if (list.innerHTML === "") {
      list.innerHTML = "No hay resultados";
    }
    // Lectura del listado
    if (voiceName !== "noVoice") {
      const listLinks = document.querySelectorAll("#list a");
      handleKeyupForTab(listLinks, el => {
        read(el.textContent);
      });
    }
  }
  // Objeto que permite transcribir texto grabado
  const recognition = new webkitSpeechRecognition();

  recognition.lang = "es-ES";
  recognition.continuous = false; //Solo graba hasta que detecta silencio.
  recognition.interimResults = false; //Hasta que no hay silencio por un momento, no da los resultados.

  recognition.onresult = (event) => {
    let phrase = event.results[event.results.length - 1][0].transcript; //Se capta el texto grabado
    search.value = phrase; //Y se lo añade a la cajita
    updateList(recipes);
    if (voiceName !== "noVoice") {
      read(search.value || search.placeholder);
    }
  };

  recognition.onerror = (event) => console.error(event.error);

  // Control de eventos de grabación y reproducción de voz
  document.getElementById("record").addEventListener("click", () => recognition.start());
  document.getElementById("play").addEventListener("click", () => readRecipes());

  // Lectura con el botón de reproducir búsqueda.
  function readRecipes() {
    const list = document.getElementById('list');
    if (list.innerHTML === "No hay resultados") {
      if (voiceName !== "noVoice") {
        read(list.innerHTML);
      }
    } else {
      Array.from(list.getElementsByTagName("a")).forEach(recipe => {
        if (voiceName !== "noVoice") {
          read(recipe.textContent);
        }
      });
    }
  }
  const buttons = document.querySelectorAll("button");
  const dropDown = document.querySelectorAll(".dropDown-item");
  const imgs = document.querySelectorAll(".images");
  const listLinks = document.querySelectorAll("#list a");

  // Lectura de los distintos elementos
  if (voiceName !== "noVoice") {
    handleKeyupForTab(buttons, el => {
      const text = el.textContent;
      let prefix = "Botón: ";

      if (el.classList.contains("buttonText") ||
        el.classList.contains("tittleButtonText") ||
        el.classList.contains("tittleButtonTextCenter")) {
        prefix = "";
      } else if (el.classList.contains("accordion-button")) {
        prefix = "Selector: ";
      }

      read(prefix + text);
    });

    handleKeyupForTab(dropDown, el => {
      read(el.textContent);
    });

    handleKeyupForTab(imgs, el => {
      read(el.alt);
    });

    handleKeyupForTab(listLinks, el => {
      read(el.textContent);
    });
  }
});