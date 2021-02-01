const add_sector = () => {
    let sector_category = document.getElementById('sector_category');
    let sector_name = document.getElementById('sector_name');

    if(!sector_category.value) {
        sector_category.setAttribute('style', 'border: 2px solid red;');
    }

    if(!sector_name.value) {
        sector_name.setAttribute('style', 'border: 2px solid red;');
    }

    if(sector_category.value && sector_name.value){
        let params = {
            sector_category: sector_category.value,
            sector_name: sector_name.value
        }; 
        
        httpRequestPromise(general_url + 'add_sector.php', params, 'POST', 'json').then((response) => {
            showMsg(response, 'Añadido!');
            loadSector();
        });
    }

};

const loadSector = () => {
    let sectorsTable = document.getElementById('sectorsTable');
    sectorsTable.innerHTML = '';
    let newRow = sectorsTable.insertRow(0);
    newRow.insertCell().innerHTML = 'Categoria';
    newRow.insertCell().innerHTML = 'Sector';
    newRow.insertCell().innerHTML = 'Eliminar';
    httpRequestPromise(general_url + 'sector_load.php', null, 'POST', 'json').then((response) => {
        response.forEach(element => addTableRow(element));
    });
};

const addTableRow = (row) => {
    let sectorsTable = document.getElementById('sectorsTable');
    let newRow = sectorsTable.insertRow();
    newRow.insertCell().innerHTML = row[1];
    newRow.insertCell().innerHTML = row[2];
    let newBtnCell = newRow.insertCell();
    let newBtn = document.createElement('button');
    newBtnCell.classList.add('delTd');
    newBtn.innerHTML = 'X';
    newBtn.addEventListener('click', () => delSector(row[0]));
    newBtnCell.appendChild(newBtn);

};

const delSector = (id) => {
    let params = {
        sector_id: id
    };
    httpRequestPromise(general_url + 'del_sector.php', params, 'POST', 'json').then(response => {
        showMsg(response, 'Eliminado!');
        loadSector();
    });
};
