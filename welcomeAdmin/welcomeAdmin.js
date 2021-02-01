
const checkLog = () => {
    httpRequestPromise('http://localhost/WebINGEO2Loader/php/login_state.php', null, 'POST', 'json').then((response) => {
        if(!response.success || !response.is_admin) {
            alert("No ha iniciado sesion o su sesion ha caducado.");
            logOut();
        } else {
            document.querySelector('html').setAttribute('style', 'display: flex;');
            document.querySelector('body').setAttribute('style', 'display: flex;');
        }
    });
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
            console.table(response);
        });
    }

};

const configureButtons = () => {
    let addSectorBtn = document.getElementById('addSectorBtn');
    let addUserBtn = document.getElementById('addUserBtn');

    addSectorBtn.onclick = add_sector;
};
window.onload = () => {
    checkLog();
    configureTabs();
    configureButtons();
};



