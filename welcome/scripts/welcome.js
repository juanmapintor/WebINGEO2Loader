
/*
    Checkea que el usuario dado este loggeado, y, en caso de indicarlo, que sea administrador.
*/

const checkLog = (isAdmin = false) => {
    httpRequestPromise(general_url + 'login_state.php', null, 'POST', 'json').then((response) => {
        if((!response.success || response.is_admin != isAdmin) && !response.first_time) {
            alert("No ha iniciado sesion o su sesion ha caducado.");
            logOut();
        } else {
            document.querySelector('html').setAttribute('style', 'display: flex;');
            document.querySelector('body').setAttribute('style', 'display: flex;');
        }
    });
};

/*
    Convierte la imagen especificada por file a base64.
*/
const getBase64 = (file) => {
    return  new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
/*
    Genera una cadena semi-aleatoria del largo especificado. 
*/
const makeRandom = (length) => {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 };

/*
    Devuelve verdadero si un string tiene espacios de cualquier tipo (tab, whitespace, etc)
*/

function hasWhiteSpace(s) {
   return /\s/g.test(s);
}

/*
    Cargan sectores en una tabla llamada 'sectorsTable'
*/

const loadSector = (type, action, tableId = 'sectorsTable', selectedSectors = []) => {
    let sectorsTable = document.getElementById(tableId);
    sectorsTable.innerHTML = '';
    let newRow = sectorsTable.insertRow(0);
    newRow.insertCell().innerHTML = 'Categoria';
    newRow.insertCell().innerHTML = 'Sector';
    if(type) {
        if(type == 'delete') newRow.insertCell().innerHTML = 'Eliminar';
        if(type == 'select') newRow.insertCell().innerHTML = 'Seleccionar';
    }

    httpRequestPromise(general_url + 'sector_load.php', null, 'POST', 'json').then((response) => {
        if(response){
            if(!response.error){
                if(response.length > 0) {
                    response.forEach(element => addTableRow(element, type, action, tableId, selectedSectors.includes(element[0])));
                } else {
                    addTableRow(null, null, null, tableId, false, true);
                }
            } else {
                showMsg(true, response.error);
            }
        }
        
    });
};

const addTableRow = (row, type, action, tableId, selected = false, empty = false) => {
    let sectorsTable = document.getElementById(tableId);
    let newRow = sectorsTable.insertRow();
    
    if(!empty) {
        newRow.insertCell().innerHTML = row[1];
        newRow.insertCell().innerHTML = row[2];

        if(type) {
            let newActionCell = newRow.insertCell();
            let newAction;
            if(type == 'delete') {
                newAction = document.createElement('button');
                newActionCell.classList.add('delTd');
                newAction.innerHTML = 'X';
                newAction.addEventListener('click', () => action(row[0]));
            }

            if(type == 'select') {
                newAction = document.createElement('input');
                newAction.setAttribute('type', 'checkbox');
                newAction.checked = selected;
                if(selected) {
                    action(row[0], selected);
                }
                newAction.addEventListener('click', () => action(row[0], newAction.checked));
            }
            newActionCell.appendChild(newAction);
        }
    } else {
        newRow.innerHTML  = "No hay sectores que mostrar. Agrega uno!";
    }
    
    

};

const configureTabs = () =>{
    const selectTab = (tabs, tabNum) => {
        let tabContents = document.querySelectorAll('.tabContent');
        tabs.forEach(tab => {
            tab.classList.remove('selected');
        });
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('selected');
        });

        tabs[tabNum].classList.add('selected');
        tabContents[tabNum].classList.add('selected');
    };
    let tabs = document.querySelectorAll('.tab');
    for(let i = 0; i < tabs.length; i++){
        tabs[i].onclick = () => {
            selectTab(tabs, i);
        };
    }
};

const configureGeneralButtons = () => {
    let exitButton = document.getElementById('exitButton');
    exitButton.onclick = logOut;
};

const configureButtons = () => {
    configureGeneralButtons();
    configureProfileButtons();
    configurePasswordButtons();
    configureArticleButtons();
};

const onChange = () => {
    onModifyChange();
    onArticleChange();
};