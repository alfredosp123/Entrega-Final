// Sección de preguntas y historial
let preguntas = [];
let historial = JSON.parse(localStorage.getItem('historial')) || [];
let preguntaActual = 0;
let score = 0;
let resultados = [];
let timer;
let nombreCompleto;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('comenzarBtn').addEventListener('click', comenzarCuestionario);
    document.getElementById('agregarBtn').addEventListener('click', mostrarFormulario);
    document.getElementById('borrarBtn').addEventListener('click', borrarPreguntas);
    document.getElementById('agregarPreguntaBtn').addEventListener('click', agregarPregunta);
    document.getElementById('volverFormularioBtn').addEventListener('click', volverInicioDesdeFormulario);
    document.getElementById('volverBtn').addEventListener('click', volverInicio);
    document.getElementById('cerrarBtn').addEventListener('click', cerrarCuestionario);
    document.getElementById('verHistorialBtn').addEventListener('click', verHistorial);
    document.getElementById('volverInicioDesdeHistorialBtn').addEventListener('click', volverInicioDesdeHistorial);
    cargarPreguntasDesdeArchivo();
    document.getElementById('borrarHistorialBtn').addEventListener('click', borrarHistorial);
});

function cargarPreguntasDesdeArchivo() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            preguntas = data;
        })
        .catch(error => console.error('Error al cargar las preguntas desde el archivo JSON:', error));
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
        resultados.push({ pregunta: currentQuestion.pregunta, correcto: true });
    } else {
        resultados.push({ pregunta: currentQuestion.pregunta, correcto: false, respuestaCorrecta: currentQuestion.respuesta });
    }
    preguntaActual++;
    clearInterval(timer);
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
    document.getElementById("inicio").style.display = "none";
    document.getElementById("formulario").style.display = "block";
}

function volverInicioDesdeFormulario() {
    document.getElementById("formulario").style.display = "none";
    document.getElementById("inicio").style.display = "flex";
}

function agregarPregunta() {
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
}

function borrarPreguntas() {
    preguntas = [];
    guardarPreguntas();
    document.getElementById("mensajeInicio").textContent = "Todas las preguntas han sido borradas.";
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
    document.getElementById("mensajeNombre").textContent = '';
    document.getElementById("mensajeInicio").textContent = '';
    document.getElementById("mensajeFormulario").textContent = '';
}

function borrarHistorial() {
    historial = [];
    guardarHistorial();
    document.getElementById('mensajeInicio').textContent = "El historial ha sido borrado.";
}