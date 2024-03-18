fetch('http://localhost:8080', { method: 'GET' })
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
function verLibro(id){
    fetch('http://localhost:8080/libro?id='+id, { method: 'GET' })
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

function borrarLibro(id){
    fetch('http://localhost:8080/libro/', { method: 'DELETE', body: JSON.stringify({ "accion": "borrar", "identificador": id }) })
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