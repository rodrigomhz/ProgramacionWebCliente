const botonDescargar = document.querySelector("#btnDescargar");
const lista = document.querySelector("#lista");
async function descargarTodos(){
    const resp = await fetch('https://jsonplaceholder.typicode.com/todos');
    const todos = await resp.json();
    todos.slice(0,10).forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.title;
        lista.appendChild(li);
    });
}