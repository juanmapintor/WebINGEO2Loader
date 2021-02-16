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
            if(response.error){
                showMsg(true, response.error);
            } else {
                showMsg(false, 'Añadido!');
            }
            loadSector('delete', delSector);
        });

        showMsg(false, 'Anadiendo...', 0);
    }

};

const delSector = (id) => {
    let params = {
        sector_id: id
    };
    httpRequestPromise(general_url + 'del_sector.php', params, 'POST', 'json').then(response => {
        if(response.error){
            showMsg(true, response.error);
        } else {
            showMsg(false, 'Eliminado!');
        }
        loadSector('delete', delSector);
    });
    showMsg(false, 'Eliminando...', 0);
};
