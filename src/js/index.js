//JS inicial para seleccionar las voces y navegar por la página.
import { read, handleKeyupForTab, fillVoices, redirect } from './utils.js';

//Se juega con la API de JS encargada de leer textos.
const synth = window.speechSynthesis;
const voiceSelect = document.getElementById("voiceSelector");

let voiceList = [];
let tempVoice = "default";

// Función para obtener el nombre de la voz seleccionada
const getSelectedVoiceName = () => voiceSelect.selectedOptions[0]?.dataset.name || "noVoice";

// Se rellena el selector con las voces
fillVoices(synth, voiceSelect, (list) => {
  voiceList = list;
  // Se preselecciona la primera voz
  voiceSelect.selectedIndex = 0;
  tempVoice = getSelectedVoiceName();
});

// Evento para leer la opción activa al enfocar el selector
voiceSelect.addEventListener("focus", () => {
  const text = voiceSelect.selectedOptions[0].textContent;
  read("Selector de voces" + text, tempVoice);
});

// Evento para cambiar la voz seleccionada
voiceSelect.addEventListener("change", (e) => {
  tempVoice = getSelectedVoiceName();
  const text = voiceSelect.selectedOptions[0].textContent;
  read("Selector de voces" + text, tempVoice);
});

// Se guarda la voz definitiva al pulsar el botón antes de cambiar a la página principal
document.getElementById("voice").addEventListener("click", () => {
  sessionStorage.setItem("voice", JSON.stringify(tempVoice));
  redirect("./src/pages/main.html");
});

// Lectura al navegar con el tabulador
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button");
  const imgs = document.querySelectorAll(".images");

  const getVoice = () => (tempVoice === "noVoice" ? "default" : tempVoice);

  handleKeyupForTab(buttons, el => {
    const text = el.id === "voice" ? "Botón: " + el.textContent : el.textContent;
    read(text, getVoice());
  });
  handleKeyupForTab(imgs, el => read(el.alt, getVoice()));
});