fetch('http://localhost:8080', { method: 'POST', body: JSON.stringify({ "accion": "esborrar", "identificador": id }) })
.then(response => {
    // Verificar si la solicitud fue exitosa
    if (!response.ok) {
        throw new Error('Error al obtener el archivo JSON');
    }
    // Parsear la respuesta como JSON
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