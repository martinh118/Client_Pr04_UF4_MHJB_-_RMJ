export class DriveClient {
    #clientId;
    #clientSecret;
    #redirectUri;
    #refreshToken;
    #clienteDrive;

    constructor(_clientId, _clientSecret, _redirectUri, _refreshToken) {
        this.#clientId = _clientId;
        this.#clientSecret = _clientSecret;
        this.#redirectUri = _redirectUri;
        this.#refreshToken = _refreshToken;
        this.#clienteDrive = this.#crearCliente();
    }

    get clientId() {
        return this.#clientId;
    }

    get clientSecret() {
        return this.#clientSecret;
    }

    get redirectUri() {
        return this.#redirectUri;
    }

    get refreshToken() {
        return this.#refreshToken;
    }

    get clienteDrive() {
        return this.#clienteDrive;
    }

    #crearCliente() {
        try{
            const client = new google.auth.OAuth2(this.#clientId, this.#clientSecret, this.#redirectUri);
            client.setCredentials({ refresh_token: this.#refreshToken });
            return google.drive({ version: 'v3', auth: client });
        }catch(e){
            alert("Error crearCliente");
            console.log(e);
        }
        
    }


    static obtenerCarpetas(idCarpetaDrive) {
        try {
            let carpetas = [];
            let client = this.clienteDrive();
            let resultats = client.files.list({
                q: `mimeType='application/vnd.google-apps.folder' and parents in '${idCarpetaDrive}' and trashed=false`,
                fields: 'files(id, name)'
            });

            for (let a of resultats.data.files) {
                carpetas.push({ "nombre": a.name, "id": a.id });
                console.log(a.name + ": " + a.id);
            }

            return carpetas;

        } catch (e) {
            alert("Error obtenerCarpetas");
            console.log(e);
        }
    }

    static obtenirArxius(idCarpetaDrive, type) {
        try {
            let archivos = []
            let client = this.clienteDrive();
            if (type == "") {
                let resultats = client.files.list({
                    q: `parents in '${idCarpetaDrive}' and trashed=false`,
                    fields: 'files(id, name)'
                });

                for (let a of resultats.data.files) {
                    archivos.push({ "nombre": a.name, "id": a.id });
                    console.log(a.name + ": " + a.id);
                }

                return archivos;
            } else {
                let resultats = client.files.list({
                    q: `mimeType='${type}' and parents in '${idCarpetaDrive}' and trashed=false`,
                    fields: 'files(id, name)'
                });

                for (let a of resultats.data.files) {
                    archivos.push({ "nombre": a.name, "id": a.id });
                    console.log(a.name + ": " + a.id);
                }

                return archivos;
            }
        } catch (e) {
            alert("Error obtenirArxius");
            console.log(e);
        }
    }

    static guardarArxiu(rutaLocal, tipusMIME, idCarpetaDrive, nomArxiuDrive) {
        try {

        } catch (e) {
            alert("Error guardarArxiu");
            console.log(e);
        }
    }

    static esborrarArxiu(idArxiu) {
        try {

        } catch (e) {
            alert("Error esborrarArxiu");
            console.log(e);
        }
    }

    static crearCarpeta(idCarpetaDrive, nomCarpetaFilla) {
        try {

        } catch (e) {
            alert("Error crearCarpeta");
            console.log(e);
        }
    }

}
