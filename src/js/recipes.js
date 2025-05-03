//JS encargado de generar dinámicamente las recetas en el html de plantilla y leerlas si hay una voz.
import { read, handleKeyupForTab, getSelectedVoice, redirect } from './utils.js';

document.addEventListener("DOMContentLoaded", async () => {

  // Se obtiene la voz del sessionStorage
  const selected = await getSelectedVoice();
  const [voiceName] = selected;

  // Se comprueba si no se seleccionó ninguna voz y se redirige a la página de selección en caso contrario
  if (!selected) {
    sessionStorage.removeItem("recipes");
    redirect("/index.html");
    return;
  }

  // Se obtienen las recetas almacenadas en sessionStorage
  const recipes = JSON.parse(sessionStorage.getItem("recipes"));

  // Se comprueba que existen recetas y se redirige en caso contrario
  if (!recipes || recipes.length === 0) {
    redirect("main.html");
  }

  // Se obtiene el título de la receta desde los parámetros de la URL, reemplazando los guiones por espacios
  const urlParams = new URLSearchParams(window.location.search);
  let title = urlParams.get('title');
  const recipeTitle = title.replace(/_/g, ' ');

  // Se verifica que se ha pasado un título válido en la URL
  if (!recipeTitle) {
    redirect("main.html");
  }

  // Se coteja la receta con la almacenada en el storage
  const recipe = recipes.find(r => r.title === recipeTitle);

  // Si la receta no se encuentra, se redirige
  if (!recipe) {
    redirect("main.html");
  }

  // Se inserta la receta en el DOM
  document.querySelector('#recipe-title').textContent = recipe.title;
  document.querySelector('#recipe-photo').src = recipe.image.url;
  document.querySelector('#recipe-photo').alt = recipe.image.alt_text;
  document.querySelector('#recipe-info').textContent = `${recipe.time}, difficultad ${recipe.difficulty}`;

  // Se formatea la descripción para que no se extienda demasiado, ya que algunas voces se cortan con mucho texto.
  const description = recipe.description;
  if (description.length > 70) {
    let jumpIndex = description.slice(70).search(/[.,]/);
    if (jumpIndex !== -1) {
      const finalIndex = 70 + jumpIndex + 1;
      document.querySelector('#recipe-description').textContent = description.slice(0, finalIndex) + '\n' + description.slice(finalIndex);
    }     
  } else {
    document.querySelector('#recipe-description').textContent = description;
  }

  document.querySelector('#diners').textContent = recipe.diners;

  // Se crean los botones de texto para los ingredientes y pasos
  const ingredientsList = document.querySelector('#ingredients-list');
  recipe.ingredients.forEach(ingredient => {
    const button = document.createElement('button');
    button.classList.add("buttonText");
    const li = document.createElement('li');
    li.textContent = ingredient;
    button.appendChild(li);
    ingredientsList.appendChild(button);
  });

  const stepsList = document.querySelector('#steps-list');
  recipe.making.forEach(step => {
    const button = document.createElement('button');
    button.textContent = step;
    button.classList.add("buttonText");
    stepsList.appendChild(button);
  });

  document.querySelector('#stepsCount').textContent = recipe.making.length;

  const goBack = document.querySelectorAll(".goBack");

  // Se maneja la lectura de los elementos cuando se navega con el teclado en caso de escoger una voz
  if (voiceName !== "noVoice") {
    const buttons = document.querySelectorAll("button");
    const imgs = document.querySelectorAll(".images");

    handleKeyupForTab(buttons, (element) => {
      read(element.textContent);
    });

    handleKeyupForTab(imgs, (element) => {
      read(element.alt);
    });

    handleKeyupForTab(goBack, (element) => {
      read(element.alt);
    });
  }
  // Redirección para ir a otra receta
  goBack.forEach((element) => {
    element.addEventListener("click", () => {
      redirect("main.html");
    });
  });
});