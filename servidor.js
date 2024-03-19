import * as fs from 'fs';
import * as HTTP from 'http';
import { google } from 'googleapis';


const carpetaArrelID="1Lod7g3tfVG_5njZCUW-EnkxY_zTAAaAG"
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentialsAdmin.json',
    scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({version: 'v3', auth});



/* (async () => {
    const driveResponse = await drive.files.create({
        requestBody: {
            name: "El Arte de ka guerra",
            mimeType: "application/epub",
            parents: [carpetaArrelID]
        },
        media: {
            mimeType: "application/epub",
            body: fs.createReadStream("./libros_epub/El_arte_de_la_guerra-Sun_Tzu.epub")
        },
        fields: 'id, name'
    });
    console.log(driveResponse.data.files);
})().catch(e => {
    console.log(e);
}); */ 

//Get FILES
(async () => {
    const driveResponse = await drive.files.list({
        q: `parents in '${carpetaArrelID}' and trashed=false`,
        fields: 'files(id, name)'
    });
    console.log(driveResponse.data.files);
})().catch(e => {
    console.log(e);
}); 

//Peticiones
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
        if (filename == "./") filename += "vista/index.html";
        if (peticio.method == "GET" && peticio.url.indexOf("?") == -1) {

            if (fs.existsSync(filename)) {
                //console.log("Enviant " + filename);

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
        } else if (peticio.url.indexOf("libro") != -1) {

            let objectPeticion = JSON.parse(cosPeticio);
            let datosRespuesta;
            switch (objectPeticion["accion"]) {
                case "visualizar":

                    break;

                default:
                    break;
            }

            //missatgeResposta(resposta, JSON.stringify(datosRespuesta), 'application/json');
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
    epub: "application/epub"
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


function missatgeResposta(resposta, dades, cType) {
    header(resposta, 200, cType);
    resposta.end(dades);
}

// Función para extraer las páginas del EPUB
function extractPages(epubFilePath, callback) {
    const epub = new EPub(epubFilePath);

    epub.on('end', function () {
        const pages = epub.flow.map((page, index) => page);
        callback(null, pages);
    });

    epub.parse();
}

const server = HTTP.createServer();
server.on('request', onRequest);

server.listen(8080);
console.log("Servidor escoltant en http://localhost:8080");