let general_url = 'http://localhost/WebINGEO2Loader/php/';

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
    Función que realiza el login una vez que tenemos la "sal" para la contraseña. 
*/
const loginWithSalt = (user, password, salt, is_admin) => {
    //Crypto funciona solo en localhost o en conexiones seguras (https)
    crypto.subtle.digest('SHA-256', StringToArrayBuffer(password+salt)).then((hashedPass) => {
        let params = {
            usr_name: user,
            usr_password: ArrayBufferToString(hashedPass),
            is_admin : is_admin
        };
        
        httpRequestPromise(general_url + 'db_login.php', params).then((response) => {
            console.log(response);
        });
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
    Función de login, en primer lugar chechea la existencia del usuario y obtiene su sal.
    Luego, delega el resto del proceso de login a la función "loginWithSalt".
*/
const login = () => {
    let usrInput = document.getElementById('usr_name');
    let passInput = document.getElementById('usr_password');
    let responseMsg = document.getElementById('responseMsg');

    if(!usrInput.value || !passInput.value) {
        responseMsg.innerHTML = 'Ingrese un usuario y una contraseña.';
    } else {
        httpRequestPromise(general_url + 'db_check_salt.php', { usr_name: usrInput.value}, 'POST', 'json').then((response) =>{
            if(response.error){
                switch(response.error) {
                    case 'E1': responseMsg.innerHTML = 'Usuario inexistente.'; break;
                    case 'E2': responseMsg.innerHTML = 'No se ingreso el usuario o contraseña.'; break;
                    case 'E3': responseMsg.innerHTML = 'No se pudo conectar a la DB. Contactese con un administrador.'; break;
                }
            } else {
                responseMsg.innerHTML = 'Iniciando sesion...';
                loginWithSalt(usrInput.value, passInput.value, response.salt, response.is_admin);
            }
        }).catch((error) => {
            console.error(error);
        });
    }
};

window.onload = () => {
    let submitButton = document.getElementById('submit');
    submitButton.onclick = login;
};
