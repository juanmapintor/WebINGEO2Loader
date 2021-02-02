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
            showMsg(response, 'Sesion iniciada.')
            if(response.success){
                setTimeout(() => {
                    if(response.first_time){
                        window.location.href = 'firstTime';
                    } else if(is_admin) {
                        window.location.href = 'welcome/welcomeAdmin';
                    } else {
                        window.location.href = 'welcome/welcomeUser';
                    }
                }, 1500);
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
                showMsg(response, '');
            } else {
                loginWithSalt(usrInput.value, passInput.value, response.salt, response.is_admin, responseMsg);
            }
        }).catch((error) => {
            console.error(error);
        });
    }
};

window.onload = () => {
    logOut();
    let submitButton = document.getElementById('submit');
    submitButton.onclick = login;
};
