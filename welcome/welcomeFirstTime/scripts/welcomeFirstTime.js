let params = {
    first_name: '', 
    last_name: '', 
    usr_name: '', 
    usr_password: '', 
    usr_password_salt: '', 
    degree: '', 
    profile_img: '', 
    short_description: '', 
    phone_number: '', 
    web_link: '',
    sectors: []
}; 

const showCropImage = (imageFile) => {
    let croppieDiv = document.getElementById('croppieDiv');
    let acceptDiv = document.getElementById('acceptDiv');
    let croppieImage = document.getElementById('croppieImage');
    let resultImage = document.getElementById('resultImage');
    let acceptCroppieButton = document.getElementById('acceptCroppieButton');

    getBase64(imageFile).then(response => {
        croppieImage.setAttribute('src', response);
        let croppie = new Croppie(croppieImage, 
            {
                viewport: { width: 300, height: 300, type: 'circle' },
                boundary: { width: 300, height: 300 },
                showZoomer: true
            }
        );
        croppieDiv.setAttribute('style','display: flex;');
        acceptDiv.setAttribute('style', 'display: flex;');

        acceptCroppieButton.onclick = () => {
            croppie.result('base64').then(response => {
                resultImage.setAttribute('src', response);
                params.profile_img = response;
                croppieDiv.setAttribute('style','display: none;');
                acceptDiv.setAttribute('style', 'display: none;');
                croppie.destroy();
            });
        };

    });

};

const accept = () => {
    let first_name_input = document.getElementById('first_name');
    let last_name_input = document.getElementById('last_name');
    let user_name_input = document.getElementById('user_name');
    let password_input = document.getElementById('password');
    let repeat_password_input = document.getElementById('repeat_password');

    let onCondition = true;

    if(!first_name_input.value) {
        first_name_input.classList.add('redBorder');
        onCondition = false;
    }

    if(!last_name_input.value) {
        last_name_input.classList.add('redBorder');
        onCondition = false;
    }

    if(!user_name_input.value || hasWhiteSpace(user_name_input.value)) {
        user_name_input.classList.add('redBorder');
        onCondition = false;
    }

    if (!password_input.value || !repeat_password_input.value || password_input.value!=repeat_password_input.value || password_input.value.length < 8) {
        password_input.classList.add('redBorder');
        repeat_password_input.classList.add('redBorder');
        document.getElementById('passwordAlert').setAttribute('style', 'display: flex;')
        onCondition = false;
    }

    if(onCondition) {

        params.first_name = first_name_input.value;
        params.last_name = last_name_input.value;
        params.usr_name = user_name_input.value;
        params.usr_password_salt = makeRandom(8);
        params.degree = document.getElementById('degree').value;
        params.short_description = document.getElementById('short_description').value;
        params.phone_number = document.getElementById('phone').value;
        params.web_link = document.getElementById('weblink').value;

        crypto.subtle.digest('SHA-256', StringToArrayBuffer(password_input.value+params.usr_password_salt)).then((hashedPass) => {
            params.usr_password = ArrayBufferToString(hashedPass);

            httpRequestPromise(general_url + 'save_first_time_user.php', params, 'POST', 'json').then(response => {
                console.log(response);
                if(response){
                    if(response.success){
                        let main = document.getElementById('main');
                        main.innerHTML = '';
                        let success = document.createElement('p');
                        success.innerHTML = '<br> <br> Datos actualizados!  <br> <br>Inicie sesion nuevamente con sus nuevas credenciales'
                        main.appendChild(success);
                        showMsg(false, 'Exito!', 2500, logOut);
                    } else {
                        if(response.error) {
                            showMsg(true, response.error, 2500);
                        }
                    }
                } 
            });
        }); 

    }

};

const configureButtons = () => {
    let acceptButton = document.getElementById('acceptButton');
    acceptButton.onclick = accept;

    let exitButton = document.getElementById('exitButton');
    exitButton.onclick = logOut;
};
const configueOnChange = () => {
    let imageFile = document.getElementById('imageFile');
    imageFile.onchange = () => {
        showCropImage(imageFile.files[0]);
    };

    let compulsoryElements = [document.getElementById('first_name'), document.getElementById('last_name'),
                                document.getElementById('user_name'),  document.getElementById('password'),
                                document.getElementById('repeat_password')];
    compulsoryElements.forEach(element => {
        element.onchange = () => {
            element.classList.remove('redBorder');
        };
    });


};
const setSectors = (id, set) => {
    if(set) {
        params.sectors.push(id);
    } else {
        let index = params.sectors.indexOf(id);
        if(index > -1){
            params.sectors.splice(index, 1);
        }
    }
}

window.onload = () => {
    checkLog();
    configureButtons();
    configueOnChange();
    loadSector('select', setSectors, 'sectorsTable2');
};

