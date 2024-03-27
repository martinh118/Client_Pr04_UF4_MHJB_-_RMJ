const form = document.forms.namedItem("fileinfo");

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
    function (ev) {
        const fd = new FormData(document.forms.namedItem("fileinfo"));
        // fd.append("accion", "importarLibro");
        fd.get("archivoEpub");

        $.ajax({
            url: "http://localhost:8080/",
            method: "POST",
            data: fd,
            contentType: false,
            processData: false,
            success: function(data) {
                alert(JSON.parse(data));
            },
            error: function (data) {
                alert(data.missatge);
            }
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