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
        console.table(response.sectors);
        if(response) {
            if(!response.error){
                profileImg.setAttribute('src', response.profile_img);
                fullName.innerHTML = response.first_name + ' ' + response.last_name;
                userName.innerHTML = response.usr_name;
                emailInfo.innerHTML = response.email;
                degree.innerHTML = response.degree;
                shortDesc.innerHTML = response.short_description;
                phoneNum.innerHTML = response.phone_number;
                weblink.setAttribute('href', response.web_link);
                weblinkh.innerHTML = response.web_link;

                response.sectors.forEach(sector => {
                    console.log(sector);
                    let cell = sectorsTableWork.insertRow().insertCell();
                    cell.innerHTML = sector[0] + " de " + sector[1];
                    cell.setAttribute('style', 'padding: 10px;');
                });

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