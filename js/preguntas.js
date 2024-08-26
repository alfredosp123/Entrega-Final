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

// variable para almacenar el índice de la pregunta que se está editando
let indicePreguntaEditando = null;

function mostrarPreguntasFormulario() {
    if (rol === 'profesor') {
        const contenido = preguntas.map((p, index) =>
            `<p>Pregunta ${index + 1}: ${p.pregunta} - Opciones: ${p.opciones.join(', ')}
                <button onclick="editarPregunta(${index})">Editar</button>
                <button onclick="eliminarPregunta(${index})">Eliminar</button>
            </p>`
        ).join('');
        document.getElementById('contenidoFormulario').innerHTML = contenido;
    }
}

function editarPregunta(index) {
    indicePreguntaEditando = index;
    const pregunta = preguntas[index];
    document.getElementById("editarPreguntaInput").value = pregunta.pregunta;
    document.getElementById("editarOpcion1").value = pregunta.opciones[0];
    document.getElementById("editarOpcion2").value = pregunta.opciones[1];
    document.getElementById("editarOpcion3").value = pregunta.opciones[2];
    document.getElementById("editarOpcion4").value = pregunta.opciones[3];
    document.getElementById("editarRespuestaCorrecta").value = pregunta.respuesta;

    document.getElementById("editarPreguntaModal").style.display = "block";
}

function guardarCambios() {
    if (indicePreguntaEditando !== null) {
        preguntas[indicePreguntaEditando] = {
            pregunta: document.getElementById("editarPreguntaInput").value.trim(),
            opciones: [
                document.getElementById("editarOpcion1").value.trim(),
                document.getElementById("editarOpcion2").value.trim(),
                document.getElementById("editarOpcion3").value.trim(),
                document.getElementById("editarOpcion4").value.trim()
            ],
            respuesta: document.getElementById("editarRespuestaCorrecta").value.trim()
        };
        guardarPreguntas();
        Swal.fire('Éxito', 'Pregunta editada exitosamente', 'success');
        mostrarPreguntasFormulario();
        document.getElementById("editarPreguntaModal").style.display = "none";
        indicePreguntaEditando = null;
    }
}

function eliminarPregunta(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará la pregunta seleccionada.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            preguntas.splice(index, 1);
            guardarPreguntas();
            Swal.fire('Éxito', 'Pregunta eliminada exitosamente', 'success');
            mostrarPreguntasFormulario();
        }
    });
}
