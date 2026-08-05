/**
 * Copia al portapapeles el contenido del bloque de código asociado
 * al botón presionado.
 *
 * @param {HTMLButtonElement} button Botón que ejecutó la acción.
 */
async function copyCode(button) {
    // Busca el contenedor principal del bloque de código.
    const container = button.closest(".code-copy-container");

    // Busca el elemento <code> ubicado dentro del <pre>.
    const codeElement = container.querySelector("pre code");

    // Obtiene únicamente el texto del código, sin etiquetas HTML.
    const code = codeElement.textContent;

    try {
        // Intenta copiar el código usando la API moderna del portapapeles.
        await navigator.clipboard.writeText(code);

        // Guarda el texto original del botón para restaurarlo después.
        const originalText = button.textContent;

        // Muestra al usuario que la copia fue exitosa.
        button.textContent = "Código copiado";

        // Aplica el estilo visual de éxito.
        button.classList.add("copied");

        // Elimina un posible estilo previo de error.
        button.classList.remove("copy-error");

        // Después de dos segundos, restaura el estado original del botón.
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove("copied");
        }, 2000);
    } catch (error) {
        // Si la API moderna falla o no está disponible,
        // utiliza el método alternativo de copia.
        fallbackCopyCode(code, button);
    }
}

/**
 * Copia texto al portapapeles utilizando un elemento <textarea>
 * temporal y document.execCommand("copy").
 *
 * Este método sirve como alternativa para navegadores o contextos
 * donde navigator.clipboard no está disponible.
 *
 * @param {string} code Código que se desea copiar.
 * @param {HTMLButtonElement} button Botón que ejecutó la acción.
 */
function fallbackCopyCode(code, button) {
    // Crea un textarea temporal para contener el código.
    const textarea = document.createElement("textarea");

    // Coloca el código dentro del textarea.
    textarea.value = code;

    // Posiciona el textarea fuera del área visible.
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

    // Agrega temporalmente el textarea al documento.
    document.body.appendChild(textarea);

    // Coloca el foco en el textarea.
    textarea.focus();

    // Selecciona todo su contenido.
    textarea.select();

    try {
        // Intenta copiar el contenido seleccionado.
        const copied = document.execCommand("copy");

        // Si el navegador indica que la copia falló,
        // genera un error para ejecutar el bloque catch.
        if (!copied) {
            throw new Error("El navegador rechazó la copia.");
        }

        // Guarda el texto original del botón.
        const originalText = button.textContent;

        // Muestra el mensaje de copia exitosa.
        button.textContent = "Código copiado";

        // Aplica el estilo visual de éxito.
        button.classList.add("copied");

        // Elimina un posible estilo previo de error.
        button.classList.remove("copy-error");

        // Restaura el botón después de dos segundos.
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove("copied");
        }, 2000);
    } catch (error) {
        // Muestra un mensaje cuando tampoco funciona el método alternativo.
        button.textContent = "No se pudo copiar";

        // Aplica el estilo visual de error.
        button.classList.add("copy-error");

        // Elimina un posible estilo previo de éxito.
        button.classList.remove("copied");

        // Restaura el botón después de dos segundos.
        setTimeout(() => {
            button.textContent = "Copiar código";
            button.classList.remove("copy-error");
        }, 2000);
    } finally {
        // Elimina siempre el textarea temporal del documento,
        // tanto si la copia fue exitosa como si ocurrió un error.
        document.body.removeChild(textarea);
    }
}