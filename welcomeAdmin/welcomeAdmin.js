window.onload = () => {
    httpRequestPromise('http://localhost/WebINGEO2Loader/php/login_state.php', null, 'POST', 'json').then((response) => {
        if(!response.success) {
            alert("No ha iniciado sesion o su sesion ha caducado.");
            httpRequestPromise('http://localhost/WebINGEO2Loader/php/session_end.php').then(()=>{
                location.replace("/");
            });
        }
    });
};