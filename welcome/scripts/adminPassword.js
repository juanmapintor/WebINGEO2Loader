const showPasswordModify = () => {
    let passwordDiv = document.getElementById('passwordDiv');
    let infoShow = document.getElementById('infoShow');

    infoShow.classList.remove('division');
    infoShow.classList.add('hidden');

    passwordDiv.classList.remove('hidden');
    passwordDiv.classList.add('division');
};

const hidePasswordModify = () => {
    let passwordDiv = document.getElementById('passwordDiv');
    let infoShow = document.getElementById('infoShow');

    infoShow.classList.add('division');
    infoShow.classList.remove('hidden');

    passwordDiv.classList.add('hidden');
    passwordDiv.classList.remove('division');
};

const acceptPasswordModify = () => {
    let oldPasswordMod = document.getElementById('oldPasswordMod');
    let oldPasswordRepeatMod = document.getElementById('oldPasswordRepeatMod');
    let newPasswordMod = document.getElementById('newPasswordMod');
    let newPasswordRepeatMod = document.getElementById('newPasswordRepeatMod');

    if(oldPasswordMod.value != '' && newPasswordMod.value != '' && oldPasswordMod.value == oldPasswordRepeatMod.value && newPasswordMod.value == newPasswordRepeatMod.value) {
        httpRequestPromise(general_url + 'get_pass.php', null, 'POST', 'json').then(response => {
            if(response){
                if(!response.error){
                    hideMsg();
                    crypto.subtle.digest('SHA-256', StringToArrayBuffer(oldPasswordMod.value+response.usr_password_salt)).then((hashedPass) => {
                        if(response.usr_password == ArrayBufferToString(hashedPass)) {
                            crypto.subtle.digest('SHA-256', StringToArrayBuffer(newPasswordMod.value+response.usr_password_salt)).then((newHashedPass) => {
                                httpRequestPromise(general_url + 'user_modify.php', {usr_password: ArrayBufferToString(newHashedPass)}, 'POST', 'json').then(newResponse =>{
                                    if(newResponse){
                                        if(!newResponse.error) {
                                            showMsg(false, 'Contraseña cambiada con exito!', 1500, () => {
                                                showMsg(false, 'Vuelva a iniciar sesion.', 1500, logOut);
                                            });
                                        } else {
                                            showMsg(true, newResponse.error);
                                        }
                                    }
                                });
                            });
                        } else {
                            showMsg(true, 'Contraseña incorrecta.');
                        }
                    });
                } else {
                    showMsg(true, response.error);
                }
            }
        });
    } else {
        showMsg(true, 'Las contraseñas no coinciden.');
    }
    

};

const configurePasswordButtons = () => {
    let acceptPasswordModifyBtn = document.getElementById('acceptPasswordModifyBtn');
    let cancelPasswordModifyBtn = document.getElementById('cancelPasswordModifyBtn');
    let passwordModifyBtn = document.getElementById('passwordModifyBtn');
    passwordModifyBtn.onclick = showPasswordModify;
    cancelPasswordModifyBtn.onclick = hidePasswordModify;
    acceptPasswordModifyBtn.onclick = acceptPasswordModify;
};