let params = {
};

let originalSectors = [];
let newSectors = [];

const setSectors = (id, set) => {
    if(set) {
        newSectors.push(id);
    } else {
        let index = newSectors.indexOf(id);
        if(index > -1){
            newSectors.splice(index, 1);
        }
    }
}

const loadProfile = () => {
    let profileImg = document.getElementById('profile_img');
    let fullName = document.getElementById('full_name');
    let userName = document.getElementById('user_name');
    let emailInfo = document.getElementById('email_info');
    let degree = document.getElementById('degree');
    let shortDesc = document.getElementById('short_description');
    let phoneNum = document.getElementById('phone_number');
    let weblink = document.getElementById('weblink');
    let weblinkh =  document.getElementById('weblinkh');
    let sectorsTableWork = document.getElementById('sectorsTableWork');
    

    httpRequestPromise(general_url + 'get_user_info.php', null, 'POST', 'json').then(response => {
        if(response) {
            if(!response.error){
                profileImg.setAttribute('src', response.profile_img);
                fullName.innerHTML = response.first_name + ' ' + response.last_name;
                userName.innerHTML = response.usr_name;
                emailInfo.innerHTML = response.email;
                degree.innerHTML = response.degree;
                shortDesc.innerHTML = response.short_description;
                phoneNum.innerHTML = response.phone_number;
                weblink.setAttribute('href', 'http://' + response.web_link);
                weblinkh.innerHTML = response.web_link;
                sectorsTableWork.innerHTML = '';

                response.sectors.forEach(sector => {
                    let cell = sectorsTableWork.insertRow().insertCell();
                    cell.innerHTML = sector[1] + " de " + sector[2];
                    cell.setAttribute('style', 'padding: 10px;');
                });

                loadModify(response);

            } else {
                showMsg(true, response.error, 0, logOut);
            }
        } else {
            showMsg(true, "Problema de respuesta de servidor.", 0, logOut);
        }
        
    }).catch(rejected => {
        showMsg(true, "Problema de comunicación con el servidor.", 0, logOut);
    });
};  

const showModify = () => {
    let infoShow = document.getElementById('infoShow');
    let modifyDiv = document.getElementById('modifyDiv');

    infoShow.classList.remove('division');
    infoShow.classList.add('hidden');
    modifyDiv.classList.remove('hidden');
    modifyDiv.classList.add('division');
};

const acceptModify = () => {
    let ready = true;



    let resultImage = document.getElementById('resultImage');
    let firstName = document.getElementById('first_name_mod');
    let lastName = document.getElementById('last_name_mod');
    let userName = document.getElementById('user_name_mod');
    let emailInfo = document.getElementById('email_mod');
    let degree = document.getElementById('degree_mod');
    let shortDesc = document.getElementById('short_description_mod');
    let phoneNum = document.getElementById('phone_mod');
    let weblink = document.getElementById('weblink_mod');

    if(firstName.value) {
        params.first_name = firstName.value;
        firstName.value = null;
    } else if(params.first_name) {
        delete params.first_name;
    }

    if(lastName.value) { 
        params.last_name = lastName.value;
        lastName.value = null;
    } else if(params.last_name) {
        delete params.last_name;
    }
    
    if(userName.value && !hasWhiteSpace(userName.value)) {
        params.usr_name = userName.value;
        userName.value = null;
    } else if(params.usr_name){
        delete params.usr_name;
    } else if(userName.value!="") {
        showMsg(true, "Su usuario tiene espacios.");
        ready = false;
    }

    if(emailInfo.value) {
        params.email = emailInfo.value;
        emailInfo.value = null;
    } else if(params.email) {
        delete params.email;
    }

    if(degree.value) {
        params.degree = degree.value;
        degree.value = null;
    } else if(params.degree){
        delete params.degree;
    }

    if(shortDesc.value){
        params.short_description = shortDesc.value;
        shortDesc.value = null;
    } else if(params.short_description) {
        delete params.short_description;
    }

    if(phoneNum.value) {
        params.phone_number = phoneNum.value;
        phoneNum.value = null;
    } else if(params.phone_number) {
        delete params.phone_number;
    }

    if(weblink.value) {
        params.web_link = weblink.value;
        weblink.value = null;
    } else if(params.web_link) {
        delete params.web_link;
    }

    if(resultImage.getAttribute('src')){
        params.profile_img = resultImage.getAttribute('src');
        resultImage.setAttribute('src', '');
        document.getElementById('resultDiv').setAttribute('style', 'display: none;');
    } else if(params.profile_img) {
        delete params.profile_img;
    }

    if(originalSectors.length == newSectors.length) {
        let same = true;
        originalSectors.forEach(sector => {
            same = same && newSectors.includes(sector);
        });
        if(!same) {
            params.sectors = newSectors;
        } else {
            delete params.sectors;
        }
    } else {
        params.sectors = newSectors;
    }

    if(ready && JSON.stringify(params) != '{}'){
        httpRequestPromise(general_url + 'user_modify.php', params, 'POST', 'json').then(response => {
            if(response){
                if(!response.error){
                    showMsg(false, "Exito!", 1000, hideModify);
                } else {
                    let error = "Error: ";
                    switch(response.error){
                        case 'first_name': error = error + "FN1"; break; 
                        case 'last_name': error = error + "LN1";  break; 
                        case 'usr_name': error = error + "Usuario existente.";  break;
                        case 'degree': error = error + "DG"; break;
                        case 'profile_img': error = error + "PFIMG"; break;
                        case 'short_description': error = error + "SHDSC";  break;
                        case 'phone_number': error = error + "PHN";  break;
                        case 'web_link': error = error + "WL";  break;
                        case 'sectors': error = error + "S"; break;
                    }
                    showMsg(true, error, 1500, hideModify);
                }
            }
            params = {};
            ready = true;
        });    
    } else {
        showMsg(false, "No hay nada que cambiar.", 1000, hideModify);
    }
    
};

const hideModify = () => {
    
    loadProfile();

    let infoShow = document.getElementById('infoShow');
    let modifyDiv = document.getElementById('modifyDiv');

    infoShow.classList.add('division');
    infoShow.classList.remove('hidden');
    modifyDiv.classList.add('hidden');
    modifyDiv.classList.remove('division');
};

const loadModify = (response) => {
    let firstName = document.getElementById('first_name_mod');
    let lastName = document.getElementById('last_name_mod');
    let userName = document.getElementById('user_name_mod');
    let emailInfo = document.getElementById('email_mod');
    let degree = document.getElementById('degree_mod');
    let shortDesc = document.getElementById('short_description_mod');
    let phoneNum = document.getElementById('phone_mod');
    let weblink = document.getElementById('weblink_mod');

    firstName.setAttribute('placeholder', response.first_name);
    lastName.setAttribute('placeholder', response.last_name);
    userName.setAttribute('placeholder', response.usr_name);
    emailInfo.setAttribute('placeholder', response.email);
    degree.setAttribute('placeholder', response.degree);
    shortDesc.setAttribute('placeholder', response.short_description);
    phoneNum.setAttribute('placeholder', response.phone_number);
    weblink.setAttribute('placeholder', response.web_link);

    newSectors = [];
    originalSectors = [];

    response.sectors.forEach(sector => {
        originalSectors.push(sector[0]);
    });

    

    loadSector('select', setSectors, 'sectorsTableMod', originalSectors);
};

const showCropImage = (imageFile) => {
    let croppieDiv = document.getElementById('croppieDiv');
    let acceptDiv = document.getElementById('acceptDiv');
    let resultDiv = document.getElementById('resultDiv');

    let croppieImage = document.getElementById('croppieImage');
    let resultImage = document.getElementById('resultImage');
    let acceptCroppieButton = document.getElementById('acceptCroppieButton');

    resultDiv.setAttribute('style', 'display: none;');
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
                resultDiv.setAttribute('style', 'display: flex; margin: 20px 0;');
                croppieDiv.setAttribute('style','display: none;');
                acceptDiv.setAttribute('style', 'display: none;');
                croppie.destroy();
            });
        };

    });

};

const onModifyChange = () => {
    let imageFile = document.getElementById('imageFile');
    imageFile.onchange = () => {
        showCropImage(imageFile.files[0]);
    };
}; 
