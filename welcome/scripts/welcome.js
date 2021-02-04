
/*
    Checkea que el usuario dado este loggeado, y, en caso de indicarlo, que sea administrador.
*/

const checkLog = (isAdmin = false) => {
    httpRequestPromise('http://localhost/WebINGEO2Loader/php/login_state.php', null, 'POST', 'json').then((response) => {
        if((!response.success || response.is_admin != isAdmin) && !response.first_time) {
            alert("No ha iniciado sesion o su sesion ha caducado.");
            logOut();
        } else {
            document.querySelector('html').setAttribute('style', 'display: flex;');
            document.querySelector('body').setAttribute('style', 'display: flex;');
        }
    });
};