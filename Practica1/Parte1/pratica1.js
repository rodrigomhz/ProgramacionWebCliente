// Declarar variables fuera de la función
const botonAgregar = document.querySelector("#botonAgregar");
const inputTarea = document.querySelector("#tareas");
const listaTareas = document.querySelector("#listaTareas");

function crearTarea() {
    
    // Crear el contenedor de la tarea
    const nuevaTarea = document.createElement("div");//En base al div creado en el html creamos una lista de tareas
    nuevaTarea.classList.add("tarea");  // Creamos que una nuevatarea sea una lista, para añadirle las diferentes cosas

    // Crear el texto de la tarea
    const textoTarea = document.createElement("span");//El propio texto de la tarea
    textoTarea.textContent = inputTarea.value; //El valor que tenga el input, es decir, lo que el usuario escriba
 
    // Crear el botón de completar
    const botonCompletar = document.createElement("button");//Crea un boton
    botonCompletar.textContent = "Completar";//No es necesario guardar variables
    botonCompletar.onclick = function() {
        textoTarea.classList.toggle("completada");
    };

    // Crear el botón de eliminar
    const botonEliminar = document.createElement("button");//crea un boton
    botonEliminar.textContent = "Eliminar";//No es necesario guardar variables
    botonEliminar.onclick = function() {
        listaTareas.removeChild(nuevaTarea);//elimina la tarea
    };


    // Añadir los elementos dentro del contenedor
    nuevaTarea.appendChild(textoTarea);
    nuevaTarea.appendChild(botonCompletar);
    nuevaTarea.appendChild(botonEliminar);

    // Añadir la nueva tarea a la lista
    listaTareas.appendChild(nuevaTarea);

    // Limpiar el input
    inputTarea.value = "";
}
