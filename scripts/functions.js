/*
    Función que "promesifica" una XMLHTTPRequest. Necesita de parametros minimos para funcionar, 
    solo la URL a ser consultada.
    Devuelve la respuesta en el formato especificado por el parametro responseType.

    Cuenta con valores por defecto para:
    - params: null. No envia parametros adicionales.
    - method: POST. 
    - responseType:  "". Respuesta tipo texto. En caso de elegir otro tipo de respuesta, es importante que 
    el header este configurado en el script del servidor.
    - header/headerValue: Array de headers. Por defecto: "Content-type: application/x-www-form-urlencoded". 
    MIME Header para la request, por defecto, formulario codificado para URL.

    Por el momento, funciona bien con metodos GET y POST. No ha sido probado con otros metodos.
*/
const httpRequestPromise = (url, params = null, method = 'POST', responseType="", headers = [ { header: 'Content-type', headerValue: 'application/x-www-form-urlencoded'} ]) => {
    return new Promise((resolve, reject) => {
        let httpRequest = new XMLHttpRequest();

        if (params && typeof params === 'object') {
            params = Object.keys(params).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            }).join('&');
        }

        if(method == 'GET') {
            url = url + '?' + params;
        }

        httpRequest.open(method, url, true);
        headers.forEach((header) => {
            httpRequest.setRequestHeader(header.header, header.headerValue);
        });
        
        httpRequest.onload = () => {
            if(httpRequest.status >= 200 && httpRequest.status < 300){
                resolve(httpRequest.response);
            } else {
                reject(httpRequest.statusText);
            }
        };
        httpRequest.onerror = () => {
            reject(httpRequest.statusText);
        };
        
        httpRequest.responseType = responseType;

        if(method == 'GET'){
            httpRequest.send();
        } else {
            httpRequest.send(params);
        }
        
    });
};

/*
    Codigo necesario para calcular el SHA-256 de la contraseña.
    Convierte de String a ArrayBuffer y viceversa.
*/
const StringToArrayBuffer = (str) => {
    return new TextEncoder('utf-8').encode(str);
};
const ArrayBufferToString = (hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
};