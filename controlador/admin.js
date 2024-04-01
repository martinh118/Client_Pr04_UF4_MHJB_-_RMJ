const form = document.getElementById("formulari");

function pedirLibreria() {
    fetch('http://localhost:8080/', { method: 'POST', body: JSON.stringify({ "accion": "libreria" }) })
        .then(async (response) => {
            // Verificar si la solicitud fue exitosa
            if (!response.ok) {
                throw new Error('Error al obtener el archivo JSON');
            }
            let res = response.json();
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

function peticionEliminarLibro(idLibro) {
    fetch('http://localhost:8080/', { method: 'POST', body: JSON.stringify({ "accion": "eliminarLibro", "idLibro": idLibro }) })
        .then(async (response) => {
            // Verificar si la solicitud fue exitosa
            if (!response.ok) {
                throw new Error('Error al obtener el archivo JSON');
            }
            let res = response.json();
            return await res;
        })
        .then(data => {
            alert(data);
        })
        .catch(error => {
            // Capturar y manejar cualquier error
            console.error('Error:', error);
        });
}

function importarLibro(archivo) {
    fetch('http://localhost:8080/', { method: 'POST', body: archivo })
        .then(async (response) => {
            // Verificar si la solicitud fue exitosa
            if (!response.ok) {
                throw new Error('Error al obtener el archivo JSON');
            }
            let res = response.json();
            return await res;
        })
        .then(data => {
            alert(data);
        })
        .catch(error => {
            // Capturar y manejar cualquier error
            console.error('Error:', error);
        });
}

function mostrarLibrosTabla(libreria) {
    let html = "";
    for (const libro of libreria) {
        html += `<tr>
            <td id='${libro['id']}' class='libro'>${libro['name']}</td>
            <td  class='deleteLibro'><button id='${libro['id']}'>Eliminar llibre</button></td>
        </tr>`;
    }

    $("#bodyLibros").html(html);
}


form.addEventListener(
    "submit",
    async function (ev) {
        const archivoEpub = document.getElementById("archivoEpub")
        const form = document.getElementById("formulari");
        const fd = new FormData(form);
        console.log(archivoEpub.files[0].type)
        console.log(archivoEpub.files[0].name)

        console.log(await archivoEpub.files[0].arrayBuffer())
        fd.append("name", archivoEpub.files[0].name)
        fd.append("epub", await archivoEpub.files[0].text())
        fetch('http://localhost:8080/', {
            method: "POST",
            body: fd
        }).then(async (response) => {
            // Verificar si la solicitud fue exitosa
            if (!response.ok) {
                throw new Error('Error al obtener el archivo JSON');
            }
            let res = response.json();
            location.replace("../vista/administrador.html")
            alert("El archivo se subio correctamente")
            return await res;
        })
        .catch(error => {
            // Capturar y manejar cualquier error
            console.error('Error:', error);
        });

    },
    false,
);

$(document).ready(function () {
    $("tbody").on("click", "td.deleteLibro", function (ev) {
        if (confirm('Deseas continuar?')) {
            let idLibro = ev.target.id;
            peticionEliminarLibro(idLibro);
            location.replace("../vista/administrador.html")
        } else {
            alert('Operacion Cancelada');

        }

    });
});


window.onload = pedirLibreria;