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
        
        httpRequestPromise(general_url + 'db_login.php', params, 'POST', 'json').then((response) => {
            
            if(response){
                if(response.success){
                    showMsg(false, 'Sesion iniciada.')
                    setTimeout(() => {
                        if(response.first_time){
                            window.location.href = 'welcome/welcomeFirstTime';
                        } else if(is_admin) {
                            window.location.href = 'welcome/welcomeAdmin';
                        } else {
                            window.location.href = 'welcome/welcomeUser';
                        }
                    }, 1500);
                } else {
                    if(response.error){
                        showMsg(true, response.error);
                    }
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

    if(!usrInput.value || !passInput.value) {
        showMsg(true, "Ingrese su usuario y contraseña.")
    } else {
        httpRequestPromise(general_url + 'db_check_salt.php', { usr_name: usrInput.value}, 'POST', 'json').then((response) =>{
            if(response.error){
                showMsg(true, response.error);
            } else {
                loginWithSalt(usrInput.value, passInput.value, response.salt, response.is_admin);
            }
        }).catch((error) => {
            console.error(error);
        });

        showMsg(false, 'Iniciando Sesion...', 0);
    }
};

window.onload = () => {
    logOut();
    let submitButton = document.getElementById('submit');
    submitButton.onclick = login;
    document.onkeypress = (event) =>{
        if(event.key == 'Enter') {
            login();
        }
    };
};
