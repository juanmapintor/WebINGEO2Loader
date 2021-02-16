
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

const onChange = () => {
    let sector_category = document.getElementById('sector_category');
    let sector_name = document.getElementById('sector_name');

    sector_category.onchange = () => {
        sector_category.removeAttribute('style');
    };

    sector_name.onchange = () => {
        sector_name.removeAttribute('style');
    };

    onModifyChange();

};

const configureButtons = () => {
    let exitButton = document.getElementById('exitButton');
    let addSectorBtn = document.getElementById('addSectorBtn');
    let addUserBtn = document.getElementById('addUserBtn');
    let profileModifyBtn = document.getElementById('profileModifyBtn');
    let acceptModifyBtn = document.getElementById('acceptModifyBtn');
    let cancelModifyBtn = document.getElementById('cancelModifyBtn');
    let acceptPasswordModifyBtn = document.getElementById('acceptPasswordModifyBtn');
    let cancelPasswordModifyBtn = document.getElementById('cancelPasswordModifyBtn');
    let passwordModifyBtn = document.getElementById('passwordModifyBtn');


    addSectorBtn.onclick = add_sector;
    addUserBtn.onclick = add_user;
    exitButton.onclick = logOut;
    profileModifyBtn.onclick = showModify;
    acceptModifyBtn.onclick = acceptModify;
    cancelModifyBtn.onclick = hideModify;
    passwordModifyBtn.onclick = showPasswordModify;
    cancelPasswordModifyBtn.onclick = hidePasswordModify;
    acceptPasswordModifyBtn.onclick = acceptPasswordModify;



};



window.onload = () => {
    checkLog(true);
    configureTabs();
    configureButtons();
    loadSector('delete', delSector);
    loadUsers();
    loadProfile();
    onChange();
};



