const preguntas = [
    {
        pregunta: "¿Cómo se dice 'manzana' en inglés?",
        opciones: ["Apple", "Banana", "Orange", "Grapes"],
        respuesta: "Apple"
    },
    {
        pregunta: "¿Cómo se dice 'libro' en inglés?",
        opciones: ["Pen", "Notebook", "Book", "Pencil"],
        respuesta: "Book"
    },
    {
        pregunta: "¿Cómo se dice 'casa' en inglés?",
        opciones: ["Car", "House", "Tree", "Window"],
        respuesta: "House"
    },
    {
        pregunta: "¿Cómo se dice 'perro' en inglés?",
        opciones: ["Cat", "Horse", "paste", "Dog"],
        respuesta: "Dog"
    },
    {
        pregunta: "¿Cómo se dice 'Árbol' en inglés?",
        opciones: ["Palm", "Dance", "Tree", "Shoes"],
        respuesta: "Tree"
    }
];

let preguntaActual = 0;
let score = 0;
let resultados = [];

function comenzarCuestionario() {
    document.getElementById("inicio").style.display = "none";
    document.getElementById("cuestionario").style.display = "block";
    cargarPreguntas();
}

function cargarPreguntas() {
    if (preguntaActual < preguntas.length) {
        const currentQuestion = preguntas[preguntaActual];
        document.getElementById("pregunta").textContent = `Pregunta ${preguntaActual + 1}: ${currentQuestion.pregunta}`;
        document.getElementById("opciones").innerHTML = currentQuestion.opciones.map((option, index) => 
            `<button onclick="check(${index + 1})">${index + 1}: ${option}</button>`
        ).join('');
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
    document.getElementById("score").textContent = `¡Has terminado! Tu puntaje es ${score} de ${preguntas.length}.`;
    document.getElementById("detalle").innerHTML = resultados.map((resultado, index) =>
        `<p>Pregunta ${index + 1}: ${resultado.pregunta} - ${resultado.correcto ? "Correcto" : `Incorrecto. Respuesta correcta: ${resultado.respuestaCorrecta}`}</p>`
    ).join('');
}

let timer;
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

function ocultarFormulario() {
    document.getElementById("formulario").style.display = "none";
    document.getElementById("inicio").style.display = "block";
}

function agregarPregunta() {
    const pregunta = document.getElementById("nuevaPregunta").value.trim();
    const opcion1 = document.getElementById("opcion1").value.trim();
    const opcion2 = document.getElementById("opcion2").value.trim();
    const opcion3 = document.getElementById("opcion3").value.trim();
    const opcion4 = document.getElementById("opcion4").value.trim();
    const respuesta = document.getElementById("respuestaCorrecta").value.trim();
    
    if (pregunta === "" || opcion1 === "" || opcion2 === "" || opcion3 === "" || opcion4 === "" || respuesta === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const nuevaPregunta = {
        pregunta,
        opciones: [opcion1, opcion2, opcion3, opcion4],
        respuesta
    };

    preguntas.push(nuevaPregunta);

    document.getElementById("nuevaPreguntaForm").reset();
    alert("Pregunta agregada exitosamente");
}

function volverInicio() {
    document.getElementById("resultado").style.display = "none";
    document.getElementById("inicio").style.display = "block";
    preguntaActual = 0;
    score = 0;
    resultados = [];
}

function cerrarCuestionario() {
    window.close();
}

function borrarPreguntas() {
    if (confirm("¿Estás seguro de que deseas borrar todas las preguntas?")) {
        preguntas.length = 0;
        alert("Todas las preguntas han sido borradas.");
    }
}
