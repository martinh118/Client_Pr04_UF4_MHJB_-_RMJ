function pedirLibreria(){
    fetch('http://localhost:8080/', { method: 'POST', body: JSON.stringify({ "accion": "libreria"}) })
    .then(async (response) => {
        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            throw new Error('Error al obtener el archivo JSON');
        }
        let res=response.json();
        return await res;
    })
    .then(data => {
        // Hacer algo con los datos obtenidos
        let libreria = data;
        console.log(libreria);
        mostrarLibrosTabla(libreria);
        //aplicarBodyTabla(data);
    })
    .catch(error => {
        // Capturar y manejar cualquier error
        console.error('Error:', error);
    });
}

function peticionEliminarLibro(idLibro){
    fetch('http://localhost:8080/', { method: 'POST', body: JSON.stringify({ "accion": "eliminarLibro", "idLibro":idLibro}) })
    .then(async (response) => {
        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            throw new Error('Error al obtener el archivo JSON');
        }
        let res=response.json();
        return await res;
    })
    .then(data => {
        // Hacer algo con los datos obtenidos
        // pedirLibreria();
        //aplicarBodyTabla(data);
    })
    .catch(error => {
        // Capturar y manejar cualquier error
        console.error('Error:', error);
    });
}

function mostrarLibrosTabla(libreria){
    let html = "";
    for (const libro of libreria) {
        html += `<tr>
            <td id='${libro['id']}' class='libro'>${libro['name']}</td>
            <td  class='deleteLibro'><button id='${libro['id']}'>Eliminar llibre</button></td>
        </tr>`;
    }

    $("#bodyLibros").html(html);
}

$(document).ready(function () {
    $("tbody").on("click", "td.deleteLibro", function (ev) {
        let idLibro = ev.target.id;
        peticionEliminarLibro(idLibro);
        pedirLibreria();
    });
});


window.onload = pedirLibreria;