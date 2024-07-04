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
        pregunta: "¿Cómo se dice 'Arbol' en inglés?",
        opciones: ["Palm", "Dance", "Tree", "Shoes"],
        respuesta: "Tree"
    }
];

let preguntaActual = 0;
let score = 0;

function comenzarCuestionario() {
    console.log("Bienvenido al cuestionario de preguntas en inglés.");
    console.log("Responde ingresando el número de la opción correcta.");
    cargarPreguntas();
}

function cargarPreguntas() {
    if (preguntaActual < preguntas.length) {
        const currentQuestion = preguntas[preguntaActual];
        console.log(`Pregunta ${preguntaActual + 1}: ${currentQuestion.pregunta}`);
        currentQuestion.opciones.forEach((option, index) => {
            console.log(`${index + 1}: ${option}`);
        });

        const userRespuesta = prompt(`Pregunta ${preguntaActual + 1}: ${currentQuestion.pregunta}\n${currentQuestion.opciones.map((option, index) => `${index + 1}: ${option}`).join('\n')}\nIngresa el número de la opción correcta:`);
        check(userRespuesta);
    } else {
        mostrarResultado();
    }
}

function check(respuesta) {
    const currentQuestion = preguntas[preguntaActual];
    const selectedOption = currentQuestion.opciones[respuesta - 1];
    if (selectedOption === currentQuestion.respuesta) {
        console.log("¡Correcto!");
        score++;
    } else {
        console.log(`Incorrecto. La respuesta correcta es: ${currentQuestion.respuesta}`);
    }
    preguntaActual++;
    cargarPreguntas();
}

function mostrarResultado() {
    console.log(`¡Has terminado! Tu puntaje es ${score} de ${preguntas.length}.`);
}

comenzarCuestionario();