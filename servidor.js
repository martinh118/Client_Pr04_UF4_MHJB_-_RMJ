const HTTP = require('http');

function onRequest(peticio, resposta) {
	console.log(peticio.method + ": " + peticio.url);

	// Mostrar paràmetres rebuts en la URL (GET)
	const base = 'http://' + peticio.headers.host + '/';
	const url = new URL(peticio.url, base);
	

    switch (perticio.url) {
        case "/":
            resposta.statusCode = 200;
            resposta.setHeader('Content-Type', 'text/html');
            resposta.end('Hello World!<br>' + url.searchParams);
            console.log("------");
            break;
    
        default:
            break;
    }
	// Generar i enviar resposta
	
}

const server = HTTP.createServer();
server.on('request', onRequest);

server.listen(8080);
console.log("Servidor escoltant en http://localhost:8080");