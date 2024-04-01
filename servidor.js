import { promises as fsPromise } from 'fs';
import * as fs from 'fs';
import * as HTTP from 'http';
import { google } from 'googleapis';
import JSZip from 'jszip';
import IncomingForm from 'formidable';
import { parseString } from 'xml2js';
import { Stream } from "stream"

const libroID = "1bjZDqVLMGMNdQuIeTpBONE7yMcPeTlF2"
const carpetaArrelID = "1Lod7g3tfVG_5njZCUW-EnkxY_zTAAaAG"
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentialsAdmin.json',
    scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

//Peticiones
function onRequest(peticio, resposta) {
    let cosPeticio = "";

    const phct = peticio.headers['content-type'];
    if (phct && phct.includes("multipart/form-data")) {
        const form = IncomingForm();
        form.parse(peticio, async function (err, fields, files) {
            if (fields.epub) {
                console.log("empezando")
                const temporal = files.archivoEpub[0].filepath;
                const actual = './' + files.archivoEpub[0].originalFilename;
                fs.copyFileSync(temporal, actual);
                fs.unlinkSync(temporal);

                const driveResponse = await drive.files.create({
                    requestBody: {
                        name: files.archivoEpub[0].originalFilename.replaceAll("_", " ").replace(".epub", ""),
                        mimeType: "application/epub",
                        parents: [carpetaArrelID]
                    },
                    media: {
                        mimeType: "application/epub",
                        body: fs.createReadStream(actual)
                    },
                    fields: 'id, name'
                });
                let datosRespuesta = driveResponse.status
                missatgeResposta(resposta, JSON.stringify(datosRespuesta), 'application/json');
                console.log("Archivo subido correctamente")
                fs.unlinkSync(actual);
            }
        });
    } else

        peticio.on('error', function (err) {
            console.error(err);
        }).on('data', function (dades) {
            cosPeticio += dades;
        }).on('end', async function () {
            resposta.on('error', function (err) {
                console.error(err);
            });

            const base = 'http://' + peticio.headers.host + '/';
            const url = new URL(peticio.url, base);

            let filename = "." + url.pathname;
            if (filename == "./") filename += "vista/index.html";
            if (peticio.method == "GET" && peticio.url.indexOf("?") == -1) {

                if (fs.existsSync(filename)) {

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


            } else {
                let datosRespuesta;
                const phct = peticio.headers['content-type'];
                if (phct && phct.includes("multipart/form-data")) {

                    console.log(typeof cosPeticio)
                    const fas = fs.createWriteStream("./prueba.epub")
                    fas.write(peticio)

                } else {

                    let objectPeticion = JSON.parse(cosPeticio);

                    switch (objectPeticion["accion"]) {
                        case "visualizar":

                            const urlLibro = "./libros_epub/" + objectPeticion["idLibro"] + ".epub";

                            if (!fs.existsSync(urlLibro)) {
                                const libroEpubDrive = await drive.files.get({
                                    fileId: objectPeticion["idLibro"],
                                    alt: 'media'
                                }, {
                                    responseType: "stream"
                                });
                                const f = fs.createWriteStream("./libros_epub/" + objectPeticion["idLibro"] + ".epub",)
                                libroEpubDrive.data.pipe(f).on("finish", async () => {
                                    await descomprimirLibro(urlLibro);

                                    let pagLibro = fs.readdirSync("./libros/" + objectPeticion["idLibro"]).sort((a, b) => {
                                        if (a > b) {
                                            return -1;
                                        }
                                        if (a < b) {
                                            return 1;
                                        }
                                    });
                                    console.log(pagLibro)
                                    let pagina = fs.readFileSync("./libros/" + objectPeticion["idLibro"] + "/" + pagLibro[objectPeticion["numPag"]])
    
                                    datosRespuesta = pagina.toString();
                                })


                            } else {

                                let pagLibro = fs.readdirSync("./libros/" + objectPeticion["idLibro"]).sort((a, b) => {
                                    if (a > b) {
                                        return -1;
                                    }
                                    if (a < b) {
                                        return 1;
                                    }
                                });
                                console.log(pagLibro)
                                let pagina = fs.readFileSync("./libros/" + objectPeticion["idLibro"] + "/" + pagLibro[objectPeticion["numPag"]])

                                datosRespuesta = pagina.toString();
                            }
                            missatgeResposta(resposta, JSON.stringify(datosRespuesta), 'application/json');
                            break;

                        case "libreria":
                            //Get FILES

                            const driveResponseL = await drive.files.list({
                                q: `parents in '${carpetaArrelID}' and trashed=false`,
                                fields: 'files(id, name)'
                            });
                            datosRespuesta = driveResponseL.data.files;
                            missatgeResposta(resposta, JSON.stringify(datosRespuesta), 'application/json');

                            break;
                        case "eliminarLibro":

                            const driveResponseD = drive.files.delete({
                                fileId: objectPeticion["idLibro"]
                            });

                            break;
                        default:
                            break;
                    }
                }
            }
        });
}

async function descomprimirLibro(urlLibro) {

    // Lee el archivo EPUB
    const contenidoLibro = await fsPromise.readFile(urlLibro);

    // Crea una instancia de JSZip
    const zip = new JSZip();
    // Carga el contenido del archivo EPUB en JSZip
    const zipContents = await zip.loadAsync(contenidoLibro);

    // Procesa los archivos descomprimidos
    const archivosPromises = [];
    zipContents.forEach((relativePath, file) => {
        // Agrega la promesa de leer el contenido del archivo al arreglo de promesas
        archivosPromises.push(
            file.async("string").then((content) => {
                return {
                    nombre: relativePath,
                    contenido: content
                };
            })
        );
    });

    // Espera a que todas las promesas de lectura se resuelvan
    const archivos = await Promise.all(archivosPromises);

    let data;

    parseString(archivos[archivos.length - 1].contenido, function (err, results) {
        data = results.ncx.navMap[0].navPoint[0].content[0].$.src

    })

    if (!fs.existsSync("./libros/" + urlLibro.split("/")[2].split(".")[0])) {

        fs.mkdirSync("./libros/" + urlLibro.split("/")[2].split(".")[0])
        console.log(archivos.filter((archivo)=> archivo.nombre=="toc.ncx"))
        for (let i = 0; i < archivos.length; i++) {
            const archivo = archivos[i];
            console.log(archivo.nombre)
            if (archivo.nombre.indexOf("OEBPS/Text/") != -1) {
                if (archivo.nombre != "OEBPS/Text/") {

                    const fas = fs.createWriteStream("./libros/" + urlLibro.split("/")[2].split(".")[0] + "/" + archivo.nombre.split("/")[2])
                    fas.write(archivo.contenido)

                }
            }
        }
    }
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



const server = HTTP.createServer();
server.on('request', onRequest);
server.listen(8080);
console.log("Servidor escoltant en http://localhost:8080");