// Función para obtener una pregunta aleatoria del archivo JSON
async function obtenerPreguntaAleatoria() {
    try {
        const response = await fetch('data/preguntas.json');
        const preguntasJSON = await response.json();
        if (preguntasJSON.length === 0) {
            throw new Error('No hay preguntas disponibles en el JSON.');
        }
        const indiceAleatorio = Math.floor(Math.random() * preguntasJSON.length);
        const preguntaSeleccionada = preguntasJSON[indiceAleatorio];
        agregarPreguntaAlCuestionario(preguntaSeleccionada);
    } catch (error) {
        console.error('Error al obtener la pregunta aleatoria:', error);
        Swal.fire('Error', 'No se pudo obtener la pregunta aleatoria.', 'error');
    }
}

// Función para agregar una pregunta al cuestionario
function agregarPreguntaAlCuestionario(preguntaSeleccionada) {
    if (rol !== 'profesor') {
        Swal.fire('Acceso Denegado', 'Solo los profesores pueden agregar preguntas aleatorias.', 'warning');
        return;
    }

    preguntas.push(preguntaSeleccionada);
    guardarPreguntas();
    Swal.fire('Éxito', 'Pregunta aleatoria agregada exitosamente.', 'success');
}