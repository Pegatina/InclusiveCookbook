// JS reutilizable en varios módulos

const synth = window.speechSynthesis;

//Función para rellenar las voces filtradas en un selector
export function fillVoices(synth, voiceSelect, callback) {
    function loadVoices() {
        let voices = synth.getVoices();
        voiceSelect.innerHTML = ""; // Se vacía el select

        const list = [];

        voices
            .filter(v => v.lang === "es-ES")
            .forEach(voice => {
                let option;
                if (voice.name.includes("Helena")) {
                    option = createOption("Opción 1: Voz femenina", voice.name);
                } else if (voice.name.includes("español")) {
                    option = createOption("Opción 2: Voz masculina", voice.name);
                }

                if (option) {
                    voiceSelect.appendChild(option);
                    list.push({ text: option.textContent, name: voice.name });
                }
            });

        // Opción para que la página no se lea en voz alta (a partir de la página principal, en la página inicial se lee con la voz por defecto por accesibilidad.)
        const noVoice = createOption("Opción 3: Ninguna voz", "noVoice");
        voiceSelect.appendChild(noVoice);
        list.push({ text: noVoice.textContent, name: "noVoice" });

        // Se realiza un callback para que la lista se actualice y rellene justo tras finalizar la función.
        callback(list);
    };

    //Función auxiliar para crear las opciones del select
    const createOption = (label, name) => {
        const option = document.createElement("option");
        option.textContent = label;
        option.value = label;
        option.dataset.name = name;
        return option;
    };

    loadVoices();

    // Se fuerza a la actualización de la selección de voces.
    if ('onvoiceschanged' in synth) {
        synth.onvoiceschanged = loadVoices;
    }
}

// Función para manejar la lectura con las voces seleccionadas, se puede pasar una voz o escoger directamente la voz guardada
export function read(text, chosenVoice = null) {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);

    // Si se pasa una voz
    if (chosenVoice) {
        // Se busca la voz correspondiente y se asigna
        const voice = synth.getVoices().find(v => v.name === chosenVoice);
        if (voice) utterance.voice = voice;
        synth.speak(utterance);
    } else if (chosenVoice === null) {
        // Si no se pasa una voz, se usa la guardada en sessionStorage
        getSelectedVoice().then(([voiceName, voiceList]) => {
            if (voiceName) {
                const voice = voiceList.find(v => v.name === voiceName);
                if (voice) utterance.voice = voice;
            }
            synth.speak(utterance);
        });
    } else {
        //Si no se escoge una voz válida o no está almacenada correctamente
        redirect("/index.html");
    }
    // Manejo de errores
    utterance.onerror = e => console.error(e);
}

// Función para manejar el evento "keyup" para navegación con Tabulador
export function handleKeyupForTab(elements, action) {
    elements.forEach(el => {
        el.addEventListener("keyup", e => {
            if (e.key === "Tab") action(el);
        });
    });
}

// Función para redirigir entre páginas
export function redirect(url) {
    window.location.href = url;
}

// Función para obtener la voz escogida
export function getSelectedVoice() {
    return new Promise(resolve => {
        const storedVoiceName = JSON.parse(sessionStorage.getItem("voice")) || "none";
        //Si no existe una voz almacenada, se vuelve a la página de selección.
        if (storedVoiceName === "none" || !storedVoiceName) {
            sessionStorage.removeItem("recipes");
            redirect("/index.html");
            resolve(null);
            return;
        }
        // Caso especial de página silenciosa
        if (storedVoiceName === "noVoice") {
            resolve(["noVoice", []]);
            return;
        }

        // Se coteja la voz con la voz almacenada
        let voices = synth.getVoices();
        if (voices.length) {
            const selectedVoice = voices.find(v => v.name === storedVoiceName);
            resolve(selectedVoice ? [selectedVoice.name, [selectedVoice]] : [null, []]);
        } else {
            // Se carga la lista de voces
            synth.onvoiceschanged = () => {
                voices = synth.getVoices();
                const selectedVoice = voices.find(v => v.name === storedVoiceName);
                resolve(selectedVoice ? [selectedVoice.name, [selectedVoice]] : [null, []]);
            };
        }
    });
}

//Función para obtener las recetas locales y cargarlas en la página principal
export async function getRecipes() {
    try {
        const response = await fetch('../data/recipes.json');  // Ruta relativa al archivo JSON
        const recipes = await response.json();  // Se parsea la respuesta como JSON
        return recipes;
    } catch (error) {
        console.error("Error al obtener las recetas:", error);
    }
}