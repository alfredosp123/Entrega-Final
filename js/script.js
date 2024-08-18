let preguntas = JSON.parse(localStorage.getItem('preguntas')) || [
    {
        pregunta: "¿Cómo se dice 'manzana' en inglés?",
        opciones: ["Apple", "Banana", "Orange", "Grapes"],
        respuesta: "Apple"
    }
];

let historial = JSON.parse(localStorage.getItem('historial')) || [];
let preguntaActual = 0;
let score = 0;
let resultados = [];
let timer;
let nombreCompleto;
let rol;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('seleccionarRolBtn').addEventListener('click', seleccionarRol);
    document.getElementById('cambiarRolBtn').addEventListener('click', cambiarRol);
    document.getElementById('comenzarBtn').addEventListener('click', comenzarCuestionario);
    document.getElementById('agregarBtn').addEventListener('click', mostrarFormulario);
    document.getElementById('borrarBtn').addEventListener('click', borrarPreguntas);
    document.getElementById('borrarHistorialBtn').addEventListener('click', borrarHistorial);
    document.getElementById('agregarPreguntaBtn').addEventListener('click', agregarPregunta);
    document.getElementById('volverFormularioBtn').addEventListener('click', volverInicioDesdeFormulario);
    document.getElementById('volverBtn').addEventListener('click', volverInicio);
    document.getElementById('cerrarBtn').addEventListener('click', cerrarCuestionario);
    document.getElementById('verHistorialBtn').addEventListener('click', verHistorial);
    document.getElementById('volverInicioDesdeHistorialBtn').addEventListener('click', volverInicioDesdeHistorial);
});

function seleccionarRol() {
    rol = document.getElementById('rol').value;
    localStorage.setItem('rol', rol);
    document.getElementById('rolSeleccion').style.display = 'none';
    document.getElementById('inicio').style.display = 'flex';
    actualizarBotones();
}

function cambiarRol() {
    document.getElementById('rolSeleccion').style.display = 'block';
    document.getElementById('inicio').style.display = 'none';
}

function actualizarBotones() {
    if (rol === 'alumno') {
        document.getElementById('agregarBtn').style.display = 'none';
        document.getElementById('borrarBtn').style.display = 'none';
        document.getElementById('borrarHistorialBtn').style.display = 'none';
    } else {
        document.getElementById('agregarBtn').style.display = 'inline-block';
        document.getElementById('borrarBtn').style.display = 'inline-block';
        document.getElementById('borrarHistorialBtn').style.display = 'inline-block';
    }
    document.getElementById('cambiarRolBtn').style.display = 'inline-block';
}

function guardarPreguntas() {
    localStorage.setItem('preguntas', JSON.stringify(preguntas));
}

function guardarHistorial() {
    localStorage.setItem('historial', JSON.stringify(historial));
}

function comenzarCuestionario() {
    nombreCompleto = document.getElementById('nombreCompleto').value.trim();
    const mensajeNombre = document.getElementById('mensajeNombre');
    
    if (nombreCompleto === "") {
        mensajeNombre.textContent = "Por favor, ingresa tu nombre completo.";
        return;
    }

    document.getElementById("inicio").style.display = "none";
    document.getElementById("cuestionario").style.display = "block";
    cargarPreguntas();
}

function cargarPreguntas() {
    if (preguntaActual < preguntas.length) {
        const currentQuestion = preguntas[preguntaActual];
        document.getElementById("pregunta").textContent = `Pregunta ${preguntaActual + 1}: ${currentQuestion.pregunta}`;
        document.getElementById("opciones").innerHTML = currentQuestion.opciones.map((option, index) => 
            `<button data-index="${index}">${index + 1}: ${option}</button>`
        ).join('');

        document.querySelectorAll('#opciones button').forEach(btn => {
            btn.addEventListener('click', (e) => check(parseInt(e.target.dataset.index) + 1));
        });

        startTimer();
    } else {
        mostrarResultado();
    }
}

function check(respuesta) {
    const currentQuestion = preguntas[preguntaActual];
    const selectedOption = currentQuestion.opciones[respuesta - 1];
    if (selectedOption === currentQuestion.respuesta) {
        score++;
        resultados.push({ pregunta: currentQuestion.pregunta, correcto: true, respuestaCorrecta: currentQuestion.respuesta });
    } else {
        resultados.push({ pregunta: currentQuestion.pregunta, correcto: false, respuestaCorrecta: currentQuestion.respuesta });
    }

    preguntaActual++;
    cargarPreguntas();
}

function mostrarResultado() {
    document.getElementById("cuestionario").style.display = "none";
    document.getElementById("resultado").style.display = "block";
    document.getElementById("score").textContent = `¡Has terminado, ${nombreCompleto}! Tu puntaje es ${score} de ${preguntas.length}.`;

    resultados.forEach(resultado => historial.push({
        nombre: nombreCompleto,
        pregunta: resultado.pregunta,
        correcto: resultado.correcto,
        respuestaCorrecta: resultado.respuestaCorrecta
    }));

    guardarHistorial();

    document.getElementById("detalle").innerHTML = resultados.map((resultado, index) =>
        `<p>Pregunta ${index + 1}: ${resultado.pregunta} - ${resultado.correcto ? "Correcto" : `Incorrecto. Respuesta correcta: ${resultado.respuestaCorrecta}`}</p>`
    ).join('');
}

function startTimer() {
    let timeLeft = 120;
    document.getElementById("timer").textContent = `Tiempo restante: ${timeLeft} segundos`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Tiempo restante: ${timeLeft} segundos`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            check(-1); // Autocheck si el tiempo se agota
        }
    }, 1000);
}

function mostrarFormulario() {
    if (rol === 'alumno') {
        alert('Solo los profesores pueden agregar preguntas.');
        return;
    }
    document.getElementById("inicio").style.display = "none";
    document.getElementById("formulario").style.display = "block";
    mostrarPreguntasFormulario(); // Mostrar preguntas existentes para previsualizar
}

function mostrarPreguntasFormulario() {
    if (rol === 'profesor') {
        const contenido = preguntas.map((p, index) =>
            `<p>Pregunta ${index + 1}: ${p.pregunta} - Opciones: ${p.opciones.join(', ')}</p>`
        ).join('');
        document.getElementById('contenidoFormulario').innerHTML = contenido;
    }
}

function volverInicioDesdeFormulario() {
    document.getElementById("formulario").style.display = "none";
    document.getElementById("inicio").style.display = "flex";
}

function agregarPregunta() {
    if (rol === 'alumno') {
        alert('Solo los profesores pueden agregar preguntas.');
        return;
    }

    const pregunta = document.getElementById("nuevaPregunta").value.trim();
    const opcion1 = document.getElementById("opcion1").value.trim();
    const opcion2 = document.getElementById("opcion2").value.trim();
    const opcion3 = document.getElementById("opcion3").value.trim();
    const opcion4 = document.getElementById("opcion4").value.trim();
    const respuesta = document.getElementById("respuestaCorrecta").value.trim();
    const mensajeFormulario = document.getElementById("mensajeFormulario");

    if (pregunta === "" || opcion1 === "" || opcion2 === "" || opcion3 === "" || opcion4 === "" || respuesta === "") {
        mensajeFormulario.textContent = "Por favor, completa todos los campos.";
        return;
    }

    const nuevaPregunta = {
        pregunta,
        opciones: [opcion1, opcion2, opcion3, opcion4],
        respuesta
    };

    preguntas.push(nuevaPregunta);
    guardarPreguntas();

    document.getElementById("nuevaPreguntaForm").reset();
    mensajeFormulario.textContent = "Pregunta agregada exitosamente";
    mostrarPreguntasFormulario(); // Actualizar vista de preguntas existentes
}

function borrarPreguntas() {
    if (rol === 'alumno') {
        alert('Solo los profesores pueden borrar preguntas.');
        return;
    }
    preguntas = [];
    guardarPreguntas();
    document.getElementById("mensajeInicio").textContent = "Todas las preguntas han sido borradas.";
}

function borrarHistorial() {
    if (rol === 'alumno') {
        alert('Solo los profesores pueden borrar el historial.');
        return;
    }
    historial = [];
    guardarHistorial();
    document.getElementById("mensajeInicio").textContent = "El historial ha sido borrado.";
}

function volverInicio() {
    document.getElementById("resultado").style.display = "none";
    document.getElementById("inicio").style.display = "flex";
    resetCuestionario();
}

function cerrarCuestionario() {
    document.getElementById("resultado").style.display = "none";
    document.getElementById("inicio").style.display = "flex";
    resetCuestionario();
}

function verHistorial() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("historial").style.display = "block";
    mostrarHistorial();
}

function mostrarHistorial() {
    document.getElementById("contenidoHistorial").innerHTML = historial.map(entry => 
        `<p>${entry.nombre} - Pregunta: ${entry.pregunta} - ${entry.correcto ? "Correcto" : `Incorrecto (Respuesta correcta: ${entry.respuestaCorrecta})`}</p>`
    ).join('');
}

function volverInicioDesdeHistorial() {
    document.getElementById("historial").style.display = "none";
    document.getElementById("inicio").style.display = "flex";
}

function resetCuestionario() {
    preguntaActual = 0;
    score = 0;
    resultados = [];
    clearInterval(timer);
    document.getElementById("timer").textContent = '';
}
