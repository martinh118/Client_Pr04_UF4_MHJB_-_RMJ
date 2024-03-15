import * as fs from 'fs';
import * as HTTP from 'http';

function onRequest(peticio, resposta) {
    console.log(peticio.method + ": " + peticio.url);

    const base = 'http://' + peticio.headers.host + '/';
    const url = new URL(peticio.url, base);

    if (peticio.url == "/" && peticio.method == "GET") {

        console.log("Enviant index.html");

        fs.readFile("index.html", function (err, dades) {
            let cType = "html";
            header(resposta, 200, cType);
            resposta.end(dades);
        });
    }
}

function header(resposta, codi, cType) {
    resposta.setHeader('Access-Control-Allow-Origin', '*');
    resposta.setHeader('Access-Control-Allow-Methods', 'GET');
    if (cType) resposta.writeHead(codi, { 'Content-Type': cType + '; charset=utf-8' });
    else resposta.writeHead(codi);
}

const server = HTTP.createServer();
server.on('request', onRequest);

server.listen(8080);
console.log("Servidor escoltant en http://localhost:8080");