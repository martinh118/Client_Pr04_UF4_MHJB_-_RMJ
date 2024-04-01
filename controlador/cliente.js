
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

function mostrarLibrosTabla(libreria) {
    let html = "";
    for (const libro of libreria) {
        html += `<tr>
            <td id='${libro['id']}' class='libro'>${libro['name']}</td>
        </tr>`;
    }

    $("#bodyLibros").html(html);
}

function pedirLibro(libro, numPag) {
    fetch('http://localhost:8080/', { method: 'POST', body: JSON.stringify({ "accion": "visualizar", 'idLibro': libro, "numPag": numPag }) })
        .then(async (response) => {
            // Verificar si la solicitud fue exitosa
            if (!response.ok) {
                throw new Error('Error al obtener el archivo JSON');
            }
            return await response.json();
        })
        .then(data => {
            document.getElementById("area").innerHTML = "";

            let pagina = data.substring(data.indexOf("</head>"), data.indexOf("</html>"))

            document.getElementById("area").innerHTML = pagina;
            document.getElementById("tablaLibros").hidden = true;

            document.getElementById("prev").removeEventListener("click", () => { pedirLibro(libro, numPag - 1) })
            document.getElementById("next").removeEventListener("click", () => { pedirLibro(libro, numPag + 1) })

            if (numPag != 0) {

                document.getElementById("prev").disabled = false;
                document.getElementById("prev").addEventListener("click", () => { pedirLibro(libro, numPag - 1) })

            } else document.getElementById("prev").disabled = true

            document.getElementById("next").addEventListener("click", () => { pedirLibro(libro, numPag + 1) })

            console.log(numPag)
        })
        .catch(error => {
            // Capturar y manejar cualquier error
            console.error('Error:', error);
        });
}

document.getElementById("cerrarLibro").addEventListener("click", () => location.href = "")

function borrarLibro(id) {
    fetch('http://localhost:8080/', { method: 'DELETE', body: JSON.stringify({ "accion": "borrar", "identificador": id }) })
        .then(response => {
            // Verificar si la solicitud fue exitosa
            if (!response.ok) {
                throw new Error('Error al obtener el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            // Hacer algo con los datos obtenidos
            console.log(data);
            aplicarBodyTabla(data);
        })
        .catch(error => {
            // Capturar y manejar cualquier error
            console.error('Error:', error);
        });
}


$(document).ready(function () {
    $("tbody").on("click", "td.libro", function (ev) {
        let idLibro = ev.target.id;
        $("#botonesControlLibro").removeAttr("hidden");

        pedirLibro(idLibro, 0);
    });
});


window.onload = pedirLibreria;
