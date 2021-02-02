
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

const configureButtons = () => {
    let exitButton = document.getElementById('exitButton');
    let addSectorBtn = document.getElementById('addSectorBtn');
    let addUserBtn = document.getElementById('addUserBtn');

    addSectorBtn.onclick = add_sector;
    exitButton.onclick = logOut;

};



window.onload = () => {
    checkLog(true);
    configureTabs();
    configureButtons();
    loadSector();
};



