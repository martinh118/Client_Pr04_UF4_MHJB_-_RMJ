function verLibro() {
    fetch('http://localhost:8080/', { method: 'POST', body: JSON.stringify({ "accion": "visualizar" }) })
        .then(response => {
            // Verificar si la solicitud fue exitosa
            if (!response.ok) {
                throw new Error('Error al obtener el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            // Hacer algo con los datos obtenidos
            console.log(JSON.parse(data));
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

verLibro();