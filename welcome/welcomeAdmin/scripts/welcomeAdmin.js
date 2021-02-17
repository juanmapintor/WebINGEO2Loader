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
    onSectorChange();
    onModifyChange();
    onArticleChange();
};

const configureGeneralButtons = () => {
    let exitButton = document.getElementById('exitButton');
    exitButton.onclick = logOut;
};

const configureButtons = () => {
    configureGeneralButtons();
    configureSectorButtons();
    configureUsersButtons();
    configureProfileButtons();
    configurePasswordButtons();
    configureArticleButtons();
};

window.onload = () => {
    checkLog(true);
    configureTabs();
    configureButtons();
    loadSector('delete', delSector);
    loadUsers();
    loadProfile();
    loadArticleSectorsSelect();
    loadCKEditor();
    onChange();
};



