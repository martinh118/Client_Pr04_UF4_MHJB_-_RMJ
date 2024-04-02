
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

document.getElementById("prev").addEventListener("click", () => {
    let libro = document.getElementById("idLibro").value
    let numPag = document.getElementById("numPag").value

    pedirLibro(libro, parseInt(numPag) - 1)
})

document.addEventListener("keydown", function (event) {
    let libro = document.getElementById("idLibro").value
    let numPag = document.getElementById("numPag").value
    let isLast= document.getElementById("next").disabled

    if (event.key === "ArrowLeft" && numPag != 0)pedirLibro(libro, parseInt(numPag) - 1)
    if (event.key === "ArrowRight" && !isLast) pedirLibro(libro, parseInt(numPag) + 1)

});

document.getElementById("next").addEventListener("click", () => {
    let libro = document.getElementById("idLibro").value
    let numPag = document.getElementById("numPag").value

    pedirLibro(libro, parseInt(numPag) + 1)
})

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
            console.log(data)
            if(data['ultimaPag'] == true){
                document.getElementById("next").disabled = true;
            }else document.getElementById("next").disabled = false;

            let pagina = data['pagina'].substring(data['pagina'].indexOf("</head>"), data['pagina'].indexOf("</html>"))

            document.getElementById("area").innerHTML = "";
            document.getElementById("area").innerHTML = pagina;
            document.getElementById("tablaLibros").hidden = true;
            document.getElementById("idLibro").setAttribute("value", libro)
            document.getElementById("numPag").setAttribute("value", numPag)

            if (numPag != 0)document.getElementById("prev").disabled = false;
            else document.getElementById("prev").disabled = true
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
