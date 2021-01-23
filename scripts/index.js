let general_url = 'http://localhost/WebINGEO2Loader/php/';

const httpRequestPromise = (url, params = null, method = 'POST', responseType="", header='Content-type', headerValue='application/x-www-form-urlencoded') => {
    return new Promise((resolve, reject) => {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open(method, url, true);
        httpRequest.setRequestHeader(header, headerValue);
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
        
        if (params && typeof params === 'object') {
            params = Object.keys(params).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
            }).join('&');
        }

        httpRequest.responseType = responseType;
        httpRequest.send(params);
    });
};

const loginWithSalt = (user, password, salt, is_admin) => {
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

const StringToArrayBuffer = (str) => {
    return new TextEncoder('utf-8').encode(str);
};

const ArrayBufferToString = (hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hashHex;
};



window.onload = () => {
    let submitButton = document.getElementById('submit');
    let usrInput = document.getElementById('usr_name');
    let passInput = document.getElementById('usr_password');
    let responseMsg = document.getElementById('responseMsg');

    submitButton.onclick = () => {
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
                    loginWithSalt(usrInput.value, passInput.value, response.salt, response.is_admin);
                }
            }).catch((error) => {
                console.error(error);
            });
        }

    };
};
