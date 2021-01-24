let general_url = 'http://localhost/WebINGEO2Loader/php/';
/*
    Función que realiza el login una vez que tenemos la "sal" para la contraseña. 
*/
const loginWithSalt = (user, password, salt, is_admin, responseMsg) => {
    //Crypto funciona solo en localhost o en conexiones seguras (https)
    crypto.subtle.digest('SHA-256', StringToArrayBuffer(password+salt)).then((hashedPass) => {
        let params = {
            usr_name: user,
            usr_password: ArrayBufferToString(hashedPass),
            is_admin : is_admin
        };
        
        httpRequestPromise(general_url + 'db_login.php', params, 'POST', 'json').then((response) => {
            if(response.success){
                if(is_admin) {
                    window.location.href = "welcomeAdmin";
                } else {
                    window.location.href = "welcomeUser";
                }
            } else {
                responseMsg.setAttribute('style', 'color: red;');
                if(response.error){
                    switch(response.error){
                        case 'E1': responseMsg.innerHTML = 'No se pudo conectar a la base de datos. Comuniquese con un administrador.'; break;
                        case 'E2': responseMsg.innerHTML = 'El formulario esta mal formateado. Comuniquese con un administrador.'; break;
                    }
                } else {
                    responseMsg.innerHTML = 'Contraseña ingresada incorrecta.';
                }
            }
        });
    });
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
        responseMsg.setAttribute('style', 'color: red;')
        responseMsg.innerHTML = 'Ingrese un usuario y una contraseña.';
    } else {
        httpRequestPromise(general_url + 'db_check_salt.php', { usr_name: usrInput.value}, 'POST', 'json').then((response) =>{
            if(response.error){
                responseMsg.setAttribute('style', 'color: red;')
                switch(response.error) {
                    case 'E1': responseMsg.innerHTML = 'Usuario inexistente.'; break;
                    case 'E2': responseMsg.innerHTML = 'No se pudo conectar a la DB. Contactese con un administrador.'; break;
                    case 'E3': responseMsg.innerHTML = 'No se ingreso el usuario o contraseña.'; break;
                }
            } else {
                responseMsg.setAttribute('style', 'color: green;')
                responseMsg.innerHTML = 'Iniciando sesion...';
                loginWithSalt(usrInput.value, passInput.value, response.salt, response.is_admin, responseMsg);
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
