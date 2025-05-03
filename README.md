# Inclusive Cookbook made specifically for people with visual discapacities.

### Eng:

<h2>Inclusive Cookbook</h2>

Made in <b>Vanilla JavaScript</b> with the <b>Web Speech API</b> (SpeechSynthesisUtterance for reading and webkitSpeechRecognition for voice recording), following the <b>Web Content Accessibility Guidelines (WCAG)</b> to accommodate people with partial or complete vision impairments.

The cookbook contains <b>three types of pages</b>:

<h3>Index</h3>
This is an initial explanatory page, where you can navigate using the tab key and try out the filtered voices in the selector.

<h3>Main</h3>
Once you choose the voice (or the absence of a voice for silent reading), the button redirects to the main page with the recipe categories and the recipe search.

The search engine allows you to record your voice or type words, reads what's available using the corresponding button, and plays the recipe list, if available, using the corresponding button. The search engine filters whether the word(s) entered match the recipe's title, category, or keyword(s).

Another option is to expand the accordions and access the recipes from the different categories.

<h3>Recipe</h3>
Once you click on the link for the chosen recipe, the next page is dynamically populated with the recipe's content, obtained from SessionStorage. You can read the recipe, structured with its description, steps, difficulty, servings, and ingredients, and return to the main page to go to another recipe.

<b>All recipes and their photos were created by a professional chef in collaboration with me</b>.

The page has a minimalist style to avoid eye strain and adapts to any device (responsive).
___
### Esp:

<h2>Recetario inclusivo</h2> 

Realizado en <b>JavaScript Vainilla</b> con la API de <b>Web Speech API</b> (SpeechSynthesisUtterance para la lectura y webkitSpeechRecognition para la grabación de voz) siguiendo las directrices de accesibilidad de <b>Web Content Accessibility Guidelines (WCAG)</b> para adaptarla a dificultades parciales o totales de la visión.

El recetario contiene <b>tres tipos de páginas</b>:

<h3>Index</h3>
Es una página explicativa inicial, en la que puedes navegar con el tabulador y probar las voces filtradas en el selector. 

<h3>Main</h3>
Una vez decides la voz (o la ausencia para que la página se lea en silencio), el botón redirecciona a la página principal con las categorías de las recetas y el buscador de las mismas.

El buscador permite grabar tu voz o escribir palabras, lee lo que hay con el botón correspondiente, y reproduce el listado de recetas en caso de haberlas con el botón correspondiente. El buscador filtra si la palabra o palabras introducidas coinciden con el título, categoría o palabra/s clave/s que contenga la receta.

Otra opción es desplegar los acordeones y acceder a las recetas de las diferentes categorías.

<h3>Receta</h3>
Una vez se pulsa en el enlace de la receta escogida, se rellena la siguiente página de forma dinámica con el contenido de la misma, obtenido del SessionStorage, se puede leer la receta, estructurada con su descripción, pasos, dificultad, comensales e ingredientes, y volver a la página principal para ir a otra receta.

<b>Todas las recetas y fotos de las mismas están realizadas por un chef profesional en colaboración conmigo.</b>

La página tiene un estilo minimalista para evitar la fatiga visual, se adapta a cualquier dispositivo.
