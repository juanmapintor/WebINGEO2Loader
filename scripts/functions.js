/* CUIDADO. CAMBIAR LOCALHOST POR URL */
let general_url = 'http://localhost/WebINGEO2Loader/php/';

/*
    Función que "promesifica" una XMLHTTPRequest. Necesita de parametros minimos para funcionar, 
    solo la URL a ser consultada.
    Devuelve la respuesta en el formato especificado por el parametro responseType.

    Cuenta con valores por defecto para:
    - params: null. No envia parametros adicionales.
    - method: POST. 
    - responseType:  json. Respuesta tipo texto. En caso de elegir otro tipo de respuesta, es importante que 
    el header este configurado en el script del servidor.
    - header/headerValue: Array de headers. Por defecto: "Content-type: application/x-www-form-urlencoded". 
    MIME Header para la request, por defecto, formulario codificado para URL.

    Por el momento, funciona bien con metodos GET y POST. No ha sido probado con otros metodos.

    PARA HACER: reemplazar parametros conn objeto JSON de configuración.
*/
const httpRequestPromise = (url, params = null, method = 'POST', responseType='json', headers = [ { header: 'Content-type', headerValue: 'application/x-www-form-urlencoded'} ]) => {
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

/*

Elimina cualquier session existente.

*/

const logOut = () => {
    httpRequestPromise('http://localhost/WebINGEO2Loader/php/session_end.php').then(()=>{
        if(location.href != 'http://localhost/WebINGEO2Loader/') location.replace('http://localhost/WebINGEO2Loader/');
    });
};

/* 

Muestra el mensaje enviado por parametro en cualquiera de las paginas. 

*/

const showMsg = (error, msg, timeout = 1500, action = () => {}) =>{
    let msgs = document.querySelectorAll('.Msg');
    msgs.forEach(msg =>{
        msg.classList.remove('show');
    });

    if(!error){
        let successMsg = document.querySelector('.successMsg');
        successMsg.classList.add('show');
        let successMsgHolder = document.getElementById('successMsgHolder');
        successMsgHolder.innerHTML = msg;
        if(timeout != 0){
            setTimeout(() => {
                successMsg.classList.remove('show');
                successMsgHolder.innerHTML = '';
                action();
            }, timeout);
        }
    } else {
        let errorMsg = document.querySelector('.errorMsg');
        errorMsg.classList.add('show');
        let errorMsgHolder = document.getElementById('errorMsgHolder');
        errorMsgHolder.innerHTML = msg;
        if(timeout!=0){
            setTimeout(() => {
                errorMsg.classList.remove('show');
                errorMsgHolder.innerHTML = '';
                action();
            }, timeout); 
        }
    }
};

const hideMsg = () => {
    let msgs = document.querySelectorAll('.Msg');
    msgs.forEach(msg =>{
        msg.classList.remove('show');
    });
};

