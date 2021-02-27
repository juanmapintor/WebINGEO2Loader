
const loadUsers = () => {
    let usersTable = document.getElementById('usersTable');
    usersTable.innerHTML = '';
    let newRow = usersTable.insertRow(0);
    newRow.insertCell().innerHTML = 'Usuario';
    newRow.insertCell().innerHTML = 'Nombre';
    newRow.insertCell().innerHTML = 'Apellido';
    newRow.insertCell().innerHTML = 'Mail';
    newRow.insertCell().innerHTML = 'Eliminar';
    httpRequestPromise(general_url + 'user_load.php', null, 'POST', 'json').then((response) => {
        if(!response.error){
            hideMsg();
            response.forEach(element => addUserTableRow(element)); 
        } else {
            showMsg(true, response.error);
        }
        
    });
};

const addUserTableRow = (row) => {
    let usersTable = document.getElementById('usersTable');
    let newRow = usersTable.insertRow();
    newRow.insertCell().innerHTML = row[1];
    newRow.insertCell().innerHTML = row[2];
    newRow.insertCell().innerHTML = row[3];
    newRow.insertCell().innerHTML = row[4];
    let newBtnCell = newRow.insertCell();
    let newBtn = document.createElement('button');
    newBtnCell.classList.add('delTd');
    newBtn.innerHTML = 'X';
    newBtn.addEventListener('click', () => delUser(row[0]));
    newBtnCell.appendChild(newBtn);

};

const delUser = (id) => {
    let params = {
        user_id: id
    };

    showMsg(false, 'Eliminando...', 0);
    httpRequestPromise(general_url + 'del_user.php', params, 'POST', 'json').then(response => {
        if(!response.error){
            showMsg(false, 'Eliminado!');
            reset();
        } else {
            showMsg(true, response.error);
        }
        loadUsers();
    });
};

const add_user = () => {
    let email = document.getElementById('email');
    if(!email.value){
        email.setAttribute('style', 'border: 2px solid red;');
    } else {
        let usr_name = makeRandom(8);
        let usr_password_unencripted = makeRandom(8);
        let usr_password_salt = makeRandom(8);
        let added = false;

        crypto.subtle.digest('SHA-256', StringToArrayBuffer(usr_password_unencripted+usr_password_salt)).then((hashedPass) => {
            let params = {
                usr_name: usr_name,
                usr_password: ArrayBufferToString(hashedPass),
                usr_password_unencripted: usr_password_unencripted,
                usr_password_salt: usr_password_salt,
                email: email.value,
                first_name: 'Nombre',
                last_name: 'Apellido',
                is_admin: document.getElementById('is_admin').checked ? 1 : 0 
            };

            showMsg(false, 'Agregando... <br> Por favor, <br> espere.', 0);
            httpRequestPromise(general_url + 'add_user.php', params, 'POST', 'json').then(response => {
                if(response.error){
                    showMsg(true, response.error);
                } else {
                    showMsg(false, 'Agregado!');
                }
                loadUsers();
                reset();
            });

        }); 
    }
    

    
};

const configureUsersButtons = () => {
    let addUserBtn = document.getElementById('addUserBtn');
    addUserBtn.onclick = add_user;
};

