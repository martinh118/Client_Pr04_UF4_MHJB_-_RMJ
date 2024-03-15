import * as fs from 'fs';
import * as HTTP from 'http';

function onRequest(peticio, resposta) {
    let cosPeticio = "";

    peticio.on('error', function (err) {
        console.error(err);
    }).on('data', function (dades) {
        cosPeticio += dades;
    }).on('end', function () {
        resposta.on('error', function (err) {
            console.error(err);
        });

        const base = 'http://' + peticio.headers.host + '/';
        const url = new URL(peticio.url, base);

        let filename = "." + url.pathname;
        if (filename == "./") filename += "index.html";
        if (peticio.method == "GET" && peticio.url.indexOf("?")==-1) {
            if (fs.existsSync(filename)) {
                console.log("Enviant " + filename);

                fs.readFile(filename, function (err, dades) {
                    let cType = tipusArxiu(filename);

                    if (err) missatgeError(resposta, 400, "Error al llegir l'arxiu " + filename);
                    else if (!cType) missatgeError(resposta, 400, "Extensió d'arxiu desconeguda: " + filename);
                    else {
                        header(resposta, 200, cType);
                        resposta.end(dades);
                    }
                });
            }
            else missatgeError(resposta, 404, "Not Found (" + filename + ")");
        }else {
            
        }
    });
}

function header(resposta, codi, cType) {
    resposta.setHeader('Access-Control-Allow-Origin', '*');
    resposta.setHeader('Access-Control-Allow-Methods', 'GET');
    if (cType) resposta.writeHead(codi, { 'Content-Type': cType + '; charset=utf-8' });
    else resposta.writeHead(codi);
}

const FILE_TYPES = {
    html: "text/html",
    css: "text/css",
    js: "text/javascript",
    mjs: "text/javascript",
    svg: "image/svg+xml",
    png: "image/png",
    gif: "image/gif",
    ico: "image/ico",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
};

function tipusArxiu(filename) {
    let ndx = filename.lastIndexOf('.');
    if (ndx < 0) return undefined;

    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext.length == 0) return undefined;

    return FILE_TYPES[ext];
}

function missatgeError(resposta, cError, missatge) {
    header(resposta, cError, 'text/html');
    resposta.end("<p style='text-align:center;font-size:1.2rem;font-weight:bold;color:red'>" + missatge + "</p>");
    console.log("\t" + cError + " " + missatge);
}

const server = HTTP.createServer();
server.on('request', onRequest);

server.listen(8080);
console.log("Servidor escoltant en http://localhost:8080");