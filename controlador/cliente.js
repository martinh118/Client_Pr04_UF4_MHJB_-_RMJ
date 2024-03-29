
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

function mostrarLibrosTabla(libreria){
    let html = "";
    for (const libro of libreria) {
        html += `<tr>
            <td id='${libro['id']}' class='libro'>${libro['name']}</td>
        </tr>`;
    }

    $("#bodyLibros").html(html);
}

function pedirLibro(libro) {
    fetch('http://localhost:8080/', { method: 'POST', body: JSON.stringify({ "accion": "visualizar", 'idLibro': libro}) })
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
            let libro = data
            console.log(libro);
            var book = ePub(libro);
            mostrarLibro(book);
            //aplicarBodyTabla(data);
        })
        .catch(error => {
            // Capturar y manejar cualquier error
            console.error('Error:', error);
        });
}

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

function mostrarLibro(book) {
    var params = URLSearchParams && new URLSearchParams(document.location.search.substring(1));
    var url = params && params.get("url") && decodeURIComponent(params.get("url"));
    var currentSectionIndex = (params && params.get("loc")) ? params.get("loc") : undefined;

    
    let body = document.getElementById("area");
    var rendition = book.renderTo("viewer", {
        flow: "scrolled-doc"
    });
    rendition.display(currentSectionIndex);

    book.ready.then(() => {

        var next = document.getElementById("next");

        next.addEventListener("click", function (e) {
            book.package.metadata.direction === "rtl" ? rendition.prev() : rendition.next();
            e.preventDefault();
        }, false);

        var prev = document.getElementById("prev");
        prev.addEventListener("click", function (e) {
            book.package.metadata.direction === "rtl" ? rendition.next() : rendition.prev();
            e.preventDefault();
        }, false);

        var keyListener = function (e) {

            // Left Key
            if ((e.keyCode || e.which) == 37) {
                book.package.metadata.direction === "rtl" ? rendition.next() : rendition.prev();
            }

            // Right Key
            if ((e.keyCode || e.which) == 39) {
                book.package.metadata.direction === "rtl" ? rendition.prev() : rendition.next();
            }

        };

        rendition.on("keyup", keyListener);
        document.addEventListener("keyup", keyListener, false);

    })

    var title = document.getElementById("title");

    rendition.on("rendered", function (section) {
        var current = book.navigation && book.navigation.get(section.href);

        if (current) {
            var $select = document.getElementById("toc");
            var $selected = $select.querySelector("option[selected]");
            if ($selected) {
                $selected.removeAttribute("selected");
            }

            var $options = $select.querySelectorAll("option");
            for (var i = 0; i < $options.length; ++i) {
                let selected = $options[i].getAttribute("ref") === current.href;
                if (selected) {
                    $options[i].setAttribute("selected", "");
                }
            }
        }

    });

    rendition.on("relocated", function (location) {
        console.log(location);

        var next = book.package.metadata.direction === "rtl" ? document.getElementById("prev") : document.getElementById("next");
        var prev = book.package.metadata.direction === "rtl" ? document.getElementById("next") : document.getElementById("prev");

        if (location.atEnd) {
            next.style.visibility = "hidden";
        } else {
            next.style.visibility = "visible";
        }

        if (location.atStart) {
            prev.style.visibility = "hidden";
        } else {
            prev.style.visibility = "visible";
        }

    });

    rendition.on("layout", function (layout) {
        let viewer = document.getElementById("viewer");

        if (layout.spread) {
            viewer.classList.remove('single');
        } else {
            viewer.classList.add('single');
        }
    });

    window.addEventListener("unload", function () {
        console.log("unloading");
        this.book.destroy();
    });

    book.loaded.navigation.then(function (toc) {
        var $select = document.getElementById("toc"),
            docfrag = document.createDocumentFragment();

        toc.forEach(function (chapter) {
            var option = document.createElement("option");
            option.textContent = chapter.label;
            option.setAttribute("ref", chapter.href);

            docfrag.appendChild(option);
        });

        $select.appendChild(docfrag);

        $select.onchange = function () {
            var index = $select.selectedIndex,
                url = $select.options[index].getAttribute("ref");
            rendition.display(url);
            return false;
        };

    });

}


$(document).ready(function () {
    $("tbody").on("click", "td.libro", function (ev) {
        let idLibro = ev.target.id;
        $("#botonesControlLibro").removeAttr("hidden");
   
        pedirLibro(idLibro);
    });
});


window.onload = pedirLibreria;
